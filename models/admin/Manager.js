const mongoose = require('mongoose')

const ManagerSchema = new mongoose.Schema({
  userId: String,
  username: String,
  password: String,
  role: String // 管理员角色
})

if (!ManagerSchema.options.toObject) {
  ManagerSchema.options.toObject = {}
}
const toObjOptions = ManagerSchema.options.toObject
toObjOptions.hide = '_id'
toObjOptions.transform = function(doc, ret, options) {
  if (options.hide) {
    options.hide.split(' ').forEach(prop => delete ret[prop])
  }
  return ret
}

const Manager = mongoose.model(
  'Manager',
  ManagerSchema
)

module.exports = Manager
