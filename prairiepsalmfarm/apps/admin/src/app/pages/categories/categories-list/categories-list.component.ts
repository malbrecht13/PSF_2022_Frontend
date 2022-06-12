import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@prairiepsalmfarm/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'prairiepsalmfarm-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    this._getCategories();
    
  }

  ngOnDestroy(): void {
    this.endsubs$.complete();
  }

  deleteCategory(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(id).subscribe(res => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Category Deleted!'});
          this._getCategories();
        },
        (error) => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Category Not Deleted!'});
        });
      },
      reject: () => {}
  });
   
  }

  updateCategory(id: string) {
    this.router.navigateByUrl(`categories/form/${id}`);
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(
      cats => {
        this.categories = cats;
      }
    )
  }

  setCategoryColor(color: string) {
    let style = {
      'background-color': color,
      'width': '30px',
      'border-radius': '50%',
      'height': '30px'
    }
    return style;
  }

}
