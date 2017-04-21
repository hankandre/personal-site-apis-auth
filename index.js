'use strict'
// Configure dotenv
require('dotenv').config()
const env = process.env.NODE_ENV
const dbUser = process.env.DB_USER
const dbPw = process.env.DB_PW
const mongoose = require('mongoose')
const chalk = require('chalk')
// Setup database environments
const dbUri = env === 'production'
                      ? `mongodb://${dbUser}:${dbPw}@ds161190.mlab.com:61190/blog`
                      : `mongodb://localhost/blog`

// Configure mongoose
mongoose.Promise = global.Promise
mongoose.connect(dbUri)

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.log(chalk.red(`Mongoose connection error: \n\t${chalk.red.bold.underline(err)}`))
})

// Handle successful connection
mongoose.connection.on('connected', () => {
  console.log(chalk.green(`Mongoose connected to: \n\t${chalk.green.bold.underline(dbUri)}`))
})

// Warn on DB disconnect
mongoose.connection.on('disconnected', () => {
  console.log(chalk.yellow(`Mongoose has been disconnected`))
})

// Handle the termination of the app
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(chalk.cyan(`App terminated. Mongoose connection closed.`))
    process.exit(0)
  })
})

module.exports = require('./app')
