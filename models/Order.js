const mongoose = require('mongoose')
const Schema = mongoose.Schema //* позволяет создавать схему для текущей модели

const orderSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  order: { //? его порядок
    type: Number,
    required: true
  },
  list: [
    {
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      cost: {
        type: Number
      }
    }
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('orders', orderSchema) //! Создаём таблицу и передаём модель, объект конфигруации Schema