import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef // декоратор ViewChild позволяет получить доступ к input и заношу её в inputRef
  form: FormGroup
  image: File
  imagePreview = ''
  isNew = true //* изначально Angular будет думать, что идёт чистое добавление формы
  category: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit(): void {
    //* Инициализация всей формы
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required) //* будем просить пользователя чтобы он обязательно ввёл имя
    })

    this.form.disable()

    //? подписка на роуты
    // this.route.params.subscribe((params: Params) => {
    //   if (params['id']) {
        // Редактируем форму
    //     this.isNew = false
    //   }
    // }) //! обращаю к роуту и его параметру params, который указывается в app-routing-module.ts

    this.route.params
      .pipe( //? как только будет прочитан params, будет выполнен ещё один асинхронный стрим
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }

            return of(null) // позволит создавать Observeble из чего угодно
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) { //* если есть какая-то категория
            this.category = category
            this.form.patchValue({
              name: category.name
            }) //! позволяет динамически изменять данные формы
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }

          this.form.enable()
        },
        error => MaterialService.toast(error.error.message) // toast выводит сообщения об ошибке
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  deleteCategory() {
    const decision = window.confirm(`Вы уверены, что хотите удалить категорию "${this.category.name}"?`)

    if (decision) { //! если true, то это значит что пользователь согласился и нужно удалить категорию
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onFileUpload(event: any) {
    //! метод позволяет получить доступ к файлу, который загружен
    const file = event.target.files[0] //? т.к грузим всего один файл, понадобится первый элемент массива
    this.image = file

    const reader = new FileReader() // экземпляр класса fileReader

    reader.onload = () => {
      //* данный метод вызовится, тогда когда загрузится вся картинка
      this.imagePreview = reader.result // будет хранится инфа о изображении
    }

    reader.readAsDataURL(file) // говорим reader чтобы он прочитал url-файла
  }

  onSubmit() { //* здесь будут данные от текущей формы
    let obs$ // создаю стрим Observeble
    this.form.disable() // отключаем форму, чтобы контролы были выключены
    if (this.isNew) {
      //? if isNew = true, - create 
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      //? if isNew = true, - update 
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Изменения сохранены.')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
