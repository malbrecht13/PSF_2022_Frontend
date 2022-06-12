import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setToken(data: any) {
    localStorage.setItem(TOKEN, data);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN) as string;
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN);
  }

  isValidToken(): boolean {
    const token = this.getToken();
    if(token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      return !this._tokenExpired(tokenDecode.exp);
    }
    return false;
  }

  getUserIdFromToken() {
    const token = this.getToken();
    if(token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if(tokenDecode) {
        return tokenDecode.userId;
      }
    }
    return null;
  }

  private _tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
