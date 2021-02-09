const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
//! пакет cors служит, чтобы сервер мог обрабатываь cors запросы 
//? пакет morgan - позволяет более красиво логировать определённые запросы, смотреть, что происходит с сервером в данный момент
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch(error => console.log(error))

app.use(passport.initialize()) //! указываем проекту, что он будет работать с Passport.js
require('./middleware/passport')(passport)

app.use(require('morgan')('dev')) //* 'dev' находимся в режиме разработки
app.use('/uploads', express.static('uploads')) //? делаем папку uploads статической, а также даст доступ получать картинки напрямую
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()) //* позволит генерировать json-объекты из json который получаем
app.use(require('cors')())

//! urlencoded -позволит не кодировать url, которые приходят 
//? localhost:5000/api/auth/login

app.use('/api/auth', authRoutes) // use позоляет добавлять различные плагины или роуты
app.use('/api/analytics', analyticsRoutes) // use позоляет добавлять различные плагины или роуты
app.use('/api/category', categoryRoutes) // use позоляет добавлять различные плагины или роуты
app.use('/api/order', orderRoutes) // use позоляет добавлять различные плагины или роуты
app.use('/api/position', positionRoutes) // use позоляет добавлять различные плагины или роуты

module.exports = app //* import внаружу app