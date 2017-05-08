'use strict'
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const User = require('../UserSchema')
const { send } = require('micro')

// Updates a user's information
// TODO: encrypt password prior to update
module.exports = async ({res, headers: {authorization}, body}) => {
  try {
    const token = authorization.split(' ').pop()
    const decrypted = await jwt.verify(token, JWT_SECRET)
    if (decrypted) {
      const { _doc: { _id } } = decrypted
      const user = await User.findByIdAndUpdate(_id, body)
      return user
    }
    return send(res, 404, {error: 'not verified'})
  } catch (err) {
    return send(res, 404, {error: err})
  }
}
