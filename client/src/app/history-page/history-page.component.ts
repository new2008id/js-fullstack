import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { Filter, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialInstance
  oSub: Subscription
  isFilterVisible = false
  orders: Order[] = [] //* будет хранится список всех заказов
  filter: Filter = {}

  offset = 0 
  limit = STEP //* количество, которое загружается

  loading = false //* отвечает только за загрузку Ещё элементов
  reloading = false //* отвечает за перезагрузку всех элементов, при пр.р фильтров или очищать фильтры
  noMoreOrders = false

  constructor(private ordersService: OrdersService) { 
  }

  ngOnInit(): void {
    this.reloading = true
    this.fetch() //! пока делаю локальный метод fetch, пока не загрузится страница
  }

  private fetch() {
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // }

    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  applyFilter(filter: Filter) {
    //* загружаю данные согласна фильтру
    this.orders = []
    this.offset = 0 // фильтрацию начинаю с 0
    this.filter = filter
    this.reloading = true //* перезагрузка всех компонентов
    this.fetch()
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef) //* занёс в переменную чтобы DOm-дерево не засорялось и работало быстро
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0 //! если не равняется 0, то фильтр применен
  }
}
