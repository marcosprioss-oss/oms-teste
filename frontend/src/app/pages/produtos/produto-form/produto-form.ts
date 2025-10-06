import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProdutoService } from '../../../core/services/produto';
import { Produto, ProdutoCreateRequest } from '../../../core/models/produto.model';
import { Loading } from '../../../core/services/loading';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-produto-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css'
})
export class ProdutoForm implements OnInit {
  produtoForm!: FormGroup;
  isEditMode = signal(false);
  produtoId = signal<number | null>(null);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: Loading,
    private notification: NotificationService
  ) {
    this.initForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.produtoId.set(+id);
      this.carregarProduto(+id);
    }
  }


  initForm() {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      quantidade: [0, [Validators.required, Validators.min(0)]]
    });
  }

  carregarProduto(id: number) {
    this.loading.show();
    this.produtoService.buscarProdutoPorId(id).subscribe({
      next: (produto: Produto) => {
        if (this.isEditMode()) {
          this.produtoForm.get('nome')?.disable();
          this.produtoForm.get('descricao')?.disable();
          this.produtoForm.get('preco')?.disable();
        }

        this.produtoForm.patchValue(produto);
        this.loading.hide();
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.loading.hide();
        this.router.navigate(['/produtos']);
      }
    });
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      this.isLoading.set(true);
      this.loading.show();

      const produtoData: ProdutoCreateRequest = this.produtoForm.value;

      if (this.isEditMode()) {
        this.produtoService.atualizarProduto(this.produtoId()!, produtoData).subscribe({
          next: () => {
            this.loading.hide();
            this.isLoading.set(false);
            this.notification.showSuccess('Produto atualizado com sucesso!');
            this.router.navigate(['/produtos']);
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
            this.loading.hide();
            this.isLoading.set(false);
          }
        });
      } else {
        this.produtoService.criarProduto(produtoData).subscribe({
          next: () => {
            this.loading.hide();
            this.isLoading.set(false);
            this.notification.showSuccess('Produto criado com sucesso!');
            this.router.navigate(['/produtos']);
          },
          error: (error) => {
            console.error('Erro ao criar produto:', error);
            this.loading.hide();
            this.isLoading.set(false);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.produtoForm.controls).forEach(key => {
      const control = this.produtoForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.produtoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} deve ser maior que ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      descricao: 'Descrição',
      preco: 'Preço',
      quantidade: 'Quantidade em Estoque'
    };
    return labels[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.produtoForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}
