import { StatusPedido } from './status-pedido.enum';
import { Produto } from './produto.model';

export interface ItemPedido {
    id?: number;
    produto?: Produto;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface Pedido {
    id?: number;
    status: StatusPedido;
    criacao?: Date;
    items: ItemPedido[];
    total: number;
}

export interface PedidoCreateRequest {
    itens: ItemPedidoCreateRequest[];
}

export interface ItemPedidoCreateRequest {
    produtoId: number;
    quantidade: number;
}

export interface PedidoUpdateRequest {
    status?: StatusPedido;
}

export interface PedidoFilter {
    status?: StatusPedido;
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

export const mapItemPedido = (item: any): ItemPedido => {
    const precoUnitario = item.produto.preco;
    const quantidade = item.quantidade;
    return {
        id: item.id,
        produto: item.produto,
        quantidade,
        precoUnitario,
        subtotal: precoUnitario * quantidade,
    };
};

export const mapPedido = (pedido: any): Pedido => {
    const items = pedido.items?.map(mapItemPedido) || [];
    const total = items.reduce((acc: number, item: ItemPedido) => acc + item.subtotal, 0);
    return {
        id: pedido.id,
        status: pedido.status,
        criacao: pedido.criacao ? new Date(pedido.criacao) : undefined,
        items,
        total,
    };
};