const app = require('./app')
const port = process.env.PORT || 5000

//! req - содержится то, что пользователь отправляет на сервер, то есть это запрос
//! res - то, что будем отвечать соответтсвенно клиенту

app.listen(port, () => console.log(`Server has been started on ${port}`)) // запускаю сервер