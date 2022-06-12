import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, Order, ORDER_STATUS } from '@prairiepsalmfarm/orders';
import { UsersService } from '@prairiepsalmfarm/users';
import { Subject, take, takeUntil } from 'rxjs';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { StripeService } from 'ngx-stripe';


@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private stripeService: StripeService
  ) {}
  checkoutFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId?: string = '';
  unsubs$: Subject<any> = new Subject();

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._autoFillUserData();
  }

  ngOnDestroy() {
    this.unsubs$.complete();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      street: ['', Validators.required],
      apartment: ['']
    });
  }

  private _autoFillUserData() {
    this.usersService.observeCurrentUser().pipe(takeUntil(this.unsubs$)).subscribe(user => {
      if(user) {
        this.userId = user.id;
        this.checkoutForm['name'].setValue(user.name);
        this.checkoutForm['email'].setValue(user.email);
        this.checkoutForm['phone'].setValue(user.phone);
        this.checkoutForm['city'].setValue(user.city);
        this.checkoutForm['state'].setValue(user.state);
        this.checkoutForm['zip'].setValue(user.zip);
        this.checkoutForm['apartment'].setValue(user.apartment);
        this.checkoutForm['street'].setValue(user.street);
      }
    })
  }

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map(item => {
      return {
        product: item.productId,
        quantity: item.quantity
      }
    });
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm['street'].value,
      shippingAddress2: this.checkoutForm['apartment'].value,
      city: this.checkoutForm['city'].value,
      state: this.checkoutForm['state'].value,
      zipCode: this.checkoutForm['zip'].value,
      phone: this.checkoutForm['phone'].value,
      status: '0',
      user: this.userId,
      dateOrdered: `${Date.now()}`,
    }

    this.ordersService.cacheOrderData(order);

    this.ordersService.createCheckoutSession(this.orderItems).subscribe(error => {
      if(error) {
        console.log('error in redirect to payment');
      }
    })
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
