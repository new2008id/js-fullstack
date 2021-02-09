//! Нужен для обработки http запросов и шифровать их по своему
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { //? Буду перехватывать все HttpRequest<any> которые уходят на сервер 
    if (this.auth.isAuthhenticated()) {
      req = req.clone({
        //! передаю новый объект конфигугараций, чтобы он не мутировал
        setHeaders: {
          Authorization: this.auth.getToken() //* Указываю тот header, для определённого запроса 
        }
      })
    }
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => this.handleAuthError(error)
      )
    )
  } 

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) { //? нужно проверить какой код ошибки, 401 - либо не имеет токена, либо он не правильный
      this.router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      })
    } 

    return throwError(error) //* данный метод позволяет создать Observeble-ошибку из ошибки error
  } //! приватный метод, который сможет обрабатывать ошибку
}