import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Product, Order } from '../../models';
import { Subject, Subscription } from 'rxjs';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'product-list',
    templateUrl: 'product-list.html',
    styleUrls: ['product-list.css'],
    providers: [HttpClient]
})
export class ProductListComponent implements OnChanges, OnDestroy {

    products: Product[] = [];

    currentOrder: Order | undefined;

    query = '';

    @Input()
    categoryId: number = 0;

    private categoryIdChange$ = new Subject<number>();

    private currentOrderSubscription: Subscription;

    constructor(
        private readonly apiService: ApiService,
        private readonly orderService: OrdersService
    ) {
        this.categoryIdChange$
            .subscribe(categoryId => {
                this.loadCategory(categoryId);
            });

        this.currentOrderSubscription = this.orderService.getCurrentOrder().subscribe(x => {
            this.currentOrder = x;
        });
    }

    private loadCategory(categoryId: number) {
        this.query = '';
        this.apiService.getProducts(categoryId).subscribe(x => {
            this.products = x;
        });
    }

    addToOrder(product: Product) {
        this.orderService.incrementProduct(product.id);
    }

    getAmountOfProductOrder(productId: number) {
        if (!this.currentOrder) return 0;
        const productOrder = this.currentOrder.products.find(x => x.productId === productId);
        if (!productOrder) return 0;
        return productOrder.amount;
    }

    incrementOrder(productId: number) {
        this.orderService.incrementProduct(productId);
    }

    decrementOrder(productId: number) {
        this.orderService.decrementProduct(productId);
    }

    removeOrder(productId: number) {
        this.orderService.removeProduct(productId);
        return false;
    }

    ngOnDestroy() {
        this.currentOrderSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.categoryId)
            this.categoryIdChange$.next(<number>changes.categoryId.currentValue);
    }

    search() {
        const query = this.query.trim() || undefined;
        this.apiService.getProducts(this.categoryId, query).subscribe(x => {
            this.products = x;
        });
    }
}
