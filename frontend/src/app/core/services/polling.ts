import { Injectable, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { PedidoService } from './pedido';
import { ProdutoService } from './produto';
import { StatusPedido } from '../models/status-pedido.enum';

@Injectable({
    providedIn: 'root'
})
export class PollingService {
    private subscription?: Subscription;
    private readonly POLLING_INTERVAL = 30000;


    pedidosUpdated = signal(false);
    produtosUpdated = signal(false);
    estatisticasUpdated = signal(false);

    constructor(
        private pedidoService: PedidoService,
        private produtoService: ProdutoService
    ) { }

    startPolling() {
        if (this.subscription) {
            this.stopPolling();
        }

        this.subscription = interval(this.POLLING_INTERVAL).subscribe(() => {
            this.checkForUpdates();
        });
    }

    stopPolling() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }

    private checkForUpdates() {
        this.pedidoService.listarPedidos().subscribe({
            next: () => {
                this.estatisticasUpdated.set(true);
                setTimeout(() => this.estatisticasUpdated.set(false), 100);
            },
            error: (error) => {
                console.error('Erro ao verificar atualizações de pedidos:', error);
            }
        });
    }

    forceUpdate() {
        this.checkForUpdates();
    }

    checkPendingOrders() {
        this.pedidoService.listarPedidos({
            status: StatusPedido.PENDENTE,
            page: 0,
            size: 1
        }).subscribe({
            next: () => {
                this.pedidosUpdated.set(true);
                setTimeout(() => this.pedidosUpdated.set(false), 100);
            },
            error: (error) => {
                console.error('Erro ao verificar pedidos pendentes:', error);
            }
        });
    }
}
