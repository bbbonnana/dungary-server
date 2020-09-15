const AppError = require('./AppError')

class DatabaseError extends AppError {
  constructor(message) {
    if (message instanceof Error) {
      message = message.message
    }
    super('database: ' + message)
  }
}

module.exports = DatabaseError
