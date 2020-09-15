const AppResponse = require('./AppResponse')

class SuccessResponse extends AppResponse {
  constructor(info) {
    if (typeof info === 'string') {
      info = { message: info }
    }
    super({
      status: 200,
      ...info
    })
  }
}

module.exports = SuccessResponse
