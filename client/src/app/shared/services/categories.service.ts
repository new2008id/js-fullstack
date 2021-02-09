//! Сервис для работы с категориями
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category, Message } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Category[]> { //* получить список всех категорий по сервису
    return this.http.get<Category[]>('/api/category')
  } 

  getById(id: string): Observable<Category> { //! по одной категории
    return this.http.get<Category>(`/api/category/${id}`)
  }

  create(name: string, image?: File): Observable<Category> { //! позволит создавать новые категории

    //* отправлять экземлпяр класса formData
    const fd = new FormData()

    if (image) {
      fd.append('image', image, image.name)
    }
    fd.append('name', name)

    return this.http.post<Category>('/api/category', fd)
  }

  update(id: string, name: string, image?: File): Observable<Category> { //! позволит обновлять категории

    //* отправлять экземлпяр класса formData
    const fd = new FormData()

    if (image) {
      fd.append('image', image, image.name)
    }
    fd.append('name', name)

    return this.http.patch<Category>(`/api/category/${id}`, fd)
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/category/${id}`)
  }
}




//? HttpClient позволяет делать асинхронные запросы