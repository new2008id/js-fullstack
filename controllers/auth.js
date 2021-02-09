const bcrypt = require('bcryptjs') //* позволяет зашифровывать пароли user
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

//! req - здесь хранятся все данные, которые отправляет пользователь
module.exports.login = async function(req, res) {
  const candidate = await User.findOne({email: req.body.email})

  if (candidate) {
    //* Проверяем пароль, пользователь существует

    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password) 
    //? compareSync позволяет сравнивать пароли в синхронном режиме
    if (passwordResult) {
      //! Если пароль true, то генерируем токен, пароли совпали

      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id 
      }, keys.jwt, {expiresIn: 60 * 60 }) // 60 sec * 60 hour

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      //! Пароли не совпали
      res.status(401).json({
        message: 'Пароли не совпадают. Попробуйте снова.'
      })
    }
  } else {
    //! Пользователя нет, ошибка

    res.status(404).json({
      message: 'Пользователь с таким Email не найден.'
    })
  }
}


module.exports.register = async function(req, res) {
  //! будет отправлять сюда email, password, чтобы создать аккаунт

  const candidate = await User.findOne({email: req.body.email}) //? положим то значение, которое находится или не находится в БД
  //* findOne - нужно найти какой-нибудь один элемент

  if (candidate) {
    //? Пользователь существует, нужно отдать ошибку
    res.status(409).json({
      message: 'Такой Email уже занят. Попробуйте другой.'
    })
  } else {
    //? Нужно создать пользователя
    //* создаю хеш для шифрования пароля
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password 
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt) //! hasSync позволяет создавать хеш нужного пароля
    })

    try {
      await user.save()
      res.status(201).json(user)
    } catch (e) {
      //! Error Обработать ошибку
      errorHandler(res, e)

    }
  }

  // const user = new User({
  //   email: req.body.email,
  //   password: req.body.password
  // })
  // user.save().then(() => console.log('User created...'))
}