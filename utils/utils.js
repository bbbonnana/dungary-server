const { AES, SHA256, enc } = require('crypto-js')

function sha256(str) {
  return SHA256(str).toString()
}

function encryptAES(payload, secret) {
  return AES.encrypt(JSON.stringify(payload), secret).toString()
}

function decryptAES(token, secret) {
  return JSON.parse(AES.decrypt(token, secret).toString(enc.Utf8))
}

module.exports = {
  sha256,
  encryptAES,
  decryptAES
}
