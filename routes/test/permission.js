const Permission = require('@controller/permission')

module.exports = function(router) {
  router
    .route('/permission')
    .get(Permission.checkManager)

  router
    .route('/permission/act')
    .get(Permission.getAccessToken)
}
