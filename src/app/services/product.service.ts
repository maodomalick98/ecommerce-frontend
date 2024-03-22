import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  constructor(private httpClient: HttpClient ) { }

  getProductsLists(categoryId : number) : Observable<Product[]> {
    return this.httpClient.get<GetResponse>(`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`).pipe(
      map(response => response._embedded.products)
    )
  }
}

interface GetResponse {
  _embedded : {
    products: Product[]
  }
}