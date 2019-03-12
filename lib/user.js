const redis = require('redis')
const bcrypt = require('bcrypt')
const db = redis.createClient()

class User {
  constructor(obj) {
    for(const key in obj) {
      this[key] = obj[key]
    }
  }
  static getId(name, fn) {
    db.get(`user:id:${name}`, fn)
  }
  static get(id, fn) {
    db.hgetall(`user:${id}`, (err, user) => {
      if(err) return fn(err)
      fn(null, new User(user)) // 将redis返回的普通对象抓换成User对象
    })
  }
  static getByName(name, fn) {
    this.getId(name, (err, id) => {
      if(err) return fn(err)
      this.get(id, fn)
    })
  }
  static authenticate(name, pass, fn) {
    this.getByName(name, (err, user) => {
      if(err) return fn(err) // 出错
      // 当查找不存在的键时，redis会返回一个空的哈希值，此处不能用!user判断
      if(!user.id) return fn() // 未找到，用户不存在
      if(pass === user.pass) return fn(null, user) // 密码正确
      return fn() // 密码不匹配
    })
  }
  hashPassword(fn) {
    bcrypt.genSalt(12, (err, salt) => {
      if(err) return fn(err)
      this.salt = salt
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if(err) return fn(err)
        this.pass = hash
        fn()
      })
    })
  }
  save(fn) {
    if(this.id) {
      this.update(fn)
    } else {
      // 创建唯一id
      db.incr('user:ids', (err, id) => {
        if(err) return fn(err)
        this.id = id
        this.update(fn)
        // this.hashPassword(err => {
        //   if(err) return fn(err)
        //   this.update(fn)
        // })
      })
    }
  }
  update(fn) {
    // 用name索引用户id
    db.set(`user:id:${this.name}`, this.id, err => {
      if(err) return fn(err)
      // 用哈希表存储数据
      db.hmset(`user:${this.id}`, this, err => {
        fn(err)
      })
    })
  }

}

// const user = new User({
//   name: 'eric',
//   pass: 'im a pass',
//   age: '2'
// })
// user.save(err => {
//   if(err) console.log(err)
//   console.log(`user id ${user.id}`)
// })

module.exports = User
