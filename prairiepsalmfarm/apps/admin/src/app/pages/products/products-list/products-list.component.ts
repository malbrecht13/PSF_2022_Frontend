import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@prairiepsalmfarm/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'prairiepsalmfarm-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: any = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private productsService: ProductsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this._getProducts();
  }

  ngOnDestroy(): void {
    this.endsubs$.complete();
  }

  private _getProducts() {
    this.productsService.getProducts()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(products => {
      this.products = products;
    })
  }

  deleteProduct(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(id)
        .pipe(takeUntil(this.endsubs$))
        .subscribe(res => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Product Deleted!'});
          this._getProducts();
        },
        (error) => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Product Not Deleted!'});
        });
      },
      reject: () => {}
  });
  }

  updateProduct(id: string) {
    this.router.navigateByUrl(`products/form/${id}`);
  }

}
