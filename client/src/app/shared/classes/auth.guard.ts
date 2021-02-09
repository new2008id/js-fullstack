//! Все классы которые защищают роуты, называют guard
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root' //! Angular автоматически зарегистрирует данный сервис в app.module.ts
})
export class AuthGuard implements CanActivate, CanActivateChild{
  constructor(private auth: AuthService,
              private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.auth.isAuthhenticated()) { //* если пользователь зарегистрирован
      return of(true) //! оператор of позволяет создавать Observeble
    } else { //? если же на страницу зайти нельзя
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      })
      return of(false) //* запрещаем заход в данную истему
    } 
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state)
  }
}

//! auth: AuthService позволяет определить является ли пользователь сейчас с токеном, может ли он заходить на определённые страницы