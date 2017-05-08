'use strict'
const { send } = require('micro')
const JWT_SECRET = process.env.JWT_SECRET
const { promisify } = require('bluebird')
const jwt = require('jsonwebtoken')
const verify = promisify(jwt.verify)

// Authenticates user and sends JWT or responds with error
module.exports = async ({res, headers: {authorization}}) => {
  try {
    const token = authorization.split(' ').pop()
    const decrypted = await verify(token, JWT_SECRET)
    if (decrypted) return 'verified'
    return send(res, 404, {error: 'not verified'})
  } catch (err) {
    return send(res, 404, {error: err})
  }
}
