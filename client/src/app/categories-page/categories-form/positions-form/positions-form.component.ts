import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  loading = false
  positionId = null
  modal: MaterialInstance
  form: FormGroup

  constructor(private positionsService: PositionsService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true //* загрузка определённых позиций
    //! нужно получить список всех позиций, которые относятся к текущей категории
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      this.loading = false
    })
  }

  ngOnDestroy() { //* когда метод будет вызван, нужно будет удалить модальное окно
    this.modal.destroy()
  }

  ngAfterViewInit() { //! метод будет вызван, когда загрузится контент
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id //! понимаем, что находимся в моменте редактирования определённой позиции
    this.form.patchValue({
      name: position.name, //? определяется из той позиции, по которой был клик
      cost: position.cost
    }) //* динамически изменяет значение
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.positionId = null //* означает, что нет позиции, которая редактируется
    this.form.reset({
      name: null, //? определяется из той позиции, по которой был клик
      cost: 1
    }) //* динамически изменяет значение
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Удалить позицию "${position.name}"?`)

    if (decision) {
      this.positionsService.delete(position).subscribe(
        //! обработка сервера
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1) //* удаляем с текущего индекса, там где находится данная позиция 1 element
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel() {
    this.modal.close()
  }

  onSubmit() {
    this.form.disable() //? отключаю форму и показывают на UI что работаю с сервером

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId //! id категории, к которой привязана текущая позиция categoryId
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1}) //* сбрасывание значение формы
      this.form.enable()
    }

    if (this.positionId) {
      //? Если есть id, то Редактировать позицию
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        // в ответ получим позицию 
        position => {
          //* в случае успеха, если сервер ответит той позицией, которая создана c id
          const idx = this.positions.findIndex(p => p._id === position._id) //? ищу по индекс из всех позиций
          this.positions[idx] = position
          MaterialService.toast('Изменения сохранены.')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      //? Если  нет id, то создать позицию
      this.positionsService.create(newPosition).subscribe(
        // в ответ получим позицию 
        position => {
          //* в случае успеха, если сервер ответит той позицией, которая создана c id
          MaterialService.toast('Позиция создана.')
          this.positions.push(position) //? список должен обновится и появится новая позиция
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }
  }
}
