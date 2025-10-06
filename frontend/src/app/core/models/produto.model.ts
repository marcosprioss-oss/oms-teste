export interface Produto {
    id?: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
}

export interface ProdutoCreateRequest {
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
}

export interface ProdutoUpdateRequest {
    nome?: string;
    descricao?: string;
    preco?: number;
    quantidade?: number;
}
