const AppManager = require('./utils/AppManager')

AppManager
  .create(9100)
  .then(app => {
    // console.log(app.get('db'))
  })
