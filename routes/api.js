const express = require('express')
const router = express.Router()
const basicAuth = require('basic-auth')
const User = require('../lib/user')
const Entry = require('../lib/entry')
const validate = require('../lib/middleware/validate')
const page = require('../lib/middleware/page')


router.get('/', (req, res, next) => {
  console.log('getgetgetget')
  const unauthorized = res => {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
    return res.send(401)
  }
  console.log(req.authorization, 'req.authorization')
  const user = basicAuth(req)

  if (!user || !user.name || !user.pass) {
    return unauthorized(res)
  }

  User.authenticate(user.name, user.pass, (err, _user) => {
    if(err) return unauthorized(res)
    if(_user) return next()
  })
})

router.get('/user/:id', (req, res, next) => {
  console.log('user/:id')
  User.get(req.params.id, (err, user) => {
    if(err) return next(err)
    if(!user.id) return res.send(404)
    res.json(user)
  })
})

router.post('/entry',
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

router.get('/entries/:page?',
  page(Entry.count),
  (req, res, next) => {
    const {
      from = 0,
      to = -1
    } = req.page || {}
    Entry.getRange(from, to, (err, entries) => {
      if(err) return next(err)
      res.json(entries)
    })
  }
)



module.exports = router
