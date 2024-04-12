import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../models/cart-item";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
  }
  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
