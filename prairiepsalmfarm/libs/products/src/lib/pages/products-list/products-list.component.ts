import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, Product } from '@prairiepsalmfarm/products';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage?: boolean;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['categoryid']) {
        this._getProducts([params['categoryid']]);
        this.isCategoryPage = true;
      } 
      else {
        this._getProducts();
        this.isCategoryPage = false;
      }
    });
    this._getCategories();
  }

  private _getProducts(categoriesFilter?: any[]) {
    this.productsService.getProducts(categoriesFilter).subscribe(products => {
      this.products = products;
    })
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  categoryFilter() {
    const selectedCategories = this.categories.filter(category => category.checked).map(category => category._id);

    this._getProducts(selectedCategories);
    
  }

}
