import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido';
import { Pedido, OrderStatus } from '../../../core/models/pedido.model';
import { Loading } from '../../../core/services/loading';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-pedido-details',
  imports: [CommonModule, RouterModule, StatusBadge],
  templateUrl: './pedido-details.html',
  styleUrl: './pedido-details.css'
})
export class PedidoDetails implements OnInit {
  pedido = signal<Pedido | null>(null);
  pedidoId = signal<number | null>(null);

  constructor(
    private pedidoService: PedidoService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: Loading
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pedidoId.set(+id);
      this.carregarPedido(+id);
    } else {
      this.router.navigate(['/pedidos']);
    }
  }

  carregarPedido(id: number) {
    this.loading.show();
    this.pedidoService.buscarPedidoPorId(id).subscribe({
      next: (pedido: Pedido) => {
        this.pedido.set(pedido);
        this.loading.hide();
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        this.loading.hide();
        this.router.navigate(['/pedidos']);
      }
    });
  }

  cancelarPedido() {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.loading.show();
      this.pedidoService.cancelarPedido(this.pedidoId()!).subscribe({
        next: () => {
          this.carregarPedido(this.pedidoId()!);
          this.loading.hide();
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

  voltar() {
    this.router.navigate(['/pedidos']);
  }
}
