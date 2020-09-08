const express = require('express')
const mongoose = require('mongoose')
const { db, socket } = require('../config/db')
const { blue, green, red } = require('chalk')

class App {
  constructor() {
    this._ = express()
  }

  getApp() {
    return this._
  }

  connectDB() {
    const url = `mongodb://${socket}/${db}`
    return mongoose.createConnection(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }).then(conn => {
      console.log(green('数据库连接成功'))
      console.log(blue(url))
      this._.set('db', conn)
    }).catch(err => console.error(red('数据库连接失败'), err))
  }

  registerRoutes() {
  }
}

module.exports = {
  async create(port) {
    if (!port) { throw new Error('Wrong App port') }
    const wrapper = new App()
    await wrapper.connectDB()
    const app = wrapper.getApp()
    app.listen(port, () => console.log(green('新的应用已启动，监听端口' + port)))
    return app
  }
}
