const SUCCESS_CODES = {
  S_GENERAL: 'S000',
  S_ADD: 'S001',
  S_DELETE: 'S002',
  S_UPDATE: 'S003',
  S_QUERY: 'S004'
}
const FAIL_CODES = {
  F_UNKNOWN: 'F000',
  F_VALIDATE: 'F001',
  F_PERMISSION: 'F002',
  F_DATABASE: 'F003'
}

module.exports = {
  CODES: {
    ...SUCCESS_CODES,
    ...FAIL_CODES
  }
}
