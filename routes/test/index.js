const mountRoutes = require('@utils/mountRoutes')
const router = require('express').Router()

mountRoutes(__dirname, router)

module.exports = function(target) {
  target.use('/test', router)
}
