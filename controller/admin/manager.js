
const Validator = require('@utils/Validator')
const { md5 } = require('@utils/utils')
const Manager = require('@models/admin/Manager')
const { ValidatorError, DatabaseError } = require('@error/index')
const { SuccessResponse } = require('@response/index')
const Id = require('@models/Id')

const registerValidator = new Validator({
  username: [
    { test: /^\w{6,12}$/, message: '用户名必须为6-12位的字母或数字，且不包含除_以外的特殊符号' },
    { test: /(^_)|(_$)|(__)/, not: true, message: '用户名不能以_开头或结尾，且_不能连用' }
  ],
  password: [
    { test: /^.{6,16}$/, message: '密码必须为6-16位的字符' }
  ]
})

class ManagerController {
  constructor() {
    this.registerService = this.registerService.bind(this)
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
        new SuccessResponse({
          codeType: 'S_ADD',
          message: '注册成功',
          data: user
        }).send(res)
      })
      .catch(err => {
        next(new DatabaseError(err))
      })
  }
  // 注册
  async register(params) {
    const userId = await Id.generateId('userId')
    const manager = new Manager({
      username: params.username,
      password: md5(params.password),
      role: 'general',
      userId
    })
    return (await manager.save()).toObject({ hide: '_id password' })
  }
}

module.exports = new ManagerController()
