import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  totalProducts: number = 0;

  products: Product[] = [];
  previousKeyWord: string = "";

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  public listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleListProducts() {
    this.currentCategoryId = this.route.snapshot.paramMap.has('id') ?
      +this.route.snapshot.paramMap.get('id')! : 1;

    if (this.currentCategoryId != this.previousCategoryId) {
      this.page = 1;
    }
    this.previousCategoryId = this.currentCategoryId

    this.currentCategoryName = this.route.snapshot.paramMap.get('name') ?
      this.route.snapshot.paramMap.get('name')! : "Books";

    this.productService.getProductsListPaginate(this.currentCategoryId, this.page - 1, this.pageSize).subscribe(this.processResults())
  }

  private handleSearchProducts() {
    const keyWord: string = this.route.snapshot.paramMap.get("keyword")!;

    if (this.previousKeyWord != keyWord) {
      this.page = 1;
    }
    this.productService.searchProductsPaginate(keyWord, this.page - 1, this.pageSize).subscribe(this.processResults())
  }

  updatePageSize(value: string): void {
    this.pageSize = +value;
    this.page = 1;
    this.listProducts();
  }

  processResults() : (data: any) => void {
    return (data: any) =>  {
      this.products = data._embedded.products;
      this.page = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalProducts = data.page.totalElements;
    }
  }
}
