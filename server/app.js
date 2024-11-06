const express = require('express')
const app = express()
const cors = require('cors')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.use(errorHandler)

module.exports = app