import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderHistory} from "../models/order-history";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.eCommerceApiBaseUrl;
  constructor(private http: HttpClient) { }

  getUsersOrdersList(email: string) : Observable<ResponseOrderHistory> {
    const url = `${this.orderUrl}/orders/search/customer-orders?email=${email}`
    return this.http.get<ResponseOrderHistory>(url);
  }
}

interface ResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]
  }
}
