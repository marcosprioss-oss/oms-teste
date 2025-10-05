import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido';
import { Pedido, PedidoFilter, PageResponse, OrderStatus } from '../../../core/models/pedido.model';
import { Loading } from '../../../core/services/loading';
import { PollingService } from '../../../core/services/polling';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-pedidos-list',
  imports: [CommonModule, FormsModule, RouterModule, StatusBadge],
  templateUrl: './pedidos-list.html',
  styleUrl: './pedidos-list.css'
})
export class PedidosList implements OnInit, OnDestroy {
  pedidos = signal<Pedido[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);

  // Filtros
  statusFilter = signal<OrderStatus | ''>('');
  dataInicio = signal('');
  dataFim = signal('');

  // Estatísticas
  estatisticas = signal<{ [key in OrderStatus]: number }>({
    [OrderStatus.PENDENTE]: 0,
    [OrderStatus.PROCESSANDO]: 0,
    [OrderStatus.CONFIRMADO]: 0,
    [OrderStatus.ENVIADO]: 0,
    [OrderStatus.ENTREGUE]: 0,
    [OrderStatus.CANCELADO]: 0
  });

  constructor(
    private pedidoService: PedidoService,
    private loading: Loading,
    private pollingService: PollingService
  ) { }

  ngOnInit() {
    this.carregarPedidos();
    this.carregarEstatisticas();
    this.pollingService.startPolling();

    // Escutar atualizações do polling
    this.pollingService.pedidosUpdated.subscribe(() => {
      this.carregarPedidos();
      this.carregarEstatisticas();
    });
  }

  ngOnDestroy() {
    this.pollingService.stopPolling();
  }

  carregarPedidos() {
    this.loading.show();

    const filter: PedidoFilter = {
      page: this.currentPage(),
      size: this.pageSize(),
      status: this.statusFilter() || undefined,
      dataInicio: this.dataInicio() ? new Date(this.dataInicio()) : undefined,
      dataFim: this.dataFim() ? new Date(this.dataFim()) : undefined
    };

    this.pedidoService.listarPedidos(filter).subscribe({
      next: (response: PageResponse<Pedido>) => {
        this.pedidos.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.hide();
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.loading.hide();
      }
    });
  }

  carregarEstatisticas() {
    this.pedidoService.obterEstatisticasPedidos().subscribe({
      next: (stats) => {
        this.estatisticas.set(stats);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  onFilterChange() {
    this.currentPage.set(0);
    this.carregarPedidos();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.carregarPedidos();
  }

  cancelarPedido(id: number) {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.loading.show();
      this.pedidoService.cancelarPedido(id).subscribe({
        next: () => {
          this.carregarPedidos();
          this.carregarEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao cancelar pedido:', error);
          this.loading.hide();
        }
      });
    }
  }

  podeCancelar(status: OrderStatus): boolean {
    return status !== OrderStatus.ENVIADO && status !== OrderStatus.ENTREGUE && status !== OrderStatus.CANCELADO;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStatusOptions(): { value: OrderStatus | '', label: string }[] {
    return [
      { value: '', label: 'Todos' },
      { value: OrderStatus.PENDENTE, label: 'Pendente' },
      { value: OrderStatus.PROCESSANDO, label: 'Processando' },
      { value: OrderStatus.CONFIRMADO, label: 'Confirmado' },
      { value: OrderStatus.ENVIADO, label: 'Enviado' },
      { value: OrderStatus.ENTREGUE, label: 'Entregue' },
      { value: OrderStatus.CANCELADO, label: 'Cancelado' }
    ];
  }

  limparFiltros() {
    this.statusFilter.set('');
    this.dataInicio.set('');
    this.dataFim.set('');
    this.onFilterChange();
  }
}
