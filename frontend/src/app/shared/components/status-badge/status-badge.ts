import { Component, Input } from '@angular/core';
import { StatusPedido } from '../../../core/models/status-pedido.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css'
})
export class StatusBadge {
  @Input() status!: StatusPedido;

  getStatusClass(): string {
    switch (this.status) {
      case StatusPedido.PENDENTE:
        return 'status-pendente';
      case StatusPedido.PROCESSANDO:
        return 'status-processando';
      case StatusPedido.CONFIRMADO:
        return 'status-confirmado';
      case StatusPedido.ENVIADO:
        return 'status-enviado';
      case StatusPedido.ENTREGUE:
        return 'status-entregue';
      case StatusPedido.CANCELADO:
        return 'status-cancelado';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(): string {
    switch (this.status) {
      case StatusPedido.PENDENTE:
        return 'Pendente';
      case StatusPedido.PROCESSANDO:
        return 'Processando';
      case StatusPedido.CONFIRMADO:
        return 'Confirmado';
      case StatusPedido.ENVIADO:
        return 'Enviado';
      case StatusPedido.ENTREGUE:
        return 'Entregue';
      case StatusPedido.CANCELADO:
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }
}
