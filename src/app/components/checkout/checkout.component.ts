import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Country} from "../../models/country";
import {State} from "../../models/state";
import {CheckoutService} from "../../services/checkout.service";
import {WitheSpaceValidator} from "../../validators/witheSpaceValidator";
import {Router} from "@angular/router";
import {Order} from "../../models/order";
import {CartService} from "../../services/cart.service";
import {OrderItem} from "../../models/order-item";
import {Purchase} from "../../models/purchase";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../models/payment-info";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];
  checkoutFormGroup: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;

  stripe = Stripe(environment.stipePublishableKey);
  cardFields: any;
  cardErrors: any;
  storage: Storage = sessionStorage;
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder, private checkoutService: CheckoutService,
              private router: Router, private cartService: CartService) {
    const userEmail = JSON.parse(this.storage.getItem('userEmail') || 'null');

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        lastName: new FormControl('',
          [Validators.required,
            Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        email: new FormControl(userEmail,
          [Validators.required,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
            WitheSpaceValidator.notOnlyWithespace
          ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            WitheSpaceValidator.notOnlyWithespace
          ])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2), WitheSpaceValidator.notOnlyWithespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            WitheSpaceValidator.notOnlyWithespace
          ])
      }),
      creditCard: this.formBuilder.group({})
    })
  }

  ngOnInit(): void {
    this.getCartDetails();
    this.checkoutService.getCountries().subscribe(
      data => this.countries = data
    );
    this.setupStripeForm();
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName')!;
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName')!;
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email')!;
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')!
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')!
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')!
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')!
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')!
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street')!
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city')!
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state')!
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country')!
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode')!
  }

  copyAddress($event: Event) {
    const ischecked = (<HTMLInputElement>$event.target).checked;
    if (ischecked) {
      this.checkoutFormGroup.controls["billingAddress"].setValue(this.checkoutFormGroup.controls
        ["shippingAddress"].value);
      this.billingStates = this.shippingStates;
    } else {
      this.checkoutFormGroup.controls["billingAddress"].reset();
      this.billingStates = [];
    }
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName)!;
    const countryCode = formGroup.value.country.code;
    this.checkoutService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName == 'shippingAddress') {
          this.shippingStates = data;
        } else {
          this.billingStates = data;
        }
        formGroup.get('state')!.setValue(data[0]);
      }
    );
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.persistCartItems();
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
  }

  submit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let order = new Order(this.totalQuantity, this.totalPrice);
    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));
    let customer = this.checkoutFormGroup.controls['customer'].value;

    const shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(shippingAddress.country));
    shippingAddress.state = shippingState.name
    shippingAddress.country = shippingCountry.name;

    const billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(billingAddress.country));
    billingAddress.state = billingState.name
    billingAddress.country = billingCountry.name;

    let purchase = new Purchase(customer, shippingAddress, billingAddress, order, orderItems);

    const paymentInfo = new PaymentInfo();
    paymentInfo.amount = Math.round(this.totalPrice * 100);
    paymentInfo.currency = "USD";
    paymentInfo.receiptEmail = purchase.customer.email;

    if (!this.checkoutFormGroup.invalid && this.cardErrors.textContent === "") {
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
              payment_method:
                {
                  card: this.cardFields,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.lastName} ${purchase.customer.firstName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry.value.code
                    }
                  }
                },
            }, {handleActions: false}
          ).then((result: any) => {
            if (result.error) {
              alert(`There was en error: ${result.error.message}`)
              this.isDisabled = false;
            } else {
              this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                  alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`)
                  this.resetCart();
                  this.isDisabled = false;
                  this.router.navigateByUrl('/products');
                },
                error: () => {
                  alert(`An error Occured. Try again later`);
                  this.isDisabled = false;
                }
              });
            }
          });
        }
      )
    } else {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  getCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
  }

  setupStripeForm() {
    let elements = this.stripe.elements();
    this.cardFields = elements.create('card', {hidePostalCode: true});
    this.cardFields.mount('#card-element');
    this.cardFields.on('change', (event: any) => {
      this.cardErrors = document.getElementById('card-errors');
      if (event.complete()) {
        this.cardErrors.textContent = "";
      } else {
        this.cardErrors.textContent = event.error.message;
      }
    })
  }
}
