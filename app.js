require('module-alias/register')
require('./global')
require('./db')

const express = require('express')
const AppManager = require('./utils/AppManager')

const app = express()

AppManager
  .thirdParty(app) // 注册第三方中间件
  .registerRoutes(app) // 注册路由
  .errorCatch(app) // 异常捕获
  .launch(app, 9100)
