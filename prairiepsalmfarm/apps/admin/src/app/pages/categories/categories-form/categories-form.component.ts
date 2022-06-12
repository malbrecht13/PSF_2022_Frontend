import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@prairiepsalmfarm/products';
import { MessageService } from 'primeng/api';
import { timer, firstValueFrom, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'prairiepsalmfarm-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup = new UntypedFormGroup({});
  editMode: boolean = false;
  endsubs$: Subject<any> = new Subject();

  constructor(private formBuilder: UntypedFormBuilder, 
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    })

    this._checkEditMode();
  }

  ngOnDestroy(): void {
      this.endsubs$.complete();
  }

  onSubmit() {
    if(this.form.invalid) return;
    
    const category : Category = {
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value,
      color: this.categoryForm['color'].value
    }

    if(this.editMode) {
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }
  }

  private _updateCategory(category: Category) {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      this.categoriesService.updateCategory(params['id'], category)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(() => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Category Updated!'});
        firstValueFrom(timer(2000)).then(done => {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({severity:'error', summary:'Error', detail:'Category Not Updated!'});
      });
    })
    
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category)
    .pipe(takeUntil(this.endsubs$))
    .subscribe(() => {
      this.messageService.add({severity:'success', summary:'Success', detail:'Category Created!'});
      firstValueFrom(timer(2000)).then(done => {
        this.location.back();
      })
    },
    () => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Category Not Created!'});
    });
  }

  private _checkEditMode(){
    this.route.params
    .pipe(takeUntil(this.endsubs$))
    .subscribe(params => {
      if(params['id']) {
        this.editMode = true;
        this.categoriesService.getCategory(params['id']).subscribe(category => {
          this.categoryForm['name'].setValue(category.name);
          this.categoryForm['icon'].setValue(category.icon);
          this.categoryForm['color'].setValue(category.color);
        });
      }
    })
  }

  cancel(): void {
    this.location.back();
  }

  get categoryForm() {
    return this.form.controls;
  }

}
