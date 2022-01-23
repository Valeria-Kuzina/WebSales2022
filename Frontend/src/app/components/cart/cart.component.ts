import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { forkJoin, Subscription } from 'rxjs';
import { Order, Product } from '../../models';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'cart',
    templateUrl: 'cart.html',
    styleUrls: ['cart.css'],
    providers: [HttpClient]
})
export class CartComponent implements OnDestroy {

    order: Order | undefined;
    products = new Map<number, Product>();

    private orderSubscription: Subscription | undefined;

    constructor(
        private readonly ordersService: OrdersService,
        private readonly api: ApiService) {
        forkJoin(
            this.api.getCurrentOrder(),
            this.api.getProducts()
        ).subscribe(([order, products]) => {
            this.order = order;
            for (const product of products)
                this.products.set(product.id, product);

            this.orderSubscription = this.ordersService.getCurrentOrder().subscribe(x => this.order = x);
        });
    }

    ngOnDestroy() {
        this.orderSubscription?.unsubscribe();
    }

    get total() {
        if (!this.order || !this.products) return 0;
        return this.order.products
            .map(x => x.amount * this.products.get(x.productId)!.price)
            .reduce((a, v) => a + v, 0);
    }

    decrement(productId: number) {
        this.ordersService.decrementProduct(productId);
        return false;
    }

    increment(productId: number) {
        this.ordersService.incrementProduct(productId);
        return false;
    }

    remove(productId: number) {
        this.ordersService.removeProduct(productId);
        return false;
    }

    complete() {
        if (!this.order) return;
        this.ordersService.complete();
    }
}
