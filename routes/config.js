//AMPLink Config Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing config route...")

const fs = require('fs')

const userSystem = require("../functions/userSystem.js");

const RateLimit = require('express-rate-limit');

const loginlimitmsg = fs.readFileSync('./views/loginLimited.hbs', 'utf-8')
const limiter = RateLimit({
    windowMs: 60 * 1000, //Limit length 
    max: process.env.AMP_LOGIN_RATELIMIT, // limit each IP to 5 requests per windowMs
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    message: loginlimitmsg // custom error message
});

const embeddedLimiter = RateLimit({
  windowMs: 60 * 1000, //Limit length 
  max: process.env.AMP_EMBEDDED_RATELIMIT, // limit each IP to x requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  message: `
  <p class="callout-danger col-md-11">Error: You are sending too many requests.</p>
  ` // custom error message
});


//Prevent sql attack
function escapeMiddleware(req, res, next) {
  for (let key in req.body) {
    req.body[key] = sqlEscape(req.body[key]);
  }
  next();
}

  module.exports = function(app){
  
    app.get('/ampcfg', async (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    // Check if the user is a superuser
    if (await userSystem.isSuperuser(userId) == true) {
        //Result
        res.render('ampcfg.hbs')
      } else {
        res.render('error.hbs', {/*message: results[0].username, */errormsg: 'Only superusers are allowed to access this page. Please contact your Administator if you beleve this is an error.'});
      }
    });


}