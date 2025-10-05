import { Routes } from '@angular/router';
import { ProdutosList } from './pages/produtos/produtos-list/produtos-list';
import { ProdutoForm } from './pages/produtos/produto-form/produto-form';
import { PedidosList } from './pages/pedidos/pedidos-list/pedidos-list';
import { PedidoForm } from './pages/pedidos/pedido-form/pedido-form';
import { PedidoDetails } from './pages/pedidos/pedido-details/pedido-details';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'produtos', component: ProdutosList },
    { path: 'novo-produto', component: ProdutoForm },
    { path: 'produtos/:id', component: ProdutoForm },
    { path: 'pedidos', component: PedidosList },
    { path: 'novo-pedido', component: PedidoForm },
    { path: 'pedidos/:id', component: PedidoDetails }
];
