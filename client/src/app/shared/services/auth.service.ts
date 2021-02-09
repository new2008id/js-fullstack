//! данный файл будет отвечать за сервис, и будет позволять делать авторизацию
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../interfaces";
import {tap} from "rxjs/operators"

@Injectable({
  providedIn: 'root' //! Angular автоматически зарегистрирует данный сервис в app.module.ts
})
export class AuthService {
  private token = null 

  constructor(private http: HttpClient) {

  }

  register(user: User): Observable<User> {
    //! при регистрации возвращем именно пользователя
    return this.http.post<User>('/api/auth/register', user)
  }

  login(user: User): Observable<{token: string}> {
    //* возвращаем user и делаем некоторые асинхронные запросы с сервером
    return this.http.post<{token: string}>('/api/auth/login', user)
      .pipe( //! в метод pipe можно передавать n-количество операторов, которые будут вызыватся по цепочке, когда будет работать стрим 
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token) 
          }
        ) //* tap позволяет выцепить что-то из стрима
      )
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token //? потребуется для того, чтобы возвращать token в различных запросов
  } //* чтобы получать значение tokena в других классах

  //! метод, позволяет определить находится ли сейчас в сессии пользователь или нет
  isAuthhenticated(): boolean {
    return !!this.token //? приводим к boolean значению, то есть 2 раза отрицаем
  }

  //* метод, выхода из системы
  logout() {
    this.setToken(null) // обнуляем значение tokena при выходе из системы
    localStorage.clear()
  }
}