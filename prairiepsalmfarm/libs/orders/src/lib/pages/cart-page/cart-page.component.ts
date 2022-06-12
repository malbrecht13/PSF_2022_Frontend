import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItemDetailed } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemsDetailed : CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this._getCartDetails();
  }

  ngOnDestroy() {
    this.endSubs$.complete();
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(respCart => {
      this.cartItemsDetailed = [];
      this.cartCount = respCart?.items.length ?? 0;
      respCart.items.forEach(item => { 
        this.ordersService.getProduct(item.productId!).subscribe(resProduct => {
          this.cartItemsDetailed.push({
            product: resProduct,
            quantity: item.quantity
          })
        });
      })
    })
    
  }

  backToShop() {
    this.router.navigate(['/products']);
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  updateCartItemQuantity(event: any, cartItem: CartItemDetailed) {
    this.cartService.setCartItem({
      productId: cartItem.product.id,
      quantity: event.value
    }, true); //true indicates that we are updating the cart item, not adding a new value
  }

}
