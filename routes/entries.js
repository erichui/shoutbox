const express = require('express')
const router = express.Router()
const Entry = require('../lib/entry')

router.get('/', (req, res, next) => {
  Entry.getRange(0, -1, (err, entries) => {
    if(err) return next(err)
    res.render('entries', {
      title: 'entries',
      entries
    })
  })
})

module.exports = router
