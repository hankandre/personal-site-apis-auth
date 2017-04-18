'use strict'
const microApi = require('micro-api')
const handler = require('./handler')
const microCors = require('micro-cors')
const cors = microCors({allowMethods: ['PUT', 'POST']})

const app = cors(microApi([
  {
    method: 'post',
    path: '/auth',
    handler: handler.add
  },
  {
    method: 'put',
    path: '/',
    handler: handler.update
  },
  {
    method: 'post',
    path: '/',
    handler: handler.auth
  }
]))

module.exports = app
