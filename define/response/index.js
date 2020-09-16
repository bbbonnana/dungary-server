const { AppError } = require('../error/index')

const defaultStatusMap = {
  F000: 500,
  F100: 400,
  F200: 400,
  F300: 401,
  F301: 403,
  F400: 500
}

function success(payload) {
  return this.json({
    ...payload,
    success: true
  })
}

function fail(payload) {
  let that = this

  if (payload instanceof Error) {
    let status = 500
    let code = 'F000'
    if (payload instanceof AppError) {
      status = payload.status || defaultStatusMap[payload.code] || 500
      code = payload.code
    }
    payload = {
      message: payload.message,
      code
    }
    that = this.status(status)
  }

  return that.json({
    ...payload,
    success: false
  })
}

module.exports = {
  success,
  fail,
  defaultStatusMap
}
