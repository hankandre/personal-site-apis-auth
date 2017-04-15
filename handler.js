'use strict'
const jwt = require('jsonwebtoken')
const { send } = require('micro')
const { promisify } = require('bluebird')
const comparePassword = promisify(require('bcrypt').compare)
const User = require('./UserSchema')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  add,
  auth,
  update
}

async function add ({res, body: {username, password}}) {
  if (!username || !password) send(res, 400, 'You must send a username and password')
  try {
    const user = new User({
      username: username,
      password: password
    })
    await user.save()
    return { message: `User ${username} saved successfully` }
  } catch (err) {
    send(res, 400, {error: err})
  }
}

async function auth ({res, body: {username, password}}) {
  try {
    const user = await User.findOne({username: username})
    if (await comparePassword(password, password)) {
      return {token: jwt.sign(user, JWT_SECRET)}
    } else {
      return {error: 'User not found'}
    }
  } catch (err) {
    send(res, 404, {error: err})
  }
}

async function update ({res, req: {headers: {authentication}}, body}) {
  try {
    const token = authentication.split(' ')[1]
    await jwt.verify(token, JWT_SECRET)
    const user = await User.findByIdAndUpdate(body._id, body)
    return user
  } catch (err) {
    send(res, 404, {error: err})
  }
}
