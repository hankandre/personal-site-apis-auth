'use strict'
const microApi = require('micro-api')
const handlers = require('./handlers')
const microCors = require('micro-cors')
const cors = microCors({allowMethods: ['PUT', 'POST']})

module.exports = cors(microApi([
  {
    // Adds a user to the DB
    method: 'post',
    path: '/auth',
    handler: handlers.add
  },
  {
    // Updates a user in the DB
    method: 'put',
    path: '/',
    handler: handlers.update
  },
  {
    // Authenticates a user
    method: 'post',
    path: '/',
    handler: handlers.authenticate
  }
]))
