import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { CategoriesFormComponent } from './categories-page/categories-form/categories-form.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { LoginPageComponent } from './login-page/login-page.component'
import { OrderPageComponent } from './order-page/order-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { OrderCategoriesComponent } from './order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './order-page/order-positions/order-positions.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      //? массив children будут входить те роуты, которые будут входить в AuthLayoutComponent 
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      //! буду выполнять редирект в случае полного совпадения
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}

    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      //? массив children будут входить те роуты, которые будут входить в SiteLayoutComponent 
      {path: 'overview', component: OverviewPageComponent},
      {path: 'analytics', component: AnalyticsPageComponent},
      {path: 'history', component: HistoryPageComponent},
      {path: 'order', component: OrderPageComponent, children: [
        {path: '', component: OrderCategoriesComponent},
        {path: ':id', component: OrderPositionsComponent}
      ]},
      {path: 'categories', component: CategoriesPageComponent},
      {path: 'categories/new', component: CategoriesFormComponent},
      {path: 'categories/:id', component: CategoriesFormComponent}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  //* forRoot регистрирует методы для статичного приложения массива routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
