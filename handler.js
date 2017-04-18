'use strict'
const jwt = require('jsonwebtoken')
const { send } = require('micro')
const { promisify } = require('bluebird')
const comparePassword = promisify(require('bcrypt').compare)
const User = require('./UserSchema')
const JWT_SECRET = process.env.JWT_SECRET

function setHeaders (res) {
  res.setHeaders('Access-Control-Allow-Origin', '*')
  res.setHeaders('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT')
  return res.setHeader('Access-Control-Allow-Headers', '*')
}

module.exports = {
  add,
  auth,
  update
}

async function add ({res, body: {username, password}}) {
  if (!username || !password) send(res, 400, 'You must send a username and password')
  // const userExists = await User.findOne({ username: username })
  // console.log(userExists)
  // if (userExists) send(res, 403, { error: `User ${username} already exists` })
  try {
    const user = new User({
      username: username,
      password: password
    })
    await user.save()
    return { message: `User ${username} saved successfully` }
  } catch (err) {
    console.log(err.name)
    if (err.name === 'MongoError') send(res, 400, { error: err.errmsg })
    send(res, 400, {error: err})
  }
}

async function auth ({res, body: {username, password}}) {
  console.log(username)
  try {
    const user = await User.findOne({username: username})
    console.log(await comparePassword(password, password))
    if (await comparePassword(password, user.password)) {
      return {token: jwt.sign(username, JWT_SECRET)}
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
