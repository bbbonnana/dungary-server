
class AppError extends Error {
  constructor(message, code = 'F000') {
    super(message)
    this.code = code
    // if (status) {
    //   this.status = status
    // }
  }
}

module.exports = AppError
