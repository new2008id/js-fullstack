//! Получение определённой позиции по определённой категории ID (GET)
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async function (req, res) {
  try {
    const positions = await Position.find({
      category: req.params.categoryId, //? указываю на параметры категории id
      user: req.user.id //! получаю текущего пользователя, который получил текущую позицию
    }) //* находим массив определённых данных, есть в БД
    res.status(200).json(positions)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function (req, res) {
  try {
    const position = await new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      user: req.user.id
    }).save()
    res.status(201).json(position)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function (req, res) {
  try {
    await Position.remove({_id: req.params.id}) //! нужно удалить определённую позицию по ID
    res.status(200).json({
      message: 'Позиция была удалена'
    })
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function (req, res) {
  try {
    const position = await Position.findOneAndUpdate(
        {_id: req.params.id}, //? передаём условие, что именно ищем что-то по ID
        {$set: req.body}, //! будем что-то изменять во время данного объекта
        {new: true} //* чтобы вернуть уже обновлённую запись, а не ту которая была до этого
        //? new: true означает в mongoose, что вернёт уже обновлённую запись 
      ) 
    res.status(200).json(position)
    //* находим определённую запись, обновляем её и возвращаем её, как результат работы
  } catch (e) {
    errorHandler(res, e)
  }
}