
class AppError extends Error {
  constructor(message, code = 'F000', status) {
    super(message)
    this.code = code
    if (status) {
      this.status = status
    }
  }
}

module.exports = AppError
