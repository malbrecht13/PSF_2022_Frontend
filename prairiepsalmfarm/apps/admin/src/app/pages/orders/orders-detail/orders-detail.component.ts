import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService, ORDER_STATUS } from '@prairiepsalmfarm/orders';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'prairiepsalmfarm-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: any = {};
  orderStatuses: any = [];
  selectedStatus?: any;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrders();
  }

  ngOnDestroy(): void {
    this.endsubs$.complete();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      }
    });  
  }

  private _getOrders() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.ordersService.getOrder(params['id'])
        .pipe(takeUntil(this.endsubs$))
        .subscribe(order => {
          this.order = order;
          this.selectedStatus = order.status;
        })
      }
    })
    
  }

  onStatusChange(event: any) {
    this.ordersService.updateOrder(this.order.id, {status: event.value})
    .pipe(takeUntil(this.endsubs$))
    .subscribe(() => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'Order is updated!'
      });
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Order was not updated!'
      })
    }
    );
  }

}
