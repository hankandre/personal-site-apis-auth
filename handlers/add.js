'use strict'
const { send } = require('micro')
const User = require('../UserSchema')

module.exports = async ({res, body: {username, password}}) => {
  if (!username || !password) return send(res, 400, 'You must send a username and password')
  const userExists = await User.findOne({ username: username })
  // if the user already exists send a 403
  if (userExists) return send(res, 403, { error: `User ${username} already exists` })
  try {
    const user = new User({
      username,
      password
    })
    await user.save()
    return { message: `User ${username} saved successfully` }
  } catch (err) {
    if (err.name === 'MongoError') send(res, 400, { error: err.errmsg })
    return send(res, 400, {error: err})
  }
}
