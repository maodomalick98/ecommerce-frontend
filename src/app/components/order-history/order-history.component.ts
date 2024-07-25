import {Component, OnInit} from '@angular/core';
import {OrderHistory} from "../../models/order-history";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

    orderHistory: OrderHistory[] = [];
    storage: Storage = sessionStorage;

    constructor(private orderHistoryService: OrderHistoryService) {
    }

    ngOnInit(): void {
        this.getOrderHistory();
    }

    getOrderHistory() {
        const userEmail = this.storage.getItem('userEmail');
        if (userEmail != null) {
            this.orderHistoryService.getUsersOrdersList(JSON.parse(userEmail)).subscribe(
                data => this.orderHistory = data._embedded.orders
            );
        }
    }

}
