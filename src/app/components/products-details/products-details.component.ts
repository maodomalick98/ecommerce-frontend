import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../models/cart-item";

@Component({
    selector: 'app-products-details',
    templateUrl: './products-details.component.html',
    styleUrls: ['./products-details.component.css']
})
export class ProductsDetailsComponent implements OnInit {

    product!: Product;

    constructor(private productService: ProductService, private route: ActivatedRoute,
                private cartService: CartService) {
    }

    ngOnInit(): void {
        this.getProductsDetails();
        this.route.paramMap.subscribe(() => {
        })
    }

    private getProductsDetails() {
        const productId = +this.route.snapshot.paramMap.get('id')!;
        this.productService.getProduct(productId).subscribe(data => {
            this.product = data
            console.log(this.product)
        })
    }

    addToCart() {
        const cartItem = new CartItem(this.product);
        this.cartService.addToCart(cartItem)
    }

}
