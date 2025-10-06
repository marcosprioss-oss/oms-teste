import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api';
import {
  Pedido,
  PedidoUpdateRequest,
  PedidoFilter,
  PageResponse,
} from '../models/pedido.model';
import { StatusPedido } from '../models/status-pedido.enum';
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

  criarPedido(pedido: any): Observable<Pedido> {
    return this.apiService.post<Pedido>(this.endpoint, pedido);
  }

  alterarStatus(id: number, status: StatusPedido): Observable<Pedido> {
    return this.apiService.post<Pedido>(`${this.endpoint}/${id}`, `"${status}"`, true);
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.apiService.post<Pedido>(`${this.endpoint}/${id}/cancelar`, {});
  }

  obterEstatisticasPedidos(): Observable<{ status: string, quantidade: number }[]> {
    return this.apiService.get<{ status: string, quantidade: number }[]>(`${this.endpoint}/estatisticas`);
  }
}
