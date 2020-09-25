const Manager = require('@models/admin/Manager')
const { AppError } = require('@error/index')

class PermissionController {
  constructor() {
    this.checkManager = this.checkManager.bind(this)
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
      Manager.decryptAcToken(id, accessToken)
    } catch (err) {
      // token有误
      return next(new AppError('无效的token', 'F320'))
    }
    const tokenStatus = await Manager.isAcTokenValid(id, accessToken)
    if (tokenStatus === -1) {
      return next(new AppError('token已过期', 'F310'))
    } else if (tokenStatus === 0) {
      // token有效但不是最新
      return next(new AppError('', 'F312'))
    }
    res.status(200).success({
      data: '行行行'
    })
  }
}

module.exports = new PermissionController()
