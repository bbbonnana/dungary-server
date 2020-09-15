const AppError = require('./AppError')

class ValidatorError extends AppError {
  constructor(validateResult) {
    if (!validateResult || validateResult.result) {
      throw new Error('Invalid validateResult in ValidatorError')
    }
    const iField = validateResult.invalidFields[0]
    super('validate: ' + validateResult.info[iField].message)
  }
}

module.exports = ValidatorError
