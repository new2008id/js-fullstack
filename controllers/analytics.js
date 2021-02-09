//! здесь будет два метода GET, чтобы выдавать информацию разным страницам

//? Подключаю модель заказов, т.к. буду с ней работать
const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler') //* функция умеет станартно обрабатывать разные ошибки
 
module.exports.overview = async function(req, res) {
  try {
     
    //* получаю список всех заказов, которые есть в системе
    const allOrders = await Order.find({user: req.user.id}).sort({date: 1}) //! sort по возрастанию
    const ordersMap = getOrdersMap(allOrders)
    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [] //! получаю заказы, которые были вчера

    //? Количество заказов вчера
    const yesterdayOrdersNumber = yesterdayOrders.length

    //? Количество заказов
    const totalOrdersNumber = allOrders.length
    //? Количество дней всего
    const daysNumber = Object.keys(ordersMap).length
    //? Всего Заказов в день
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
    // ((заказов Вчера / кол-во заказов в день) - 1) * 100
    //? Процент для количества заказов
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
    //? Общая выручка
    const totalGain = calculatePrice(allOrders)
    //? Выручка в день 
    const gainPerDay = totalGain / daysNumber
    //? Выручка за вчера
    const yesterdayGain = calculatePrice(yesterdayOrders)
    //? Процент выручки
    const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
    //? Сравнение выручки
    const compareGain = (yesterdayGain - gainPerDay).toFixed(2) 
    //? Сравнение количества заказов
    const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0
      }
    })


  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.analytics = async function(req, res) {
  try {
    const allOrders = await Order.find({user: req.user.id}).sort({date: 1}) //* буду сортировать заказы по полю date в порядке возрастания
    const ordersMap = getOrdersMap(allOrders)

    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2) //! получаю средний чек

    const chart = Object.keys(ordersMap).map(label => {
      // label == 05.05.2021
      const gain = calculatePrice(ordersMap[label]) //? посчитана выручка для определённого дня
      const order = ordersMap[label].length // подсчёт количества заказов

      return {label, order, gain}
    })

    res.status(200).json({average, chart})

  } catch (e) {
    errorHandler(res, e)
  }
}

//! должен с группировать по дням все заказы
function getOrdersMap(orders = []) {
  const daysOrders = {}
  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY')

    if (date === moment().format('DD.MM.YYYY')) {
      return 
    }

    if (!daysOrders[date]) {
      daysOrders[date] = []
    }

    daysOrders[date].push(order)
  })
  return daysOrders
}

function calculatePrice(orders = []) {
  //! нужно посчитать общую выручку по всем заказов
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity
    }, 0)
    return total += orderPrice
  }, 0)
}


// {
//   '12.05.2020': [
//     {// order }
//     {// order }
//     {// order }
//     {// order }
//   ]
// }