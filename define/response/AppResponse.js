const { CODES } = require('./const')

class AppResponse {
  constructor(info) {
    let message = ''
    let code = CODES.S_GENERAL
    let status = 200
    let data = null
    let success = true

    if (info) {
      if (info.message) {
        message = String(info.message)
      }
      if (info.codeType) {
        code = CODES[info.codeType] || CODES.S_GENERAL
      }
      if (info.status) {
        status = Number(info.status)
      }
      if (info.data !== undefined) {
        data = info.data
      }
      if (info.success !== undefined) {
        success = !!info.success
      }
    }

    this.message = message
    this.code = code
    this.status = status
    this.data = data
    this.success = success
  }

  info() {
    return {
      message: this.message,
      code: this.code,
      data: this.data,
      success: this.success
    }
  }

  send(res) {
    if (res.headersSent) {
      return
    }
    res
      .status(this.status)
      .json(this.info())
  }
}

module.exports = AppResponse
