import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsPage } from '../shared/interfaces';
import {Chart} from 'chart.js'
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number // тот средний чек, который будет приходиться с backend
  pending = true


  constructor(private service: AnalyticsService) { 
  }

  ngAfterViewInit() {
    const gainConfig: any = { //* конфиг для графика
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }

    const orderConfig: any = { //* конфиг для графика
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label) //* поле char служит для данных графика и нужно получить массив всех labels
      gainConfig.data = data.chart.map(item => item.gain) //? отдаю данные к выручке

      orderConfig.labels = data.chart.map(item => item.label) //* поле char служит для данных графика и нужно получить массив всех labels
      orderConfig.data = data.chart.map(item => item.order) //? отдаю данные к заказам

      // **** Gain ****
      // // gainConfig.labels.push('08.02.2021')
      // // gainConfig.data.push(630)

      // // gainConfig.labels.push('09.02.2021')
      // // gainConfig.data.push(700)

      // // gainConfig.labels.push('10.02.2021')
      // // gainConfig.data.push(500)
      // **** Gain ****

      // **** Order ****
      // // orderConfig.labels.push('08.02.2021')
      // // orderConfig.data.push(8)

      // // orderConfig.labels.push('09.02.2021')
      // // orderConfig.data.push(15)

      // // orderConfig.labels.push('10.02.2021')
      // // orderConfig.data.push(7)
      // **** Order ****

      const gainCtx = this.gainRef.nativeElement.getContext('2d') //* интересует двухмерный график
      const orderCtx = this.orderRef.nativeElement.getContext('2d') //* интересует двухмерный график
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

//! функция для генерирования конфигурации всего графика
function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
