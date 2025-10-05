import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido';
import { ProdutoService } from '../../../core/services/produto';
import { Produto, PageResponse } from '../../../core/models/produto.model';
import { PedidoCreateRequest, ItemPedidoCreateRequest } from '../../../core/models/pedido.model';
import { Loading } from '../../../core/services/loading';

@Component({
  selector: 'app-pedido-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pedido-form.html',
  styleUrl: './pedido-form.css'
})
export class PedidoForm implements OnInit {
  pedidoForm!: FormGroup;
  produtos = signal<Produto[]>([]);
  isLoading = signal(false);
  valorTotal = signal(0);

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private produtoService: ProdutoService,
    private router: Router,
    private loading: Loading
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  initForm() {
    this.pedidoForm = this.fb.group({
      observacoes: [''],
      itens: this.fb.array([])
    });
  }

  get itensFormArray(): FormArray {
    return this.pedidoForm.get('itens') as FormArray;
  }

  carregarProdutos() {
    this.loading.show();
    this.produtoService.listarProdutos(0, 100).subscribe({
      next: (response: PageResponse<Produto>) => {
        this.produtos.set(response.content);
        this.loading.hide();
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading.hide();
      }
    });
  }

  adicionarItem() {
    const itemForm = this.fb.group({
      produtoId: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });

    this.itensFormArray.push(itemForm);
    this.calcularValorTotal();
  }

  removerItem(index: number) {
    this.itensFormArray.removeAt(index);
    this.calcularValorTotal();
  }

  onProdutoChange(index: number) {
    this.calcularValorTotal();
  }

  onQuantidadeChange(index: number) {
    this.calcularValorTotal();
  }

  calcularValorTotal() {
    let total = 0;
    this.itensFormArray.controls.forEach((itemForm, index) => {
      const produtoId = itemForm.get('produtoId')?.value;
      const quantidade = itemForm.get('quantidade')?.value || 0;

      if (produtoId) {
        const produto = this.produtos().find(p => p.id === produtoId);
        if (produto) {
          total += produto.preco * quantidade;
        }
      }
    });

    this.valorTotal.set(total);
  }

  onSubmit() {
    if (this.pedidoForm.valid && this.itensFormArray.length > 0) {
      this.isLoading.set(true);
      this.loading.show();

      const formValue = this.pedidoForm.value;
      const pedidoData: PedidoCreateRequest = {
        observacoes: formValue.observacoes,
        itens: formValue.itens.map((item: any) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade
        }))
      };

      this.pedidoService.criarPedido(pedidoData).subscribe({
        next: () => {
          this.loading.hide();
          this.isLoading.set(false);
          this.router.navigate(['/pedidos']);
        },
        error: (error) => {
          console.error('Erro ao criar pedido:', error);
          this.loading.hide();
          this.isLoading.set(false);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.pedidoForm.controls).forEach(key => {
      const control = this.pedidoForm.get(key);
      control?.markAsTouched();
    });

    this.itensFormArray.controls.forEach(itemForm => {
      Object.keys(itemForm.controls).forEach(key => {
        const control = itemForm.get(key);
        control?.markAsTouched();
      });
    });
  }

  getProdutoNome(produtoId: number): string {
    const produto = this.produtos().find(p => p.id === produtoId);
    return produto ? produto.nome : '';
  }

  getProdutoPreco(produtoId: number): number {
    const produto = this.produtos().find(p => p.id === produtoId);
    return produto ? produto.preco : 0;
  }

  getProdutoEstoque(produtoId: number): number {
    const produto = this.produtos().find(p => p.id === produtoId);
    return produto ? produto.quantidadeEstoque : 0;
  }

  getItemError(index: number, fieldName: string): string {
    const itemForm = this.itensFormArray.at(index);
    const field = itemForm?.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} deve ser maior que ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  hasItemError(index: number, fieldName: string): boolean {
    const itemForm = this.itensFormArray.at(index);
    const field = itemForm?.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      produtoId: 'Produto',
      quantidade: 'Quantidade'
    };
    return labels[fieldName] || fieldName;
  }
}
