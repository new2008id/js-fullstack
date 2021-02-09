import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/interfaces';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss']
})
export class OrderCategoriesComponent implements OnInit {

  categories$: Observable<Category[]> //* некоторый асинхронный код 

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    //! переменную переопределяем, она будет равнятся тому, что вернёт сервис
    //* method fetch позволил получить список всех категорий
    this.categories$ = this.categoriesService.fetch() 
  }

}
