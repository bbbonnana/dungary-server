const crypto = require('crypto')

function md5(str) {
  const suffix = 'DUNGARY_666'
  const md5Obj = crypto.createHash('md5')
  return md5Obj.update(str + suffix).digest('hex')
}

module.exports = {
  md5
}
