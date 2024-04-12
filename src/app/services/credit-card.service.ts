import {Injectable} from '@angular/core';
import { Observable, of, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CreditCardService {

    creditCardData: Subject<CreditCard> = new Subject<CreditCard>();

    constructor(private httpClient: HttpClient) {
    }

    getCreditCardMonth(startMonth: number): Observable<number[]> {
        let creditCardMonths: number[] = [];
        for (let month = startMonth; month <= 12; month++) {
            creditCardMonths.push(month);
        }
        return of(creditCardMonths);
    }

    getCreditCardYears(): Observable<number[]> {
        let creditCardYears: number[] = [];
        const startYear: number = new Date().getFullYear();
        const endYear: number = startYear + 10;
        for (let year = startYear; year <= endYear; year++) {
            creditCardYears.push(year);
        }
        return of(creditCardYears);
    }
}

type CreditCard = {
  cardType: string,
  name: string,
  number: number
  cvv: number
  month: string
  year: string
};
