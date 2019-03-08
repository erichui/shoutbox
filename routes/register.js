const express = require('express')
const router = express.Router()
const User = require('../lib/user')

router.get('/', (req, res, next) => {
  res.render('register', {
    title: 'Register'
  })
})
router.post('/', (req, res, next) => {
  const {
    name,
    pass
  } = req.body
  User.getByName(name, (err, user) => {
    if(err) return next(err)
    if(user.id) {
      res.error('username already taken')
      res.redirect('back')
    } else {
      user = new User({
        name,
        pass
      })
      user.save(err => {
        if(err) return next(err)
        req.session.uid = user.id
        res.redirect('/')
      })
    }
  })
})
module.exports = router
