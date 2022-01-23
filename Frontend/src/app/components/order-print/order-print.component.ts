import { Component, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { Order, Product } from '../../models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'order-print',
    templateUrl: 'order-print.html',
    providers: [HttpClient]
})
export class OrderPrintComponent {

    order: Order | undefined;
    products = new Map<number, Product>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly api: ApiService,
        private readonly elRef: ElementRef) {
        
        this.activatedRoute.params.subscribe(({ id }) => {
            forkJoin(
                this.api.getOrder(+id),
                this.api.getProducts()
            ).subscribe(([order, products]) => {
                this.order = order;
                for (const product of products)
                    this.products.set(product.id, product);

                setTimeout(() => this.print(), 0);
            });
        });
    }

    get total() {
        if (!this.order || !this.products) return 0;
        return this.order.products
            .map(x => x.amount * this.products.get(x.productId)!.price)
            .reduce((a, v) => a + v, 0);
    }

    print() {
        document.body.innerHTML = this.elRef.nativeElement.innerHTML;
        window.focus();
        window.print();
        setTimeout(() => window.close(), 100);
    }
}
