import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido';
import { Pedido, PedidoFilter, PageResponse, mapPedido } from '../../../core/models/pedido.model';
import { Loading } from '../../../core/services/loading';
import { PollingService } from '../../../core/services/polling';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { StatusPedido } from '../../../core/models/status-pedido.enum';
import { MatColumnDef, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-pedidos-list',
  imports: [CommonModule, FormsModule, RouterModule, StatusBadge, MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatColumnDef],
  templateUrl: './pedidos-list.html',
  styleUrl: './pedidos-list.css'
})
export class PedidosList implements OnInit, OnDestroy {
  pedidos = signal<Pedido[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  statusFilter = signal<StatusPedido | ''>('');

  displayedColumns: string[] = ['id', 'status', 'valorTotal', 'item', 'acoes'];

  estatisticas = signal<{ [key in StatusPedido]: number }>({
    [StatusPedido.PENDENTE]: 0,
    [StatusPedido.PROCESSANDO]: 0,
    [StatusPedido.CONFIRMADO]: 0,
    [StatusPedido.ENVIADO]: 0,
    [StatusPedido.ENTREGUE]: 0,
    [StatusPedido.CANCELADO]: 0
  });

  constructor(
    private pedidoService: PedidoService,
    private loading: Loading,
    private pollingService: PollingService
  ) { }

  ngOnInit() {
    this.carregarPedidos();
    this.carregarEstatisticas();
    // this.pollingService.startPolling();

    // effect(() => {
    //   if (this.pollingService.pedidosUpdated()) {
    //     // this.carregarPedidos();
    //     this.carregarEstatisticas();
    //   }
    // })
  }

  ngAfterViewInit() {
    effect(() => {
      if (this.pollingService.pedidosUpdated()) {
        this.carregarPedidos();
        this.carregarEstatisticas();
      }
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
      status: this.statusFilter() || undefined
    };

    this.pedidoService.listarPedidos(filter).subscribe({
      next: (response: PageResponse<Pedido>) => {
        console.log(response.content, "Response")
        console.log(this.pedidos(), "Response")
        this.pedidos.set(response.content);
        console.log(this.pedidos(), "Response")
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
        const statsObj: Record<StatusPedido, number> = {
          [StatusPedido.PENDENTE]: 0,
          [StatusPedido.PROCESSANDO]: 0,
          [StatusPedido.CONFIRMADO]: 0,
          [StatusPedido.ENVIADO]: 0,
          [StatusPedido.ENTREGUE]: 0,
          [StatusPedido.CANCELADO]: 0
        };
        stats.forEach(item => {
          const key = item.status.toUpperCase() as StatusPedido;
          statsObj[key] = item.quantidade;
        });
        this.estatisticas.set(statsObj);
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

  podeCancelar(status: StatusPedido): boolean {
    return status !== StatusPedido.ENVIADO && status !== StatusPedido.ENTREGUE && status !== StatusPedido.CANCELADO;
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

  getStatusOptions(): { value: StatusPedido | '', label: string }[] {
    return [
      { value: '', label: 'Todos' },
      { value: StatusPedido.PENDENTE, label: 'Pendente' },
      { value: StatusPedido.PROCESSANDO, label: 'Processando' },
      { value: StatusPedido.CONFIRMADO, label: 'Confirmado' },
      { value: StatusPedido.ENVIADO, label: 'Enviado' },
      { value: StatusPedido.ENTREGUE, label: 'Entregue' },
      { value: StatusPedido.CANCELADO, label: 'Cancelado' }
    ];
  }

  limparFiltros() {
    this.statusFilter.set('');
    this.onFilterChange();
  }
}
