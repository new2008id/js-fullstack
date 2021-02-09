import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup //* указал тип данной переменной
  aSub: Subscription //! указывает за утечку памяти, а точнее за её отсутствие

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void { //? вызывается тогда, когда компонент проинициализируется
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Теперь вы можете зайти в систему используя свои данные')
      } else if (params['accessDenied']) {
        MaterialService.toast('Для начала авторизуйтесь в системе')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Пожалуйста войдите в систему заного')
      }
    })
  }

  ngOnDestroy() { //? данный метод вызовится, когда будет уничтожение компонента login, то есть будет переход на другую страницу, отписываемся от определённого стрима
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable() //? позволяет отключить всю форму, на тот момент, когда идёт некоторый запрос
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']), //* первая fnCallback будет вызыватся тогда, когда успешно выполнен вход в систему
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      } //! второй fnCallback будет принимать некоторую ошибку
    )
  }

}
