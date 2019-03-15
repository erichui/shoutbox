const express = require('express')
const router = express.Router()
const basicAuth = require('basic-auth')
const User = require('../lib/user')


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

router.post('/entry', (req, res, next) => {

})

router.get('/entries/:page?', (req, res, next) => {

})



module.exports = router
