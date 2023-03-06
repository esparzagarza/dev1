import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { IResponse } from './interfaces/iresponse';

@Injectable({ providedIn: 'root' })

export class RepositoryService {

  private _heroe!: any;
  private _response!: IResponse;
  private _baseUrl: string = environment.baseUrl;
  private _modules: {} = environment.modules;
  private _headers = new HttpHeaders().set('Authorization', `Bearer ${this.user.access_token}`);

  get datenow() { return new Date(); }
  get modules() { return this._modules; }
  get baseUrl() { return this._baseUrl; }
  get user() { return this.authService.user; }
  get response() { return { ...this._response }; }
  get heroe() { return { ...this._heroe }; }

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllData(module: string) {
    const url = `${this._baseUrl}/${module}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getOneById(module: string, id: string) {
    const url = `${this._baseUrl}/${module}/getone?id=${id}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getListByColumn(module: string, field: string, value: string) {
    const url = `${this._baseUrl}/${module}/listByColumn?${field}=${value}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  storeItem(module: string, body: {}) {
    const url = `${this._baseUrl}/${module}`;
    return this.http.post<IResponse>(url, body, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  postItem(module: string, body: {}) {
    const url = `${this._baseUrl}/${module}`;
    return this.http.post<IResponse>(url, body, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      );
  }

  putItem(module: string, body: {}) {
    const url = `${this._baseUrl}/${module}`;
    return this.http.put<IResponse>(url, body, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      );
  }

  patchItem(module: string, body: {}) {
    const url = `${this._baseUrl}/${module}`;
    return this.http.patch<IResponse>(url, body, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      );
  }

  deleteItem(module: string, id: string) {
    const url = `${this._baseUrl}/${module}?id=${id}`;
    return this.http.delete<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      );
  }

  uploadFile(body: FormData) {
    const url = `${this._baseUrl}/uploadFile`;
    return this.http.post<IResponse>(url, body, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.data),
        catchError(err => of(err.error))
      );
  }

  sendEmail(body: {}) {
    const url = `${this._baseUrl}/sendContract`;
    return this.http.post<IResponse>(url, body, { headers: this._headers })
      .pipe(
        tap(resp => { if (resp.status == 200) this._heroe = resp.data!; }),
        map(resp => resp.status),
        catchError(err => of(err.error.message))
      );
  }


  /**********************************
   * Custom
   *********************************/

  getAllContracts(module: string) {
    const url = `${this._baseUrl}/${module}/getContracts`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getContract(module: string, id: string) {
    const url = `${this._baseUrl}/${module}/getContract?id=${id}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getAllPayments(module: string) {
    const url = `${this._baseUrl}/${module}/getPayments`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getAllRents(module: string) {
    const url = `${this._baseUrl}/${module}/getRents`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getPayment(module: string, id: string) {
    const url = `${this._baseUrl}/${module}/getPayment?id=${id}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getAllExpenses(module: string) {
    const url = `${this._baseUrl}/${module}/getExpenses`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getExpense(module: string, id: string) {
    const url = `${this._baseUrl}/${module}/getExpense?id=${id}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }

  getPSummary(module: string, pyear: string, pmonth: string) {
    const url = `${this._baseUrl}/${module}/getPSummary?pyear=${pyear}&pmonth=${pmonth}`;
    return this.http.get<IResponse>(url, { headers: this._headers })
      .pipe(
        tap(resp => {
          if (resp.status == 200) {
            this._response = {
              status: resp.status!,
              message: resp.message!,
              data: resp.data
            }
          }
        }),
        map(resp => resp.data),
        catchError(err => of(err.error.message))
      );
  }
}
