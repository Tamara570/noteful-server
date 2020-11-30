require('dotenv').config()
const { NODE_ENV } = require('../config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { CLIENT_ORIGIN } = require('../config')
const notesRouter = require('./notes/notes-router')
const foldersRouter = require('./folders/folders-router')
const errorHandler = require('./middleware/error-handler')

const app = express()

const morganOption = (NODE_ENV === 'production') ?
    'tiny' :
    'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)
app.use(express.json())

app.use('/api/folders', foldersRouter)
app.use('/api/notes', notesRouter)

app.use(errorHandler)

module.exports = app
