const { readdirSync } = require('fs')
const pathLib = require('path')
const { red, green } = require('chalk')

// 自动挂载路由
module.exports = function(dirPath, target) {
  let i = -1
  const dirents = readdirSync(dirPath, { withFileTypes: true })
  while (++i < dirents.length) {
    let requirePath = ''
    const dirent = dirents[i]

    if (dirent.isDirectory()) {
      requirePath = pathLib.resolve(dirPath, dirent.name, 'index.js')
    } else {
      if (dirent.name === 'index.js') {
        continue
      }
      requirePath = pathLib.resolve(dirPath, dirent.name)
    }

    let mount = null
    try {
      mount = require(requirePath)
    } catch (err) {
      console.log(red(`挂载路由异常：${pathLib.relative('routes', requirePath)}`))
      console.log(red(err))
      continue
    }

    if (typeof mount !== 'function') { continue }

    mount(target)
    console.log(green(`挂载路由成功：${pathLib.relative('routes', requirePath)}`))

  }
}
