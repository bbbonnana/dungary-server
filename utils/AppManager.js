const { green, red } = require('chalk')
const mount = require('../routes/index')
const bodyParser = require('body-parser')
const { AppError } = require('@error/index')
const { success, fail } = require('@response/index')

const proto = {}

// 注册第三方中间件
proto.thirdParty = function(app) {
  app.use(bodyParser.urlencoded({ extended: false }))
  return this
}

// 注册自定义中间件
proto.selfParty = function(app) {
  app.use((req, res, next) => {
    res.success = success.bind(res)
    res.fail = fail.bind(res)
    next()
  })
  return this
}

// 异常捕获
proto.errorCatch = function(app) {
  // 自定义错误
  app.use((err, req, res, next) => {
    // 响应已经发送
    if (res.headersSent) {
      console.log(red(err))
      return
    }
    if (!(err instanceof Error)) {
      next(err)
      return
    }
    res.fail(err)
  })
  // 不是Error类型
  app.use((err, req, res, next) => {
    console.log(red(err))
    res.fail(new AppError(err, 'F000'))
  })
  return this
}

// 注册路由
proto.registerRoutes = function(app) {
  mount(app)
  return this
}

// 启动
proto.launch = function(app, port) {
  if (!port) { throw new Error('Wrong App port') }
  app.listen(port, () => console.log(green('新的应用已启动，监听端口' + port)))
}

const AppManager = Object.create(proto)

module.exports = AppManager
