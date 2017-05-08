'use strict'
const { send } = require('micro')
const JWT_SECRET = process.env.JWT_SECRET
const { promisify } = require('bluebird')
const jwt = require('jsonwebtoken')
const verify = promisify(jwt.verify)
const User = require('../UserSchema')

module.exports = async ({res, headers: {authorization}, body: {username, password}}) => {
  console.log(authorization, username, password)
  try {
    if (!username || !password) return send(res, 400, 'You must send a username and password')
    const token = authorization.split(' ').pop()
    const decrypted = await verify(token, JWT_SECRET)
    if (decrypted) {
      const userExists = await User.findOne({ username: username })
      if (userExists) return send(res, 403, { error: `User ${username} already exists` })
      const user = new User({
        username,
        password
      })
      await user.save()
      return { message: `User ${username} saved successfully` }
    // if the user already exists send a 403
    }
    return send(res, 404, {error: 'not verified'})
  } catch (err) {
    if (err.name === 'MongoError') send(res, 400, { error: err.errmsg })
    return send(res, 400, {error: err})
  }
}
