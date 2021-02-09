import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { MaterialDatepicker, MaterialService } from 'src/app/shared/classes/material.service';
import { Filter } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') startRef: ElementRef //* получил доступ к локальной референции
  @ViewChild('end') endRef: ElementRef //* получил доступ к локальной референции

  start: MaterialDatepicker
  end: MaterialDatepicker
  order: number

  isValid = true

  ngOnDestroy() {
    this.start.destroy()
    this.end.destroy()
  }
  
  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    //! форма должна быть валидна
    if (!this.start.date || !this.end.date) {
      this.isValid = true
      return 
    }

    this.isValid = this.start.date < this.end.date
    

  }

  submitFilter() {
    const filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }

    if (this.start.date) {
      filter.start = this.start.date
    }

    if (this.end.date) {
      filter.end = this.end.date
    }



    this.onFilter.emit(filter) //* emit данных в другие компоненты
  }

}
