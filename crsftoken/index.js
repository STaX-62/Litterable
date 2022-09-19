const http = require('http');
var cookieParser = require('cookie-parser')
const express = require('express');
var csrf = require('csurf')

const app = express()


app.use(cookieParser())
app.use(csrf({ cookie: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/crsftoken', function (req, res, next) {
  res.locals.csrftoken = req.csrfToken();
  res.json({ token: req.csrfToken() })
  next();
})

export default {
  path: '/',
  handler: app
}