import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { OrderComponent } from './components/order/order.component';
import { ProductPropsComponent } from './components/product-props/product-props.component';
import { ProductTableComponent } from './components/product-table/product-table.component';

const routes: Routes = [
    { path: 'catalogue', component: CatalogueComponent },
    { path: 'products', component: ProductTableComponent },
    { path: 'products/:id', component: ProductPropsComponent },
    { path: 'orders', component: OrderListComponent },
    { path: 'orders/:id', component: OrderComponent },
    { path: 'cart', component: CartComponent },
    { path: 'print/orders/:id', component: OrderPrintComponent },
    { path: '', pathMatch: 'full', redirectTo: 'catalogue' }
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
