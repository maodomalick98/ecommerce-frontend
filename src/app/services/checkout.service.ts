import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {Country} from "../models/country";
import {HttpClient} from "@angular/common/http";
import {State} from "../models/state";
import {Purchase} from "../models/purchase";
import {environment} from "../../environments/environment";
import {PaymentInfo} from "../models/payment-info";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl: string = environment.eCommerceApiBaseUrl;
  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    const url = `${this.baseUrl}/countries`
    return this.httpClient.get<CountriesResponse>(url).pipe(
        map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const url = `${this.baseUrl}/states/search/findByCountryCode?code=${countryCode}`
    return this.httpClient.get<StatesResponse>(url)
        .pipe(map(response => response._embedded.states))
  }

  placeOrder(purchase: Purchase) : Observable<any> {
    const url = `${this.baseUrl}/checkout/purchase`;
    return this.httpClient.post<Purchase>(url, purchase)
  }

  createPaymentIntent(paymentInfo: PaymentInfo) : Observable<any> {
    const url = `${this.baseUrl}/checkout/payment-intent`;
    return this.httpClient.post<PaymentInfo>(url, paymentInfo)
  }
}

interface CountriesResponse {
  _embedded: {
    countries: Country[];
  }
}

interface StatesResponse {
  _embedded: {
    states: State[];
  }
}
