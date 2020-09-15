const mongoose = require('mongoose')
const { yellow, green, red } = require('chalk')
const { socket, dbName } = require('./config/db')

const url = `mongodb://${socket}/${dbName}`
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
