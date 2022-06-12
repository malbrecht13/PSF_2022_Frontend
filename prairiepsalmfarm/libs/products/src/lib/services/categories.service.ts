import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '@env/environment';

const url = environment.apiURL + 'categories/';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(url);
  }

  getCategory(id: string) : Observable<Category> {
    return this.http.get<Category>(`${url}${id}`);
  }

  createCategory(category: Category): Observable<Category>{
    return this.http.post<Category>(`${url}`, category);
  }

  deleteCategory(id: string): Observable<Object> {
    return this.http.delete<Object>(`${url}${id}`);
  }

  updateCategory(id:string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${url}${id}`, category);
  }
}
