const AppResponse = require('./AppResponse')
// const { AppError } = require('../error/index')

class ErrorResponse extends AppResponse {
  constructor(err) {
    if (!(err instanceof Error)) {
      throw new Error('Invalid err in ErrorResponse')
    }
    let codeType = 'F_UNKNOWN'
    let status = 500
    let message = ''
    switch (err.constructor.name) {
      case 'ValidatorError': {
        codeType = 'F_VALIDATE'
        message = err.message
        break
      }
      default: {
        message = process.env.mode === 'prod' ? '服务器内部错误' : err.message
      }
    }
    super({
      codeType,
      status,
      message,
      success: false
    })
  }
}

module.exports = ErrorResponse
