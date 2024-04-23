import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {UserModel} from "../interfaces/user.model";
import {JwtHelperService} from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  loggedInUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loggedInUser.next(this.isLoggedIn());
  }

  get isLoggedInUser(): Observable<boolean> {
    return this.loggedInUser.asObservable();
  }

  register(newUser: UserModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/registro`, newUser)
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/login`, {
      email: email,
      password: password
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/logout`, {});
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token')??'';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refresh_token')??'';
  }

  getUserRole(): number {
    const accessToken: string = this.getAccessToken();
    const decodedToken = this.jwtHelper.decodeToken(accessToken);

    return decodedToken.user_role;
  }

  getUserId(): number {
    const accessToken: string = this.getAccessToken();
    const decodedToken = this.jwtHelper.decodeToken(accessToken);

    return decodedToken.user_id;
  }

  isLoggedIn(): boolean {
    const refreshToken: string = this.getRefreshToken();

    if (!refreshToken || this.jwtHelper.isTokenExpired(refreshToken)) {
      this.loggedInUser.next(false);
    }

    return !this.jwtHelper.isTokenExpired(refreshToken);
  }

  storeAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  storeRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  removeTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      return this.http.post(
        `${this.apiUrl}/usuario/refresh-token`,
        {refresh_token: refreshToken}
      )
        .pipe(
          tap((tokens: any) => {
            this.storeAccessToken(tokens.access_token);
            this.storeRefreshToken(tokens.refresh_token);
          }),
          catchError(this.handleError)
        );
    }

    return throwError(() => new Error('No hay token de refresco almacenado'));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = errorRes.error.errors??'Ha ocurrido un error durante el proceso';

    console.log(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
