'use strict'
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const User = require('../UserSchema')
const { send } = require('micro')

// Updates a user's information
// TODO: This probably shouldn't be a protected route.
module.exports = async ({res, req: {headers: {authentication}}, body}) => {
  try {
    const token = authentication.split(' ')[1]
    await jwt.verify(token, JWT_SECRET)
    const user = await User.findByIdAndUpdate(body._id, body)
    return user
  } catch (err) {
    return send(res, 404, {error: err})
  }
}
