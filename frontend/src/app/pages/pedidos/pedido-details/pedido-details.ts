import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido';
import { mapPedido, Pedido } from '../../../core/models/pedido.model';
import { Loading } from '../../../core/services/loading';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { StatusPedido } from '../../../core/models/status-pedido.enum';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-pedido-details',
  imports: [CommonModule, RouterModule, StatusBadge, FormsModule, MatSnackBarModule],
  templateUrl: './pedido-details.html',
  styleUrl: './pedido-details.css'
})
export class PedidoDetails implements OnInit {
  pedido = signal<Pedido | null>(null);
  pedidoId = signal<number | null>(null);
  protected readonly StatusPedido = StatusPedido;

  constructor(
    private pedidoService: PedidoService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: Loading,
    private snackBar: MatSnackBar
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
        this.pedido.set(mapPedido(pedido));
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

  podeCancelar(status: StatusPedido): boolean {
    return status !== StatusPedido.ENVIADO && status !== StatusPedido.ENTREGUE && status !== StatusPedido.CANCELADO;
  }

  voltar() {
    this.router.navigate(['/pedidos']);
  }

  podeEditarStatus(status: StatusPedido): boolean {
    return (status !== StatusPedido.CANCELADO && status !== StatusPedido.PENDENTE);
  }

  alterarStatus(novoStatus: StatusPedido) {
    if (!this.pedido()) return;

    if (this.podeEditarStatus(this.pedido()!.status)) {
      this.pedido()!.status = novoStatus;
      this.pedidoService.alterarStatus(this.pedido()!.id!, novoStatus).subscribe({
        next: () =>
          this.snackBar.open('Status alterado com sucesso!', 'OK', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
          }),

        error: (err) => console.error('Erro ao atualizar status', err)
      });
    }
  }

}
