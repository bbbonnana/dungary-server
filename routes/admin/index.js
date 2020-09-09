const pathLib = require('path')
const mountRoutes = require(pathLib.resolve(UTILS_PATH, 'mountRoutes'))
const router = require('express').Router()

mountRoutes(__dirname, router)

module.exports = function(target) {
  target.use('/admin', router)
}
