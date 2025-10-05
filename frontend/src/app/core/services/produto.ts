import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api';
import { Produto, ProdutoCreateRequest, ProdutoUpdateRequest, PageResponse } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly endpoint = '/produtos';

  constructor(private apiService: ApiService) { }

  listarProdutos(page: number = 0, size: number = 10, nome?: string): Observable<PageResponse<Produto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.apiService.get<PageResponse<Produto>>(this.endpoint, params);
  }

  buscarProdutoPorId(id: number): Observable<Produto> {
    return this.apiService.get<Produto>(`${this.endpoint}/${id}`);
  }

  criarProduto(produto: ProdutoCreateRequest): Observable<Produto> {
    return this.apiService.post<Produto>(this.endpoint, produto);
  }

  atualizarProduto(id: number, produto: ProdutoUpdateRequest): Observable<Produto> {
    return this.apiService.put<Produto>(`${this.endpoint}/${id}`, produto);
  }

  excluirProduto(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  atualizarEstoque(id: number, quantidade: number): Observable<Produto> {
    return this.apiService.put<Produto>(`${this.endpoint}/${id}/estoque`, { quantidadeEstoque: quantidade });
  }
}
