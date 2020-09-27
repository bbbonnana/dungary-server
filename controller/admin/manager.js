
const Validator = require('@utils/Validator')
const { sha256 } = require('@utils/utils')
const Manager = require('@models/admin/Manager')
const { ValidatorError } = require('@error/index')
const Id = require('@models/Id')
const { AppError } = require('../../define/error')

const existValidator = new Validator({
  username: [{ required: true, message: 'invalid username' }]
})

const registerValidator = new Validator({
  username: [
    { test: /^\w{6,12}$/, message: '管理员用户名必须为6-12位的字母或数字，且不包含除_以外的特殊符号' },
    { test: /(^_)|(_$)|(__)/, not: true, message: '管理员用户名不能以_开头或结尾，且_不能连用' }
  ],
  password: [
    { test: /^.{6,16}$/, message: '密码必须为6-16位的字符' }
  ]
})

const loginValidator = new Validator({
  username: [{ required: true, message: 'invalid manager username' }],
  password: [{ required: true, message: 'invalid password' }]
})

class ManagerController {
  constructor() {
    this.exist = this.exist.bind(this)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }

  // 是否存在
  async exist(req, res, next) {
    const result = existValidator.validate(req.body)
    if (!result.result) {
      return next(new ValidatorError(result))
    }
    try {
      const manager = await this.doGetManager(req.body.username)
      res.status(200).success({ data: !!manager })
    } catch (err) {
      next(err)
    }
  }

  // 注册服务
  async register(req, res, next) {
    const params = req.body
    const result = registerValidator.validate(params)
    if (!result.result) {
      return next(new ValidatorError(result))
    }
    // 校验通过
    try {
      const user = await this.doRegister(params.username, params.password)
      res.status(200).success({
        message: '注册成功',
        data: user
      })
    } catch (err) {
      if (!(err instanceof AppError)) {
        return next(new AppError(err.message, 'F400'))
      }
      next(err)
    }
  }

  // 登录服务
  async login(req, res, next) {
    const params = req.body
    const result = loginValidator.validate(params)
    if (!result.result) {
      return next(new ValidatorError(result))
    }
    // 校验字段完成
    try {
      const { manager, accessToken, refreshToken } = await this.doLogin(params.username, params.password)
      res.set('Set-Act', accessToken)
      res.set('Set-Rft', refreshToken)
      res.status(200).success({
        message: '登录成功',
        data: manager
      })
    } catch (err) {
      if (!(err instanceof AppError)) {
        return next(new AppError(err.message, 'F400'))
      }
      next(err)
    }
  }

  // 注册操作
  async doRegister(username, password) {
    const existedManager = await Manager.findOne({ username })
    if (existedManager) {
      throw new AppError('该管理员已存在', 'F200')
    }
    const managerId = await Id.generateId('managerId')
    const manager = new Manager({
      username,
      password: sha256(password),
      role: 'general',
      id: managerId
    })
    // 返回注册好的用户信息
    return (await manager.save()).toObject({ hide: '_id password' })
  }

  // 登录操作
  async doLogin(username, password) {
    const manager = await this.doGetManager(username, password)
    if (!manager) {
      throw new AppError('用户名或密码错误', 'F201')
    }
    // 生成RefreshToken和AccessToken并保存至redis
    const { accessToken, refreshToken } = await manager.generateToken()
    return {
      manager: manager.toObject({ hide: '_id password' }),
      accessToken,
      refreshToken
    }
  }

  // 获取管理员
  async doGetManager(username, password) {
    const query = { username }
    if (password) {
      query.password = sha256(password)
    }
    return Manager.findOne(query)
  }

  // 通过id获取管理员
  async doGetManagerById(id) {
    const query = { id }
    return Manager.findOne(query)
  }
}

module.exports = new ManagerController()
