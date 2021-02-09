const mongoose = require('mongoose')
const Schema = mongoose.Schema //* позволяет создавать схему для текущей модели

const categorySchema = new Schema({
  name: {
    type: String,
    required: true //! данное поле является обязательным, если его не будет, то будет error
  },
  imageSrc: {
    type: String,
    default: '' //* если не отправляем картинку, чтобы нечего неломалось, оставляю по умолчанию
  },
  user: { //! здесь будет ссылка на определённого пользователя
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('categories', categorySchema) //! Создаём таблицу и передаём модель, объект конфигруации Schema