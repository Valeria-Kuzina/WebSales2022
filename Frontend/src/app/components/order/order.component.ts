import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { Order, Product } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'order',
    templateUrl: 'order.html',
    providers: [HttpClient]
})
export class OrderComponent {

    order: Order | undefined;
    products = new Map<number, Product>();

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly api: ApiService) {

        this.activatedRoute.params.subscribe(({ id }) => {
            forkJoin(
                this.api.getOrder(+id),
                this.api.getProducts()
            ).subscribe(([order, products]) => {
                this.order = order;
                for (const product of products)
                    this.products.set(product.id, product);
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
        if (!this.order) return;
        const urlTree = this.router.createUrlTree(['/', 'print',  'orders', this.order.id], {
            relativeTo: this.activatedRoute
        });
        const url = this.router.serializeUrl(urlTree);

        window.open(url, '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    }
}
