import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../models';
import { iif, of } from 'rxjs';

@Component({
    selector: 'product-props',
    templateUrl: 'product-props.html',
    styleUrls: ['product-props.css'],
    providers: [HttpClient]
})
export class ProductPropsComponent implements OnInit {

    product: Product = this.createNew();
    categories: Category[] = [];

    toasts: {
        text: string,
        success: boolean
    }[] = [];

    constructor(
        private readonly apiService: ApiService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.loadCategories();
        this.activatedRoute.params.subscribe(({ id }) => {
            this.load(+id);
        });
    }

    private loadCategories() {
        this.apiService.getCategories().subscribe(x => this.categories = x);
    }

    private load(id: number) {
        iif(() => !id, of(this.createNew()), this.apiService.getProduct(id))
            .subscribe(x => this.product = x);
    }

    private createNew(): Product {
        return {
            id: 0,
            name: '',
            description: '',
            categoryId: 0,
            price: 0
        };
    }

    save() {
        if (!this.product) return;

        if (!this.product.categoryId) {
            this.toasts.push({ text: 'Выберите категорию', success: false });
            return;
        }

        if (!this.product.name?.trim()) {
            this.toasts.push({ text: 'Введите наименование', success: false });
            return;
        }

        if (!this.product.price || this.product.price <= 0) {
            this.toasts.push({ text: 'Укажите цену', success: false });
            return;
        }

        this.apiService.saveProducts(this.product)
            .subscribe(x => this.product = x);

        this.toasts.push({ text: 'Изменения сохранены!', success: true });
    }

    removeToast(toast: {}) {
        this.toasts = this.toasts.filter(x => x !== toast);
    }
}
