import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../../core/services/produto';
import { Produto, PageResponse } from '../../../core/models/produto.model';
import { Loading } from '../../../core/services/loading';

@Component({
  selector: 'app-produtos-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produtos-list.html',
  styleUrl: './produtos-list.css'
})
export class ProdutosList implements OnInit {
  produtos = signal<Produto[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');

  constructor(
    private produtoService: ProdutoService,
    private loading: Loading
  ) { }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loading.show();
    this.produtoService.listarProdutos(
      this.currentPage(),
      this.pageSize(),
      this.searchTerm() || undefined
    ).subscribe({
      next: (response: PageResponse<Produto>) => {
        this.produtos.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.hide();
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading.hide();
      }
    });
  }

  onSearch() {
    this.currentPage.set(0);
    this.carregarProdutos();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.carregarProdutos();
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.loading.show();
      this.produtoService.excluirProduto(id).subscribe({
        next: () => {
          this.carregarProdutos();
        },
        error: (error) => {
          console.error('Erro ao excluir produto:', error);
          this.loading.hide();
        }
      });
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
