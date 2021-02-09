import { ElementRef } from "@angular/core"

//! Здесь будет класс, который будет работать с различными сущностями, используемые для material-design
declare var M

export interface MaterialInstance {
  open?(): void
  close?(): void
  destroy?(): void
}

//* interface Datepicker
export interface MaterialDatepicker extends MaterialInstance {
  date?: Date 
}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement) //! передаю референции нативный элемент, в данном свойстве лежит нативный элемент, который нужен для material дизайна
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement)
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement)
  }

  //* метод позволяет проинициализировать picker
  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose //? cbfn будет закрываться в том случае, когда будет вызван picker 
    })
  }

  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement)

  }
}