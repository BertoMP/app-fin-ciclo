import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';
import { LoginInterceptor } from "./login.interceptor";
import { RefreshTokenInterceptor } from "./refresh-token.interceptor";
import { LogoutInterceptor } from "./logout.interceptor";

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true},
  { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true},
  { provide: HTTP_INTERCEPTORS, useClass: LogoutInterceptor, multi: true }
];
