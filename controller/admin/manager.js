
const Validator = require('@utils/Validator')
const { sha256 } = require('@utils/utils')
const Manager = require('@models/admin/Manager')
const { ValidatorError } = require('@error/index')
const Id = require('@models/Id')
const { AppError } = require('../../define/error')

const registerValidator = new Validator({
  username: [
    { test: /^\w{6,12}$/, message: '用户名必须为6-12位的字母或数字，且不包含除_以外的特殊符号' },
    { test: /(^_)|(_$)|(__)/, not: true, message: '用户名不能以_开头或结尾，且_不能连用' }
  ],
  password: [
    { test: /^.{6,16}$/, message: '密码必须为6-16位的字符' }
  ]
})

const loginValidator = new Validator({
  username: [{ required: true, message: 'invalid username' }],
  password: [{ required: true, message: 'invalid password' }]
})

class ManagerController {
  constructor() {
    this.registerService = this.registerService.bind(this)
    this.loginService = this.loginService.bind(this)
  }

  // 注册服务
  registerService(req, res, next) {
    const params = req.body
    const result = registerValidator.validate(params)
    if (!result.result) {
      throw new ValidatorError(result)
    }
    this
      .register(params)
      .then(user => {
        res.status(200).success({
          message: '注册成功',
          data: user
        })
      })
      .catch(err => {
        if (!(err instanceof AppError)) {
          err = new AppError(err.message, 'F400')
        }
        next(err)
      })
  }

  // 注册
  async register(params) {
    const { username, password } = params
    const existedManager = await Manager.findOne({ username })
    if (existedManager) {
      throw new AppError('该管理员已存在', 'F200')
    }
    const managerId = await Id.generateId('managerId')
    const manager = new Manager({
      username: username,
      password: sha256(password),
      role: 'general',
      id: managerId
    })
    // 返回注册好的用户信息
    return (await manager.save()).toObject({ hide: '_id password' })
  }

  // 登录服务
  loginService(req, res, next) {
    const params = req.body
    const result = loginValidator.validate(params)
    if (!result.result) {
      throw new ValidatorError(result)
    }
    this
      .login(params, req.app.get('redis'))
      .then(({ manager, accessToken, refreshToken }) => {
        res.set('SET-ACT', accessToken)
        res.set('SET-RFT', refreshToken)
        res.status(200).success({
          message: '登录成功',
          data: manager
        })
      })
      .catch(err => {
        if (!(err instanceof AppError)) {
          err = new AppError(err.message, 'F400')
        }
        next(err)
      })
  }

  // 登录
  async login({ username, password }) {
    const hashPassword = sha256(password)
    const manager = await Manager.findOne({ username, password: hashPassword })
    if (!manager) {
      throw new AppError('用户名或密码错误', 'F301')
    }
    // 生成RefreshToken和AccessToken并保存至redis
    const { accessToken, refreshToken } = await manager.generateToken()
    return {
      manager: manager.toObject({ hide: '_id password' }),
      accessToken,
      refreshToken
    }
  }
}

module.exports = new ManagerController()
