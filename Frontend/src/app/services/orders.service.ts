import { Injectable } from '@angular/core';
import { iif, merge, Observable, of, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Order } from '../models/order';
import { ApiService } from './api.service';

@Injectable()
export class OrdersService{

    private currentOrder: Order | undefined;

    private currentOrderInitial$: Observable<Order>;

    public readonly currentOrder$ = new Subject<Order>();

    constructor(private readonly api: ApiService) {
        this.currentOrderInitial$ = this.api.getCurrentOrder().pipe(shareReplay());
    }

    private loadCurrentOrder() {
        this.currentOrderInitial$.subscribe(x => this.currentOrder = x);
    }

    private emit() {
        this.currentOrder$.next(this.currentOrder);
    }

    getCurrentOrder() {
        this.loadCurrentOrder();
        return merge(iif(() => !!this.currentOrder, of(this.currentOrder!), this.currentOrderInitial$), this.currentOrder$);
    }

    incrementProduct(productId: number) {
        if (!this.currentOrder) return;
        const productOrder = this.currentOrder.products.find(x => x.productId == productId) ||
            { orderId: this.currentOrder.id, productId: productId, amount: 0 };

        productOrder.amount++;

        if (!this.currentOrder.products.includes(productOrder))
            this.currentOrder.products.push(productOrder);

        this.api.setProductOrderAmount(this.currentOrder.id, productId, productOrder.amount).subscribe();
        this.emit();
    }

    decrementProduct(productId: number) {
        if (!this.currentOrder) return;
        const productOrder = this.currentOrder.products.find(x => x.productId == productId);
        if (!productOrder) return;

        productOrder.amount--;

        if (productOrder.amount <= 0) {
            this.removeProduct(productId);
        }
        else {
            this.api.setProductOrderAmount(this.currentOrder.id, productId, productOrder.amount).subscribe();
            this.emit();
        }
    }

    setProductAmount(productId: number, amount: number) {
        if (!this.currentOrder) return;

        if (amount <= 0) {
            this.removeProduct(productId);
            return;
        }

        const productOrder = this.currentOrder.products.find(x => x.productId == productId) ||
            { orderId: this.currentOrder.id, productId: productId, amount: 1 };

        if (!this.currentOrder.products.includes(productOrder))
            this.currentOrder.products.push(productOrder);

        productOrder.amount = amount;

        this.api.setProductOrderAmount(this.currentOrder.id, productId, productOrder.amount).subscribe();
        this.emit();
    }

    removeProduct(productId: number) {
        if (!this.currentOrder) return;
        const index = this.currentOrder.products.findIndex(x => x.productId == productId);
        if (index !== -1) this.currentOrder.products.splice(index, 1);
        this.api.removeProductOrder(this.currentOrder.id, productId).subscribe();
        this.emit();
    }

    complete() {
        if (!this.currentOrder) return;
        this.api.setOrderCompleted(this.currentOrder.id).subscribe(() => {
            this.currentOrder = undefined;
            this.currentOrderInitial$ = this.api.getCurrentOrder().pipe(shareReplay());
            this.currentOrderInitial$.subscribe(x => {
                this.currentOrder = x
                this.emit();
            });
        });
    }
}
