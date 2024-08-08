import {Injectable} from '@angular/core';
import {CartItem} from "../models/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];
    storage: Storage = localStorage;

    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

    constructor() {
        let storageData = this.storage.getItem('cartItems');
        if (storageData != null) {
            this.cartItems = JSON.parse(storageData);
        }
        this.computeCartTotals();
    }

    addToCart(cartItem: CartItem) {
        let existingItem = undefined;
        if (this.cartItems.length > 0) {
            existingItem = this.cartItems.find(item => item.id == cartItem.id);
        }
        if (existingItem != undefined) {
            existingItem.quantity++;
        } else {
            this.cartItems.push(cartItem);
        }
        this.computeCartTotals();
    }

    computeCartTotals() {
        let totalPrice = 0;
        let totalQuantity = 0;
        this.cartItems.forEach(item => {
            totalPrice += item.quantity * item.unitPrice;
            totalQuantity += item.quantity;
        })

        this.totalPrice.next(totalPrice);
        this.totalQuantity.next(totalQuantity);
        this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    decrementQuantity(item: CartItem) {
        item.quantity--;
        if (item.quantity === 0) {
            this.remove(item);
        }
        this.computeCartTotals();
    }

    remove(itemToRemove: CartItem) {
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id == itemToRemove.id);
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
        }
        this.computeCartTotals();
    }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
