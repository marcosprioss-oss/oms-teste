import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../core/services/pedido';
import { ProdutoService } from '../../core/services/produto';
import { PollingService } from '../../core/services/polling';
import { OrderStatus } from '../../core/models/status-pedido.enum';
import { Loading } from '../../core/services/loading';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
    estatisticasPedidos = signal<{ [key in OrderStatus]: number }>({
        [OrderStatus.PENDENTE]: 0,
        [OrderStatus.PROCESSANDO]: 0,
        [OrderStatus.CONFIRMADO]: 0,
        [OrderStatus.ENVIADO]: 0,
        [OrderStatus.ENTREGUE]: 0,
        [OrderStatus.CANCELADO]: 0
    });

    totalProdutos = signal(0);
    totalPedidos = signal(0);
    valorTotalPedidos = signal(0);

    constructor(
        private pedidoService: PedidoService,
        private produtoService: ProdutoService,
        private pollingService: PollingService,
        private loading: Loading
    ) { }

    ngOnInit() {
        this.carregarEstatisticas();
        this.pollingService.startPolling();

        // Escutar atualizações do polling
        this.pollingService.estatisticasUpdated.subscribe(() => {
            this.carregarEstatisticas();
        });
    }

    ngOnDestroy() {
        this.pollingService.stopPolling();
    }

    carregarEstatisticas() {
        this.loading.show();

        // Carregar estatísticas de pedidos
        this.pedidoService.obterEstatisticasPedidos().subscribe({
            next: (stats) => {
                this.estatisticasPedidos.set(stats);
                this.totalPedidos.set(Object.values(stats).reduce((sum, count) => sum + count, 0));
                this.loading.hide();
            },
            error: (error) => {
                console.error('Erro ao carregar estatísticas de pedidos:', error);
                this.loading.hide();
            }
        });

        // Carregar total de produtos
        this.produtoService.listarProdutos(0, 1).subscribe({
            next: (response) => {
                this.totalProdutos.set(response.totalElements);
            },
            error: (error) => {
                console.error('Erro ao carregar total de produtos:', error);
            }
        });
    }

    getStatusLabel(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDENTE:
                return 'Pendentes';
            case OrderStatus.PROCESSANDO:
                return 'Processando';
            case OrderStatus.CONFIRMADO:
                return 'Confirmados';
            case OrderStatus.ENVIADO:
                return 'Enviados';
            case OrderStatus.ENTREGUE:
                return 'Entregues';
            case OrderStatus.CANCELADO:
                return 'Cancelados';
            default:
                return 'Desconhecido';
        }
    }

    getStatusColor(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDENTE:
                return '#ffc107';
            case OrderStatus.PROCESSANDO:
                return '#17a2b8';
            case OrderStatus.CONFIRMADO:
                return '#28a745';
            case OrderStatus.ENVIADO:
                return '#007bff';
            case OrderStatus.ENTREGUE:
                return '#6f42c1';
            case OrderStatus.CANCELADO:
                return '#dc3545';
            default:
                return '#6c757d';
        }
    }

    getStatusIcon(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDENTE:
                return 'icon-clock';
            case OrderStatus.PROCESSANDO:
                return 'icon-gear';
            case OrderStatus.CONFIRMADO:
                return 'icon-check';
            case OrderStatus.ENVIADO:
                return 'icon-truck';
            case OrderStatus.ENTREGUE:
                return 'icon-gift';
            case OrderStatus.CANCELADO:
                return 'icon-x';
            default:
                return 'icon-question';
        }
    }
}
