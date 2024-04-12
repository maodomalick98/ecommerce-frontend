import {Injectable} from '@angular/core';
import {CartItem} from "../models/cart-item";
import {Subject} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {WitheSpaceValidator} from "../validators/witheSpaceValidator";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
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
}
