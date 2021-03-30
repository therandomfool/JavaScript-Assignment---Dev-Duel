import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import expressValidation from 'express-validation'
import httpStatus from 'http-status'
import bodyParser from 'body-parser'

import APIError from './lib/APIError'
import api from './routes/index'
import config from './config/index'

// Create express server
let app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(cors())

// Middleware for parsing incoming request bodies
// Not necessarily used in the assessment, but included in-case someone attempts post requests for something
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Mount router at /api
app.use('/api', api({ config }))

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
)

// Start listening on env.port
app.server.listen(process.env.port || config.port, () => {
  console.log(`Started on port ${app.server.address().port}`)
})

export default app
