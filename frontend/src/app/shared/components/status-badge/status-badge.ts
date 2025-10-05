import { Component, Input } from '@angular/core';
import { OrderStatus } from '../../../core/models/status-pedido.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css'
})
export class StatusBadge {
  @Input() status!: OrderStatus;

  getStatusClass(): string {
    switch (this.status) {
      case OrderStatus.PENDENTE:
        return 'status-pendente';
      case OrderStatus.PROCESSANDO:
        return 'status-processando';
      case OrderStatus.CONFIRMADO:
        return 'status-confirmado';
      case OrderStatus.ENVIADO:
        return 'status-enviado';
      case OrderStatus.ENTREGUE:
        return 'status-entregue';
      case OrderStatus.CANCELADO:
        return 'status-cancelado';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(): string {
    switch (this.status) {
      case OrderStatus.PENDENTE:
        return 'Pendente';
      case OrderStatus.PROCESSANDO:
        return 'Processando';
      case OrderStatus.CONFIRMADO:
        return 'Confirmado';
      case OrderStatus.ENVIADO:
        return 'Enviado';
      case OrderStatus.ENTREGUE:
        return 'Entregue';
      case OrderStatus.CANCELADO:
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }
}
