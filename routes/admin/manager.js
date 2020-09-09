module.exports = function(router) {
  router
    .route('/manager')
    .get((req, res) => {
      res.send('哈哈哈')
    })
}
