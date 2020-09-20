const redis = require('redis')
const { yellow, green, red } = require('chalk')
const { host, port } = require('../config/redis-config')
const { promisify } = require('util')

const client = redis.createClient({
  host,
  port
})

client.on('connect', () => {
  console.log(green('redis连接成功'))
})

client.on('end', () => {
  console.log(yellow('redis连接已断开'))
})

client.on('error', err => {
  console.log(red('redis出现异常：') + red(err))
})

client.get = promisify(client.get).bind(client)
client.set = promisify(client.set).bind(client)
client.exists = promisify(client.exists).bind(client)
client.expire = promisify(client.expire).bind(client)

module.exports = client
