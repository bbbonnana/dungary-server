const ManagerController = require('@controller/admin/manager')

module.exports = function(router) {
  router
    .route('/manager')
    .post(ManagerController.register)

  router
    .route('/manager/login')
    .post(ManagerController.login)

  router
    .route('/manager/exist')
    .post(ManagerController.exist)
}
