import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '../models/user';
import { UsersFacade } from '../state/users.facade';

const url = environment.apiURL + 'users/';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private usersFacade: UsersFacade
    ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(url);
  }

  getUser(id: string) : Observable<User> {
    return this.http.get<User>(`${url}${id}`);
  }

  createUser(user: User): Observable<User>{
    return this.http.post<User>(`${url}/register`, user);
  }

  deleteUser(id: string): Observable<Object> {
    return this.http.delete<Object>(`${url}${id}`);
  }

  updateUser(id:string, user: User): Observable<User> {
    return this.http.put<User>(`${url}${id}`, user);
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${url}get/count`)
    .pipe((map((objectValue: any) => objectValue.userCount)));
  }

  initAppSession() {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser() {
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuth() {
    return this.usersFacade.isAuthenticated$;
  }
}
