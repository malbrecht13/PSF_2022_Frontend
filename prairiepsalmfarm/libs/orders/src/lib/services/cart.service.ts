import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  initCartLocalStorage() {
    const cart : Cart = this.getCart();
    if(!cart) {
      const initialCart = {
        items: []
      };
      localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
    } 
    
  }

  emptyCart() {
    const initialCart = {
      items: []
    };
    localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
    this.cart$.next(initialCart);
  }

  getCart() : Cart {
    const localStorageCart = localStorage.getItem(CART_KEY)!;
    const cart: Cart = JSON.parse(localStorageCart);
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();
    const cartItemExists = cart.items.find((item) => item.productId === cartItem.productId);
    if(cartItemExists) {
      cart.items.map(item => {
        if (item.productId === cartItem.productId) {
          if(updateCartItem) {
            item.quantity = cartItem.quantity;
          }
          else {
            item.quantity = item.quantity! + cartItem.quantity!;
          }
        }
        return item;
      })
    }
    else {
      cart.items.push(cartItem);
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string) {
    const cart = this.getCart();
    const newCart = cart.items.filter(item => item.productId !== productId);

    cart.items = newCart;
    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);
  }
}
