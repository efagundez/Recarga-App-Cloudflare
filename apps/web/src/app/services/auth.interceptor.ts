import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptorFn, HttpRequest, HttpHandlerFn,
  HttpErrorResponse, HttpEvent
} from '@angular/common/http';
import { inject as ngInject } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('token');

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Token ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Token expirado: limpiar sesión y redirigir
        localStorage.clear();
        window.location.href = '/';
      }
      return throwError(() => error);
    })
  );
};
