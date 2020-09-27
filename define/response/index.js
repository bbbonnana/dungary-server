const { AppError } = require('../error/index')

const defaultStatusMap = {
  F000: 500, // 未知应用错误

  F100: 400, // 数据格式有误
  F101: 200, // 数据值有误

  F200: 400, // 不满足业务逻辑要求（如：已存在该用户）
  F201: 200, // 业务验证不通过（如：某字段错误，或用户名密码错误）

  F300: 200, // 权限校验：缺少验证的字段
  F310: 200, // 权限校验：AccessToken已过期
  F311: 200, // 权限校验：RefreshToken已过期
  F312: 200, // 权限校验：AToken有效但不是最新
  // F313: 200, // 权限校验：RToken有效但不是最新
  F320: 200, // 权限校验：无效AccessToken
  F321: 200, // 权限校验：无效RefreshToken

  F400: 500 // 数据库错误
}

function success(payload) {
  return this.json({
    ...payload,
    success: true
  })
}

function fail(payload) {
  let that = this

  if (payload instanceof Error) {
    let status = 500
    let code = 'F000'
    if (payload instanceof AppError) {
      // status = payload.status || defaultStatusMap[payload.code] || 500
      status = defaultStatusMap[payload.code] || 500
      code = payload.code
    }
    payload = {
      message: payload.message,
      code
    }
    that = this.status(status)
  }

  return that.json({
    ...payload,
    success: false
  })
}

module.exports = {
  success,
  fail,
  defaultStatusMap
}
