const mountRoutes = require('../utils/mountRoutes')
const express = require('express')

module.exports = function(target) {
  const router = express.Router()
  mountRoutes(__dirname, router)
  target.use(router)
}
