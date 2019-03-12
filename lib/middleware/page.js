module.exports = (fn, perpage = 10) => {
  return (req, res, next) => {
    const pageParams = req.param('page') || 1
    // 1-2-3-4
    const pageNumber = Math.max(parseInt(pageParams, 10), 1)
    fn((err, total) => {
      if(err) return next(err)
      req.page = res.locals.page = {
        number: pageNumber,
        perpage,
        // startNumber 0
        from: (pageNumber - 1) * perpage,
        //fendNumber [n, m] 闭区间
        to: pageNumber * perpage - 1,
        total: total,
        count: Math.ceil(total / perpage)
      }
      next()
    })
  }
}
