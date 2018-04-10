module.exports = function (req, res, next) {
  let data = res.data
  return res.format({
    'default': function () {
      res.json(data)
    }
  })
}
