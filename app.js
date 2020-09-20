require('module-alias/register')
require('./global')
require('./db/mongodb')

const redisClient = require('./db/redis')
const express = require('express')
const AppManager = require('./utils/AppManager')

const app = express()
app.set('redis', redisClient)

AppManager
  .mountThirdParty(app) // 注册第三方中间件
  .mountSelfParty(app) // 注册自定义中间件
  .registerRoutes(app) // 注册路由
  .mountErrorCatch(app) // 异常捕获
  .launch(app, 9100)
