import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order[]
  @ViewChild('modal') modalRef: ElementRef //* получаю доступ к референции модального окна

  selectedOrder: Order
  modal: MaterialInstance

  ngOnDestroy(): void {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef) //? инициализируем модальное окно
  }

  computedPrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0) //* возвращаем заказ 
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open() //* нужно открыть модальное окно
  }

  closeModal() {
    this.modal.close()
  }

}
