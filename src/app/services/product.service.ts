import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../models/product";
import {ProductCategory} from "../models/product-category";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.eCommerceApiBaseUrl;

  constructor(private httpClient: HttpClient) {
  }

  getProductsListPaginate(categoryId: number, page: number, pageSize: number): Observable<ResponseProducts> {
    const url = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseProducts>(url);
  }

  getProductsList(categoryId: number): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(url);
  }

  private getProducts(url: string) {
    return this.httpClient.get<ResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    )
  }

  getCategories(): Observable<ProductCategory[]> {
    const url = `${this.baseUrl}/categories`;
    return this.httpClient.get<ResponseCategory>(url).pipe(
      map(response => response._embedded.productsCategory)
    );
  }

  searchProductsPaginate(keyWord: string, page: number, pageSize: number): Observable<ResponseProducts> {
    const url = `${this.baseUrl}/products/search/findByNameContaining?name=${keyWord}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseProducts>(url);
  }

  searchProducts(keyWord: string): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search/findByNameContaining?name=${keyWord}`;
    return this.getProducts(url);
  }

  getProduct(productId: number) {
    const url = `${this.baseUrl}/products/${productId}`
    return this.httpClient.get<Product>(url);
  }
}

interface ResponseProducts {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface ResponseCategory {
  _embedded: {
    productsCategory: ProductCategory[]
  }
}
