import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '@env/environment';
import { OrderItem } from '@prairiepsalmfarm/orders';
import { StripeService } from 'ngx-stripe';

const url = environment.apiURL + 'orders/';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient,
      private stripeService: StripeService
    ) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(url);
  }

  getOrder(id: string) : Observable<Order> {
    return this.http.get<Order>(`${url}${id}`);
  }

  createOrder(order: Order): Observable<Order>{
    return this.http.post<Order>(`${url}`, order);
  }

  deleteOrder(id: string): Observable<Object> {
    return this.http.delete<Object>(`${url}${id}`);
  }

  updateOrder(id:string, orderStatus: {status: string}): Observable<Order> {
    return this.http.put<Order>(`${url}${id}`, orderStatus);
  }

  getOrderCount(): Observable<number> {
    return this.http.get<number>(`${url}get/count`)
    .pipe((map((objectValue: any) => objectValue.orderCount)));
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${url}get/totalsales`)
    .pipe((map((objectValue: any) => objectValue.totalsales)));
  }

  //will refactor later
  getProduct(id: string) : Observable<any> {
    return this.http.get<any>(`${environment.apiURL + 'products/'}${id}`);
  }

  createCheckoutSession(orderItems: OrderItem[]) {
    return this.http.post(`${url}create-checkout-session`, orderItems).pipe(switchMap((session: any) => {
      return this.stripeService.redirectToCheckout({sessionId: session.id})
    }));
  }

  cacheOrderData(order: Order) {
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  getCachedOrderData(): Order {
    return JSON.parse(localStorage.getItem('orderData')!);
  }

  removeCachedOrderData() {
    localStorage.removeItem('orderData');
  }


}
