import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService} from '@prairiepsalmfarm/products';
import { MessageService } from 'primeng/api';
import { timer, firstValueFrom, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'prairiepsalmfarm-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form: UntypedFormGroup = new UntypedFormGroup({});
  categories: any = [];
  imageDisplay?: string | ArrayBuffer;
  endsubs$: Subject<any> = new Subject();

  constructor(private formBuilder: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    private location: Location,
    private productsService: ProductsService,
    private messageService: MessageService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  ngOnDestroy(): void {
    this.endsubs$.complete();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    })
  }

  private _getCategories() {
    this.categoriesService.getCategories()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(categories => {
      this.categories = categories;
    });
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if(params['id']) {
        this.editMode = true;
        this.productsService.getProduct(params['id']).subscribe(product => {
          this.productForm['name'].setValue(product.name);
          const catId = product.category as any;
          this.productForm['category'].setValue(catId._id);
          this.productForm['brand'].setValue(product.brand);
          this.productForm['price'].setValue(product.price);
          this.productForm['countInStock'].setValue(product.countInStock);
          this.productForm['isFeatured'].setValue(product.isFeatured);
          this.productForm['description'].setValue(product.description);
          this.productForm['richDescription'].setValue(product.richDescription);
          this.imageDisplay = product.image;
          this.productForm['image'].setValidators([]);
          this.productForm['image'].updateValueAndValidity();
        });
      }
    })
  }

  onSubmit() {
    if(this.form.invalid) return;

    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      console.log(key, this.productForm[key].value);
      productFormData.append(key, this.productForm[key].value);
    });
    if(this.editMode) {
      this._updateProduct(productFormData);
    } 
    else {
      this._addProduct(productFormData);
    }
    
  }

  private _updateProduct(productFormData: FormData) {
    this.route.params
    .pipe(takeUntil(this.endsubs$))
    .subscribe(params => {
      this.productsService.updateProduct(params['id'], productFormData)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(() => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Product Updated!'});
        firstValueFrom(timer(2000)).then(done => {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({severity:'error', summary:'Error', detail:'Product Not Updated!'});
      });
    })
  }

  private _addProduct(productData: FormData) {
    
    this.productsService.createProduct(productData)
    .pipe(takeUntil(this.endsubs$))
    .subscribe((product: Product) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`Product ${product.name} Created!`});
      firstValueFrom(timer(2000)).then(done => {
        this.location.back();
      })
    },
    () => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Product Not Created!'});
    });
  }

  cancel() {
    this.location.back();
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if(file) {
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as ArrayBuffer;
      }
      fileReader.readAsDataURL(file);
    }
  }
  
  get productForm() {
    return this.form.controls;
  }

}
