import { OrderStatus } from './status-pedido.enum';
import { Produto } from './produto.model';

export interface ItemPedido {
    id?: number;
    produtoId: number;
    produto?: Produto;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface Pedido {
    id?: number;
    numero?: string;
    status: OrderStatus;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    itens: ItemPedido[];
    valorTotal: number;
    observacoes?: string;
}

export interface PedidoCreateRequest {
    itens: ItemPedidoCreateRequest[];
    observacoes?: string;
}

export interface ItemPedidoCreateRequest {
    produtoId: number;
    quantidade: number;
}

export interface PedidoUpdateRequest {
    status?: OrderStatus;
    observacoes?: string;
}

export interface PedidoFilter {
    status?: OrderStatus;
    dataInicio?: Date;
    dataFim?: Date;
    page?: number;
    size?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
