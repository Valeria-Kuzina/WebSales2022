import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Product } from '../models';
import { Order } from '../models/order';

@Injectable()
export class ApiService{

    constructor(private readonly http: HttpClient) {
    }

    getProduct(id: number) {
        return this.http.get<Product>(`/api/products/${id}`);
    }

    getProducts(categoryId?: number, query?: string) {
        let params = new HttpParams();
        if (categoryId !== undefined)
            params = params.set('categoryId', categoryId.toString());
        if (query !== undefined)
            params = params.set('query', query);

        return this.http.get<Product[]>('/api/products', { params });
    }

    saveProducts(product: Product) {
        return this.http.post<Product>('/api/products', product);
    }

    getCategories() {
        return this.http.get<Category[]>('/api/products/categories');
    }

    getCategory(id: number) {
        return this.http.get<Category>(`/api/products/categories/${id}`);
    }

    saveCategory(category: Category) {
        return this.http.post<void>('/api/products/categories', category);
    }

    getCurrentOrder() {
        return this.http.get<Order>('/api/orders/current');
    }

    getOrders() {
        return this.http.get<Order[]>('/api/orders');
    }

    getOrder(orderId: number) {
        return this.http.get<Order>(`/api/orders/${orderId}`);
    }

    setProductOrderAmount(orderId: number, productId: number, amount: number) {
        return this.http.post<void>(`/api/orders/${orderId}/products?productId=${productId}&amount=${amount}`, {});
    }

    removeProductOrder(orderId: number, productId: number) {
        return this.http.delete<void>(`/api/orders/${orderId}/products/${productId}`);
    }

    setOrderCompleted(orderId: number) {
        return this.http.post<void>(`/api/orders/${orderId}/completed`, {});
    }
}
