export interface Produto {
    id?: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
}

export interface ProdutoCreateRequest {
    nome: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
}

export interface ProdutoUpdateRequest {
    nome?: string;
    descricao?: string;
    preco?: number;
    quantidadeEstoque?: number;
}
