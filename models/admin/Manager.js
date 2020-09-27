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

// 编码并生成AccessToken
managerSchema.methods.genAct = async function() {
  const secret = getAcSecret(this.id)
  const accessToken = encryptAES({ id: this.id, role: this.role }, secret)
  const acRedisKey = getAcRedisKey(this.id)
  await redis.set(acRedisKey, accessToken)
  await redis.expire(acRedisKey, 30)
  return accessToken
}

// 编码并生成RefreshToken
managerSchema.methods.genRft = async function() {
  const secret = getRfSecret(this.id, this.role, this.password)
  const refreshToken = encryptAES({ id: this.id, role: this.role }, secret)
  const rfRedisKey = getRfRedisKey(this.id)
  await redis.set(rfRedisKey, refreshToken)
  await redis.expire(rfRedisKey, 300)
  return refreshToken
}

// 编码生成token并存入redis
managerSchema.methods.generateToken = async function() {
  const accessToken = await this.genAct()
  const refreshToken = await this.genRft()
  return { accessToken, refreshToken }
}

// 解码AccessToken
managerSchema.statics.decryptAct = function(id, token) {
  const secret = getAcSecret(id)
  return decryptAES(token, secret)
}

// 获取当前AccessToken
managerSchema.statics.getCurAct = async function(id) {
  const key = getAcRedisKey(id)
  return await redis.get(key)
}

// 校验AccessToken
managerSchema.statics.isActValid = async function(id, token) {
  const curToken = await this.getCurAct(id)
  if (!curToken) {
    // 说明token已过期
    return { status: -1, curToken }
  } else if (curToken !== token) {
    // token有效，但不是最新，要求客户端刷新token
    return { status: 0, curToken }
  }
  return { status: 1, curToken }
}

// 解码RefreshToken
managerSchema.statics.decryptRft = function(id, role, shaPassword, token) {
  const secret = getRfSecret(id, role, shaPassword)
  return decryptAES(token, secret)
}

// 获取当前RefreshToken
managerSchema.statics.getCurRft = async function(id) {
  const key = getRfRedisKey(id)
  return await redis.get(key)
}

// 校验RefreshToken
managerSchema.statics.isRftValid = async function(id, token) {
  const curToken = await this.getCurRft(id)
  if (!curToken) {
    // 说明token已过期
    return { status: -1, curToken }
  } else if (curToken !== token) {
    // token有效，但不是最新
    return { status: 0, curToken }
  }
  return { status: 1, curToken }
}

const Manager = mongoose.model(
  'Manager',
  managerSchema
)

module.exports = Manager
