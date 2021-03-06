const express = require('express')
const router = express.Router()
const Entry = require('../lib/entry')
const page = require('../lib/middleware/page')

router.get('/',
  page(Entry.count, 2),
  (req, res, next) => {
    console.log(req.page)
    const {
      from = 0,
      to = -1
    } = req.page || {}
    Entry.getRange(from, to, (err, entries) => {
      if(err) return next(err)
      res.render('entries', {
        title: 'entries',
        entries
      })
    })
  }
)

module.exports = router
