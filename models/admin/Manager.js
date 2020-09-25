const mongoose = require('mongoose')
const redis = require('@db/redis')
const { encryptAES, decryptAES } = require('@utils/utils')

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

function getAcSecret(id) {
  return `DG:ACT:MANAGER:${id}`
}

function getRfSecret(id, role, shaPassword) {
  return `DG:RFT:MANAGER:${id}_${role}_${shaPassword}`
}

function getAcRedisKey(id) {
  return `ADMIN:MANAGER:${id}:ACTOKEN`
}

function getRfRedisKey(id) {
  return `ADMIN:MANAGER:${id}:RFTOKEN`
}

// 编码AccessToken
managerSchema.methods.encryptAcToken = function() {
  const secret = getAcSecret(this.id)
  return encryptAES({ id: this.id, role: this.role }, secret)
}

// 编码RefreshToken
managerSchema.methods.encryptRfToken = function() {
  const secret = getRfSecret(this.id, this.role, this.password)
  return encryptAES({ id: this.id, role: this.role }, secret)
}

// 编码生成token并存入redis
managerSchema.methods.generateToken = async function() {
  const accessToken = this.encryptAcToken()
  const refreshToken = this.encryptRfToken()
  const acRedisKey = getAcRedisKey(this.id)
  const rfRedisKey = getRfRedisKey(this.id)
  await redis.set(acRedisKey, accessToken)
  await redis.expire(acRedisKey, 10)
  await redis.set(rfRedisKey, refreshToken)
  await redis.expire(rfRedisKey, 300)
  return {
    accessToken,
    refreshToken
  }
}

// 解码AccessToken
managerSchema.statics.decryptAcToken = function(id, token) {
  const secret = getAcSecret(id)
  return decryptAES(token, secret)
}

// 解码AccessToken
managerSchema.statics.isAcTokenValid = async function(id, token) {
  const key = getAcRedisKey(id)
  const prevToken = await redis.get(key)
  if (!prevToken) {
    // 说明token已过期
    return -1
  } else if (prevToken !== token) {
    // token有效，但不是最新，要求客户端刷新token
    return 0
  }
  return 1
}

// managerSchema.statics.decryptRfToken = function(id, token) {
//   const secret = `DG:RFT:MANAGER:${id}`
//   return decryptAES(token, secret)
// }

const Manager = mongoose.model(
  'Manager',
  managerSchema
)

module.exports = Manager
