const express = require('express')
const router = express.Router()
const User = require('../lib/user')

router.get('/', (req, res) => {
  req.session.destroy(err => {
    if(err) throw err
    res.redirect('/')
  })
})

module.exports = router
