const Manager = require('@models/admin/Manager')
const ManagerController = require('@controller/admin/manager')
const { AppError } = require('@error/index')

class PermissionController {
  constructor() {
    this.checkManager = this.checkManager.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
  }

  async checkManager(req, res, next) {
    const id = req.get('Dg-Identity')
    const accessToken = req.get('Dg-Act')
    if (!id || !accessToken) {
      return next(new AppError('您没有管理员权限', 'F300'))
    }
    /**
     * 验证accessToken正确性，查看redis该用户token
     * 若不存在，说明已过期，让客户端携带refreshToken获取新token；
     * 若存在并相等，验证通过；若存在但不相等，让客户端重新登录（即refreshToken及token均刷新）
     */
    try {
      Manager.decryptAct(id, accessToken)
    } catch (err) {
      // token有误
      return next(new AppError('无效的token', 'F320'))
    }

    try {
      const { status } = await Manager.isActValid(id, accessToken)
      if (status === -1) {
        throw new AppError('token已过期', 'F310')
      } else if (status === 0) {
        // token有效但不是最新
        throw new AppError('', 'F312')
      }
      next()
    } catch (err) {
      if (!(err instanceof AppError)) {
        return next(new AppError(err.message, 'F400'))
      }
      next(err)
    }
  }

  async getAccessToken(req, res, next) {
    const id = req.get('Dg-Identity')
    const refreshToken = req.get('Dg-Rft')
    if (!id || !refreshToken) {
      return next(new AppError('获取失败', 'F300'))
    }
    // 校验refreshToken正确性，根据userid查数据库，检验token是否有效或用户信息是否过期
    let manager = null
    try {
      manager = await ManagerController.doGetManagerById(id)
    } catch (err) {
      next(err)
    }

    if (!manager) {
      // 前端给的id有误
      return next(new AppError('无效用户id', 'F101'))
    }
    try {
      Manager.decryptRft(manager.id, manager.role, manager.password, refreshToken)
    } catch (err) {
      // token有误
      return next(new AppError('无效的token', 'F321'))
    }

    // 验证是否过期
    try {
      const { status, curToken } = await Manager.isRftValid(id, refreshToken)
      if (status === -1) {
        throw new AppError('token已过期', 'F311')
      } else if (status === 0) {
        // token有效但不是最新
        res.set('Set-Rft', curToken)
        // throw new AppError('', 'F313')
      }
      res.set('Set-Act', await manager.genAct())
      res.status(200).success({ data: null })
    } catch (err) {
      if (!(err instanceof AppError)) {
        return next(new AppError(err.message, 'F400'))
      }
      next(err)
    }
  }
}

module.exports = new PermissionController()
