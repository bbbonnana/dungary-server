const ManagerController = require('@controller/admin/manager')

module.exports = function(router) {
  router
    .route('/manager')
    .post(ManagerController.registerService)
}
