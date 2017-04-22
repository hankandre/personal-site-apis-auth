'use strict'
const { send } = require('micro')
const User = require('../UserSchema')
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
const { promisify } = require('bluebird')
const comparePassword = promisify(require('bcrypt').compare)

// Authenticates user and sends JWT or responds with error
module.exports = async ({res, body: {token}}) => {
  try {
    const decrypted = jwt.verify(token, 2)
    console.log(decrypted)
  } catch (err) {
    return send(res, 404, {error: err})
  }
}
