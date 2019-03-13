const express = require('express')
const User = require('../lib/user')

exports.auth = express.basicAuth(User.authenticate)
