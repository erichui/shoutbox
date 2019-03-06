const redis = require('redis')
const bcrypt = require('bcrypt')
const db = redis.createClient(6379, '30.208.52.69')

// db.on('error', err => {
//   console.log(err, 'redis error')
// })

class User {
  constructor(obj) {
    for(const key in obj) {
      this[key] = obj[key]
    }
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
  getId(name, fn) {
    db.get(`user:id:${this.name}`, fn)
  }
}

const user = new User({
  name: 'eric',
  pass: 'im a pass',
  age: '2'
})
user.save(err => {
  if(err) console.log(err)
  console.log(`user id ${user.id}`)
})

module.exports = User
