export class Cart {
  items: CartItem[] = [];
}

export class CartItem {
  productId?: string = '';
  quantity?: number = 1;
}

export class CartItemDetailed {
  product?: any;
  quantity?: number;
}