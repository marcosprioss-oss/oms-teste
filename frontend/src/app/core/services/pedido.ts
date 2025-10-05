import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api';
import {
  Pedido,
  PedidoCreateRequest,
  PedidoUpdateRequest,
  PedidoFilter,
  PageResponse,
  OrderStatus
} from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly endpoint = '/pedidos';

  constructor(private apiService: ApiService) { }

  listarPedidos(filter: PedidoFilter = {}): Observable<PageResponse<Pedido>> {
    let params = new HttpParams()
      .set('page', (filter.page || 0).toString())
      .set('size', (filter.size || 10).toString());

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.dataInicio) {
      params = params.set('dataInicio', filter.dataInicio.toISOString());
    }

    if (filter.dataFim) {
      params = params.set('dataFim', filter.dataFim.toISOString());
    }

    return this.apiService.get<PageResponse<Pedido>>(this.endpoint, params);
  }

  buscarPedidoPorId(id: number): Observable<Pedido> {
    return this.apiService.get<Pedido>(`${this.endpoint}/${id}`);
  }

  criarPedido(pedido: PedidoCreateRequest): Observable<Pedido> {
    return this.apiService.post<Pedido>(this.endpoint, pedido);
  }

  atualizarPedido(id: number, pedido: PedidoUpdateRequest): Observable<Pedido> {
    return this.apiService.put<Pedido>(`${this.endpoint}/${id}`, pedido);
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.apiService.put<Pedido>(`${this.endpoint}/${id}/cancelar`, {});
  }

  obterEstatisticasPedidos(): Observable<{ [key in OrderStatus]: number }> {
    return this.apiService.get<{ [key in OrderStatus]: number }>(`${this.endpoint}/estatisticas`);
  }
}
