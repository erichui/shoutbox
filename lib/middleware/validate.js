exports.required = (filed) => {
  return (req, res, next) => {
    if(!req.body[filed]) {
      res.error(`${filed} is required`)
      res.redirect('back')
    } else {
      next()
    }
  }
}

exports.lengthAbove = (filed, len = 1) => {
  return (req, res, next) => {
    if(req.body[filed].length < len) {
      res.error(`${filed} must have more than ${len} characters`)
      res.redirect('back')
    } else {
      console.log('len true')
      next()
    }
  }
}
