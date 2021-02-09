const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

//! localhost:5000/api/order?offset=2&limit=5 GET
module.exports.getAll = async function(req, res) {
  const query = {
    user: req.user.id
  }

  // Дата старта
  if (req.query.start) {
    query.date = {
      $gte: req.query.start //! в mongoose gte обозначает, больше или равно
    }
  }

  // Дата конца
  if (req.query.end) {
    if (!query.date) {
      query.date = {}
    }

    query.date['$lte'] = req.query.end //! в mongoose lte обозначает, меньше или равно
  }

  if (req.query.order) {
    query.order = +req.query.order
  }

  try {

    const orders = await Order //* будет складывать результат работы модели Order
      .find(query)
      .sort({date: -1})
      .skip(+req.query.offset)
      .limit(+req.query.limit)

    res.status(200).json(orders)

  } catch(e) {
    errorHandler(res, e)
  }
  
}

module.exports.create = async function(req, res) {
  try {
    //* вытаскиваю список всех order которые есть
    const lastOrder = await Order
      .findOne({user: req.user.id}) 
      .sort({date: -1}) // сортируем по порядку убывания

    const maxOrder = lastOrder ? lastOrder.order : 0

    const order = await new Order({
      list: req.body.list,
      user: req.user.id, // добавляем спец ID пользователя, который добавил заказ
      order: maxOrder + 1
    }).save()

    res.status(201).json(order)
  } catch(e) {
    errorHandler(res, e)
  }
}