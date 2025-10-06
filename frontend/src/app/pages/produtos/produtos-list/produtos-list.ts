import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProdutoService } from '../../../core/services/produto';
import { Produto } from '../../../core/models/produto.model';
import { Loading } from '../../../core/services/loading';
import { NotificationService } from '../../../core/services/notification';
import { PageResponse } from '../../../core/models/pedido.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-produtos-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
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

  displayedColumns: string[] = ['id', 'nome', 'descricao', 'preco', 'estoque', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private loading: Loading,
    private notification: NotificationService
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
    this.loading.hide();
  }

  onSearch() {
    this.currentPage.set(0);
    this.carregarProdutos();
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.carregarProdutos();
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
