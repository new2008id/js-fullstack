import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) {
  }
  
  //* метод позволит создать новый заказ
  create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order)
  }

  //* метод позволит получить список всех заказов
  fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({
        fromObject: params
      }) //* данный класс позволяет удобно работать с get параметрами
    }) //? с помощью метода get буду получать список, буду получать массив заказов
  }
}