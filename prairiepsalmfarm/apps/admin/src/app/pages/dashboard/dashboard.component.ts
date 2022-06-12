import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@prairiepsalmfarm/orders';
import { ProductsService } from '@prairiepsalmfarm/products';
import { UsersService } from '@prairiepsalmfarm/users';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  userCount: number = 0;
  orderCount: number = 0;
  productCount: number = 0;
  totalSales: number = 0;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.usersService.getUserCount()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(res => {
      this.userCount = res;

    });

    this.ordersService.getOrderCount()
      .pipe(takeUntil(this.endsubs$))
      .subscribe(res => {
      this.orderCount = res;
    });

    this.productsService.getProductCount()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(res => {
      this.productCount = res;
    })

    this.ordersService.getTotalSales()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(res => {
      this.totalSales = res;
    })
  }

  ngOnDestroy() {
    this.endsubs$.complete();
  }

}
