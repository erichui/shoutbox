const express = require('express')
const router = express.Router()
const User = require('../lib/user')

router.get('/', (req, res) => {
  res.render('login', {
    title: 'login'
  })
})

router.post('/', (req, res, next) => {
  const {
    name,
    pass
  } = req.body
  User.authenticate(name, pass, (err, user) => {
    if(err) return next(err)
    // 此处可以用user直接判断 是因为在authenticate中做啦处理，只有找到用户并且米啊吗错误才会返回user
    if(user) {
      req.session.uid = user.id
      res.redirect('/')
    } else {
      // 未找到用户或密码错误
      res.error('sorry,invalid credentials')
      res.redirect('back')
    }
  })
})

module.exports = router
