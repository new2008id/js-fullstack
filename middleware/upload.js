//! Здесь будет реализована базовая конфигурация загрузки файлов, 
//! будут некоторые проверки, путь куда сохранять все файлы

const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //! нужно проверить, если есть какие-то ошибки, то нужно указать, что они есть. Если нет, то должны выполнить определённый код
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    cb(null, `${date}-${file.originalname}`)
  }
}) //? переменной storage мы будем конфигурировать местоположения файлов

const fileFilter = (req, file, cb) => {
  //! Проверяем, то за файл подгружается
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') { //* если этот файл будет являтся картинкой, будем его пропускать
    cb(null, true) //* фильтр пройден
  } else {
    cb(null, false) //* указываем фильтру, что не пропускаем данное значение
  }
}

const limits = {
  fileSize: 1024 * 1024 * 5
}

module.exports = multer({storage, fileFilter, limits})
