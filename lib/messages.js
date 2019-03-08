const express = require('express')
const res = express.response
// express.response 为响应对象的原型，所以所有的中间件和路由都能访问message方法
res.message = function(msg, type = 'info')  {
  const session = this.req.session

  session.messages = session.messages || []
  session.messages.push({
    type,
    string: msg
  })
}

// 将类型为error的消息添加到消息队列session.messages中
res.error = function(msg, resInstance) {
  return this.message(msg, 'error')
}

// 该中间件的作用
// 对于每个请求，通过session.messages生成locals.messages
module.exports = (req, res, next) => {
  res.locals.messages = req.session.messages || []
  res.locals.removeMessages = () => {
    req.session.messages = []
  }
  next()
}
