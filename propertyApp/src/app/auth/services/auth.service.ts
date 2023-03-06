import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRepsonse, User } from '../interfaces';

@Injectable({ providedIn: 'root' })

export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private endpoint: string = '/auth';
  private _user!: User;
  private url = `${this.baseUrl + this.endpoint}`;

  get user() { return { ...this._user }; }

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<AuthRepsonse>(this.url, body)
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            localStorage.setItem('atoken', resp.data.access_token);
            localStorage.setItem('rtoken', resp.data.refresh_token);
            this._user = {
              id: resp.data.id!,
              accountid: resp.data.accountid!,
              email: resp.data.email!,
              access_token: resp.data.access_token!,
              image: resp.data.image!,
              name: resp.data.name!,
              role: resp.data.role!
            }
          }
        }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      );
  }

  validateToken(): Observable<boolean> {
    const body = { "refresh_token": localStorage.getItem('rtoken') };
    return this.http.patch<AuthRepsonse>(this.url, body)
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            localStorage.setItem('atoken', resp.data.access_token);
            localStorage.setItem('rtoken', resp.data.refresh_token);
            this._user = {
              id: resp.data.id!,
              accountid: resp.data.accountid!,
              email: resp.data.email!,
              access_token: resp.data.access_token!,
              image: resp.data.image!,
              name: resp.data.name!,
              role: resp.data.role!
            }
          }
        }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      )
  }

  logout() { localStorage.clear(); }
}
