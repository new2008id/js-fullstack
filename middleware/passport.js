const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/keys')
//! генерируем объект опций, при работе с данной стратегией

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //? fromAuthHeaderAsBearerToken означает, что говорим стратегии Passport.js о том, что буду использовать Header, который находится в токене
  secretOrKey: keys.jwt
}

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select('email id')
  
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (e) {
        console.log(e)
      }
    }) //? В Passport добавляем новую стратегию
  ) //* позволит добавить некоторый плагин
}