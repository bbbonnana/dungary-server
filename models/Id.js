const mongoose = require('mongoose')

const IdSchema = new mongoose.Schema({
  idName: String,
  idValue: Number
})

IdSchema.statics.generateId = function(idName) {
  if (!idName) {
    throw new Error('Invalid idName')
  }
  return new Promise((resolve, reject) => {
    this.findOne({ idName }, (err, doc) => {
      if (err) {
        return reject(err)
      }
      let newDoc = null
      if (!doc) {
        newDoc = new this({
          idName,
          idValue: 0
        })
      } else {
        doc.idValue++
        newDoc = doc
      }
      newDoc.save((err, newDoc) => {
        if (err) {
          return reject(err)
        }
        resolve(newDoc.idValue)
      })
    })
  })
}

const Id = mongoose.model('Id', IdSchema)

module.exports = Id
