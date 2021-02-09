import { Injectable } from "@angular/core";
import { OrderPosition, Position } from "../shared/interfaces";

@Injectable()

export class OrderService {
  //! класс будет помогать локально запоминать что выбрали и какой список нужно будет отображать

  //массив который будет создаржать все позиции, которые добавлены
  public list: OrderPosition[] = []
  public price = 0

  add(position: Position) { //? позволит добавлять что-то в заказ
    // высчитать цену, вычесть общую стоимость всего заказа
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    }) //! можем создать новые объекты и наследовать их друг от друга

    const candidate = this.list.find(p => p._id === orderPosition._id) //* пробую найти в list элемент и попытатся что-либо добавить

    if (candidate) {
      // изменяем количество
      candidate.quantity += orderPosition.quantity
    } else {
      //? тогда будем добавлять новую позицию в список
      this.list.push(orderPosition) 
    }

    this.computePrice() //! высчитай мне цену

  }

  remove(orderPosition: OrderPosition) { //? позволит удалять определённый элемент из заказа
    const idx = this.list.findIndex(p => p._id === orderPosition._id) // нахожу индекс того элемента, который нужно удалить
    this.list.splice(idx, 1) // указываю с какого номера нужно начать удаление

    this.computePrice() //! высчитай мне цену
  }

  clear() { //? который после того, как данные отправятся на сервер, будет очищать данный сервис
    this.list = []  
    this.price = 0
  }

  private computePrice() {
    //* будет пересчитывать всю цену, отталкиваясь от текущего списка, т.е что лежит в данном списке
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0)
  }
}