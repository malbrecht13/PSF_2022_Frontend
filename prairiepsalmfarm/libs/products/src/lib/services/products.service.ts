import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '@env/environment';

const url = environment.apiURL + 'products/';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if(categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(url, { params: params });
  }

  getProduct(id: string) : Observable<Product> {
    return this.http.get<Product>(`${url}${id}`);
  }

  createProduct(productData: FormData): Observable<Product>{
    return this.http.post<Product>(`${url}`, productData);
  }

  deleteProduct(id: string): Observable<Object> {
    return this.http.delete<Object>(`${url}${id}`);
  }

  updateProduct(id:string, productFormData: FormData): Observable<Product> {
    return this.http.put<Product>(`${url}${id}`, productFormData);
  }

  getProductCount(): Observable<number> {
    return this.http.get<number>(`${url}get/count`)
    .pipe((map((objectValue: any) => objectValue.productCount)));
  }

  getFeaturedProducts(count:number): Observable<Product[]> {
    return this.http.get<Product[]>(`${url}get/featured/${count}`);
  }
}
