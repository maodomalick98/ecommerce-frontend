import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  //@TODO make route parameter dynamic
  currentCategoryId : number = 1;

  products: Product[] = [];
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  private listProducts() {
    this.currentCategoryId = this.route.snapshot.paramMap.has('id') ?
      + this.route.snapshot.paramMap.get('id')! : 1;

    this.productService.getProductsLists(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }
}
