const mongoose = require('mongoose')
const redis = require('@db/redis')
const { encryptAES } = require('@utils/utils')

const managerSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  role: String // 管理员角色
})

if (!managerSchema.options.toObject) {
  managerSchema.options.toObject = {}
}
const toObjOptions = managerSchema.options.toObject
toObjOptions.hide = '_id'
toObjOptions.transform = function(doc, ret, options) {
  if (options.hide) {
    options.hide.split(' ').forEach(prop => delete ret[prop])
  }
  return ret
}

managerSchema.methods.encryptAcToken = function() {
  const secret = `DG:ACT:MANAGER:${this.id}`
  return encryptAES({ id: this.id, role: this.role }, secret)
}

managerSchema.methods.encryptRfToken = function() {
  const secret = `DG:RFT:MANAGER:${this.id}_${this.role}_${this.password}`
  return encryptAES({ id: this.id, role: this.role }, secret)
}

managerSchema.methods.generateToken = async function() {
  const accessToken = this.encryptAcToken()
  const refreshToken = this.encryptRfToken()
  await redis.set(`ADMIN:MANAGER:${this.id}:ACTOKEN`, accessToken)
  await redis.expire(`ADMIN:MANAGER:${this.id}:ACTOKEN`, 60)
  await redis.set(`ADMIN:MANAGER:${this.id}:RFTOKEN`, refreshToken)
  await redis.expire(`ADMIN:MANAGER:${this.id}:RFTOKEN`, 300)
  return {
    accessToken,
    refreshToken
  }
}

// managerSchema.statics.decryptAcToken = function(id, token) {
//   const secret = `DG:ACT:MANAGER:${id}`
//   return decryptAES(token, secret)
// }

// managerSchema.statics.decryptRfToken = function(id, token) {
//   const secret = `DG:RFT:MANAGER:${id}`
//   return decryptAES(token, secret)
// }

const Manager = mongoose.model(
  'Manager',
  managerSchema
)

module.exports = Manager
