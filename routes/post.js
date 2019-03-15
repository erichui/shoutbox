const express = require('express')
const router = express.Router()
const Entry = require('../lib/entry')
const validate = require('../lib/middleware/validate')

router.get('/', (req, res, next) => {
  // 缺少是否登陆的验证
  res.render('post', {
    title: 'post'
  })
})

router.post('/',
  validate.required('title'),
  validate.lengthAbove('title', 4),
  (req, res, next) => {
    // 登陆的验证 否则res.locals.user为空 会报错
    const {
      title,
      body
    } = req.body
    const entry = new Entry({
      username: res.locals.user.name,
      title,
      body
    })
    entry.save(err => {
      if(err) return next(err)
      if(req.remoteUser) {
        res.json({ message: 'entry added'})
      } else {
        res.redirect('/')
      }
    })
  }
)

module.exports = router
