//AMPLink Console Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing console route...")

const fs = require('fs')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
const path = require('path')

const RateLimit = require('express-rate-limit');

const consoleLimiter = RateLimit({
    windowMs: 60 * 1000, //Limit length 
    max: process.env.AMP_CLIENT_RATELIMIT, // limit each IP to 120 requests. This equates to 2 AMPLink instances per IP.
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    message: `
    <p class="callout-danger col-md-11">Error: You are sending too many requests.</p>
    ` // custom error message
});


module.exports = function(app){

app.get('/console', (req, res) => {
    if (req.session.userId) {
      res.render("console.hbs")
    } else {
      res.render('login.hbs');
    }
  });

  app.get('/console/logs', consoleLimiter, (req, res) => {
    if (req.session.userId) {
      fs.readFile('logs.html', 'utf-8', (err, data) => {
        if (err) {notify.notify(3,err);} 
        //console.log(data)
        res.send(data)
      });
    } else {
      res.send('<p style="color:#ff4848;"><strong>[AMPLink Websockets Manager]: Invalid session. Please log into AMPLink to resume logging.<strong></p>')
    }
  });

  app.get('/console/chat', consoleLimiter, (req, res) => {
    if (req.session.userId) {
      fs.readFile('chat.html', 'utf-8', (err, data) => {
        if (err) {notify.notify(3,err);} 
        //console.log(data)
        res.send(data)
      });
    } else {
      res.send('<p style="color:#ff4848;"><strong>[AMPLink Websockets Manager]: Invalid session. Please log into AMPLink to resume logging.<strong></p>')
    }
  });



}