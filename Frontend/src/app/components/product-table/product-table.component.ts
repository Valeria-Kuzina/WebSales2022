import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';

@Component({
    selector: 'product-table',
    templateUrl: 'product-table.html',
    styleUrls: ['product-table.css'],
    providers: [HttpClient]
})
export class ProductTableComponent implements OnInit {

    products: Product[] = [];

    constructor(
        private readonly apiService: ApiService
    ) {
        this.load();
    }

    private load() {
        this.apiService.getProducts().subscribe(x => {
            this.products = x;
        });
    }

    ngOnInit() {
        this.apiService.getProducts().subscribe(x => this.products = x);
    }
}
