const { green, red } = require('chalk')
const mount = require('../routes/index')
const bodyParser = require('body-parser')
const { AppError } = require('@error/index')
const { success, fail } = require('@response/index')

const proto = {}

// 请求源处理
proto.netWork = function(app) {
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*') /* 暂时放开 */
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Dg-Identity, Dg-Act, Dg-Rft')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    // res.header('Access-Control-Allow-Credentials', true) // 可以带cookies
    res.set('Access-Control-Expose-Headers', 'Set-Act, Set-Rft')
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  })
  return this
}

// 注册第三方中间件
proto.mountThirdParty = function(app) {
  app.use(bodyParser.urlencoded({ extended: false }))
  return this
}

// 注册自定义中间件
proto.mountSelfParty = function(app) {
  app.use((req, res, next) => {
    res.success = success.bind(res)
    res.fail = fail.bind(res)
    next()
  })
  return this
}

// 异常捕获
proto.mountErrorCatch = function(app) {
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
