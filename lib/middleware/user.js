const User = require('../user')

module.exports = (req, res, next) => {
  const id = req.session.uid
  if(!id) return next()
  User.get(id, (err, user) => {
    if(err) return next(err)
    req.user = user
    res.locals.user = user
    next()
  })
}
