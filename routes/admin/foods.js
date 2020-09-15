module.exports = function(router) {
  router
    .route('/foods')
    .get((req, res) => {
      res.end('niua')
    })
}
