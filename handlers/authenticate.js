'use strict'
const User = require('../UserSchema')
const { send } = require('micro')
const JWT_SECRET = process.env.JWT_SECRET
const { promisify } = require('bluebird')
const comparePassword = promisify(require('bcrypt').compare)
const jwt = require('jsonwebtoken')

// Authenticates user and sends JWT or responds with error
module.exports = async ({ res, body: { username, password } }) => {
  try {
    const user = await User.findOne({username: username})
    if (await comparePassword(password, user.password)) {
      return {token: jwt.sign(user, JWT_SECRET),
        user: {
          _id: user._id,
          username: user.username
        }}
    } else {
      return send(res, 404, {error: 'User not found'})
    }
  } catch (err) {
    return send(res, 404, {error: err})
  }
}
