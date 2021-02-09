const mongoose = require('mongoose')
const Schema = mongoose.Schema //* позволяет создавать схему для текущей модели

const userSchema = new Schema({
  email: {
    type: String,
    required: true, //! данное поле является обязательным, если его не будет, то будет error
    unique: true //! означает, что mongoose будет проверять, делается для того, чтобы email был уникальным во всей системе
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('users', userSchema) //! Создаём таблицу и передаём модель, объект конфигруации Schema