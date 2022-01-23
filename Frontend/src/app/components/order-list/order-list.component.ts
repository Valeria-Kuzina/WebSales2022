import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models';

@Component({
    selector: 'order-list',
    templateUrl: 'order-list.html',
    styleUrls: ['order-list.css'],
    providers: [HttpClient]
})
export class OrderListComponent {

    orders: Order[] = [];

    constructor(private readonly api: ApiService) {
        this.api.getOrders().subscribe(x => this.orders = x);
    }
}
