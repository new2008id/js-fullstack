import { AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef

  links = [
    {url: '/overview', name: 'Обзор'},
    {url: '/analytics', name: 'Аналитика'},
    {url: '/history', name: 'История'},
    {url: '/order', name: 'Добавить заказ'},
    {url: '/categories', name: 'Ассортимент'}
  ]

  constructor(private auth: AuthService,
              private router: Router) { }

  //! Ждём пока полностью загрузится Dom-дерево
  ngAfterViewInit() { // данный метод будет вызван тогда, когда DOM-элемент будет в node
    MaterialService.initializeFloatingButton(this.floatingRef) //* передаю данную референцию
  }

  logout(event: Event) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])
  }

}
