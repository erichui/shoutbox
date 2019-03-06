const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.redner('register', {
    title: 'Register'
  })
})
// router.post('/', (req, res, next) => {
//
// })
module.exports = router
