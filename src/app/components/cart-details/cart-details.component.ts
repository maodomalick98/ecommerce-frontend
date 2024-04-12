import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../models/cart-item";
import {CartService} from "../../services/cart.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreditCardService} from "../../services/credit-card.service";
import {WitheSpaceValidator} from "../../validators/witheSpaceValidator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardFrom: FormGroup;
  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];


  constructor(private cartService: CartService, private formBuilder: FormBuilder, private creditCardService: CreditCardService,
              private router: Router) {
    this.creditCardFrom = this.formBuilder.group({
      creditCard: this.formBuilder.group({
        //cardType: new FormControl('', [Validators.required]),
        name: new FormControl('',
          [Validators.required, Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        month: [''],
        year: ['']
      })
    });
  }

  ngOnInit(): void {
    this.listCartDetails();
    const startMonth: number = new Date().getMonth() + 1;
    this.creditCardService.getCreditCardMonth(startMonth).subscribe(
      data => this.creditCardMonth = data
    );
    this.creditCardService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );
  }

  get cardType() {
    return this.creditCardFrom.get('creditCard.cardType')!;
  }

  get cardName() {
    return this.creditCardFrom.get('creditCard.name')!;
  }

  get cardNumber() {
    return this.creditCardFrom.get('creditCard.number')!;
  }

  get cardCvv() {
    return this.creditCardFrom.get('creditCard.cvv')!;
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.computeCartTotals();
  }

  incrementQuantity(item: CartItem) {
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.decrementQuantity(item);
  }

  removeItem(item: CartItem) {
    this.cartService.remove(item);
  }

  handleMonthAndYears() {
    const selectedYear = this.creditCardFrom.value.year;
    const currentYear = new Date().getFullYear();
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.creditCardService.getCreditCardMonth(startMonth).subscribe(
      data => this.creditCardMonth = data
    );
  }

  submit() {
    this.creditCardService.creditCardData.next(this.creditCardFrom.get('creditCard')?.value);
    this.router.navigateByUrl(`checkout`);
    if (this.creditCardFrom.invalid) {
      this.creditCardFrom.markAllAsTouched();
    } else {
      this.router.navigateByUrl(`checkout`);
    }
  }
}
