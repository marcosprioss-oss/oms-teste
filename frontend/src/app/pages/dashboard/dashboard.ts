import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../core/services/pedido';
import { ProdutoService } from '../../core/services/produto';
import { PollingService } from '../../core/services/polling';
import { StatusPedido } from '../../core/models/status-pedido.enum';
import { Loading } from '../../core/services/loading';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
    estatisticasPedidos = signal<{ [key in StatusPedido]: number }>({
        [StatusPedido.PENDENTE]: 0,
        [StatusPedido.PROCESSANDO]: 0,
        [StatusPedido.CONFIRMADO]: 0,
        [StatusPedido.ENVIADO]: 0,
        [StatusPedido.ENTREGUE]: 0,
        [StatusPedido.CANCELADO]: 0
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

        effect(() => {
            if (this.pollingService.estatisticasUpdated()) {
                this.carregarEstatisticas();
            }
        });

    }

    ngOnDestroy() {
        this.pollingService.stopPolling();
    }

    carregarEstatisticas() {
        this.loading.show();
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
                this.estatisticasPedidos.set(statsObj);
                this.totalPedidos.set(stats.reduce((sum, item) => sum + item.quantidade, 0));
                this.loading.hide();
            },
            error: (error) => {
                console.error('Erro ao carregar estatísticas de pedidos:', error);
                this.loading.hide();
            }
        });

        this.produtoService.listarProdutos(0, 1).subscribe({
            next: (response) => {
                this.totalProdutos.set(response.totalElements);
            },
            error: (error) => {
                console.error('Erro ao carregar total de produtos:', error);
            }
        });
    }

    getStatusLabel(key: string): string {
        const status = StatusPedido[key as keyof typeof StatusPedido];
        switch (status) {
            case StatusPedido.PENDENTE:
                return 'Pendentes';
            case StatusPedido.PROCESSANDO:
                return 'Processando';
            case StatusPedido.CONFIRMADO:
                return 'Confirmados';
            case StatusPedido.ENVIADO:
                return 'Enviados';
            case StatusPedido.ENTREGUE:
                return 'Entregues';
            case StatusPedido.CANCELADO:
                return 'Cancelados';
            default:
                return 'Desconhecido';
        }
    }

    getStatusColor(key: string): string {
        const status = StatusPedido[key as keyof typeof StatusPedido];
        switch (status) {
            case StatusPedido.PENDENTE:
                return '#ffc107';
            case StatusPedido.PROCESSANDO:
                return '#17a2b8';
            case StatusPedido.CONFIRMADO:
                return '#28a745';
            case StatusPedido.ENVIADO:
                return '#007bff';
            case StatusPedido.ENTREGUE:
                return '#6f42c1';
            case StatusPedido.CANCELADO:
                return '#dc3545';
            default:
                return '#6c757d';
        }
    }

    getStatusIcon(key: string): string {
        const status = StatusPedido[key as keyof typeof StatusPedido];
        switch (status) {
            case StatusPedido.PENDENTE:
                return 'icon-clock';
            case StatusPedido.PROCESSANDO:
                return 'icon-gear';
            case StatusPedido.CONFIRMADO:
                return 'icon-check';
            case StatusPedido.ENVIADO:
                return 'icon-truck';
            case StatusPedido.ENTREGUE:
                return 'icon-gift';
            case StatusPedido.CANCELADO:
                return 'icon-x';
            default:
                return 'icon-question';
        }
    }
}
