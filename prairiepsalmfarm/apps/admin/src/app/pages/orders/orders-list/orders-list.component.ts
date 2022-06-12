import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@prairiepsalmfarm/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'prairiepsalmfarm-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  orderStatus: any = ORDER_STATUS;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }

  ngOnDestroy(): void {
    this.endsubs$.complete();
  }

  private _getOrders() {
    this.ordersService.getOrders()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(orders => {
      this.orders = orders;
      console.log(this.orders);
    })
    
  }

  deleteOrder(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(id)
        .pipe(takeUntil(this.endsubs$))
        .subscribe(() => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Order Deleted!'});
          this._getOrders();
        },
        () => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Order Not Deleted!'});
        });
      },
      reject: () => {}
  })
}


  showOrder(id: string) {
    this.router.navigateByUrl(`orders/${id}`);
  }

}
