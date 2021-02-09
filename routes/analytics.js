//! данный роут будет отвечать за авторизацию или регистрацию пользователей
const express = require('express')
const passport = require('passport')
const controller = require('../controllers/analytics')
const router = express.Router() // создан локальный Router

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics)

module.exports = router