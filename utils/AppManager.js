const mongoose = require('mongoose')
const { db, socket } = require('../config/db')
const { yellow, green, red } = require('chalk')
const mount = require('../routes/index')

const proto = {}

proto.initDB = async function(app) {
  let conn = null
  try {
    const url = `mongodb://${socket}/${db}`
    const connectOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
    conn = await mongoose.createConnection(url, connectOptions)
    console.log(green('数据库连接成功'))
    console.log(yellow(url))
  } catch (err) {
    console.error(red('数据库连接失败'), err)
    return false
  }

  app.set('db', conn)

  return true
}

proto.registerRoutes = function(app) {
  mount(app)
}

proto.launch = function(app, port) {
  if (!port) { throw new Error('Wrong App port') }
  app.listen(port, () => console.log(green('新的应用已启动，监听端口' + port)))
}

const AppManager = Object.create(proto)

module.exports = AppManager
