const AppError = require('./AppError')

class ValidatorError extends AppError {
  constructor(validateResult) {
    if (!validateResult || validateResult.result) {
      throw new Error('Invalid validateResult in ValidatorError')
    }
    const iField = validateResult.invalidFields[0]
    super(validateResult.info[iField].message, 'F100')
  }
}

module.exports = ValidatorError
