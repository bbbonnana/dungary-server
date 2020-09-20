const mongoose = require('mongoose')
const { yellow, green, red } = require('chalk')
const { host, port, dbName } = require('../config/db')

// 连接mongodb
const url = `mongodb://${host}:${port}/${dbName}`
const connectOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

console.log(yellow(`准备连接数据库：${url}`))
mongoose.connect(url, connectOptions)

mongoose.connection.on('error', err => {
  console.log(red('数据库连接失败'))
  console.log(red(err))
})
mongoose.connection.on('open', () => console.log(green('数据库连接成功')))
