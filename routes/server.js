//AMPLink Console Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing console route...")

//Modules
const fs = require('fs')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');

const chatSystem = require('../functions/chat/chatSystem.js');
const serverSystem = require('../functions/server/serverSystem.js');

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

/*=============================
           AMP LINK
        SERVER ACTIONS
  ============================*/
  
  
  app.post('/server/invokeCommand', async (req, res) => {
    if (req.session.userId) {
      var command = req.body;

      fs.appendFile('./logs.html', `<span style="color:#00ff99;"><b>00:00:00.0000 Server: </b>Running command: ${JSON.stringify(command.command)}</span><br>`, (err) => { 
        if (err) notify.notify(3, err);
      });
      var status = (await chatSystem.postInvokeCommand(command.command));
      if (status == 503) {
        res.render('console.hbs', {errormsg: 'Error: Server is offline.'});
      } else {
      res.render('console.hbs', {errormsg: 'Sent command request to server.'});
      }
    } else {
      res.redirect('/login');
    }
  });

  app.post('/server/Restart', async (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      var string = 'restart';
      var status = (await chatSystem.postInvokeCommand(string));
      if (status == 503) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server is offline.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent restart request to server.'});
      }
      //res.redirect('/console');
    } else {
      res.redirect('/login');
    }
  });


  app.post('/server/Stop', async (req, res) => {
    if (req.session.userId) {
      var status = (await serverSystem.postStop());
      if (status != 400) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server has already stopped.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent stop request to server.'});
      }
      //res.redirect('/console');
    } else {
      res.redirect('/login');
    }
  });

  app.post('/server/Start', async (req, res) => {
    if (req.session.userId) {
      var status = (await serverSystem.postStart());
      if (status == 400) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server has already started.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent start request to server.'});
      }
    } else {
      res.redirect('/login');
    }
  });

  app.get('/server/status', consoleLimiter, async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')
        var status = await serverSystem.getStatus();
        if (status == 500) {
          res.send(`Server is offline.`);
        } else {
        var parsed = JSON.parse(status)
        //console.log(parsed)
        var serverstatus = JSON.stringify(parsed.status);
        var serverSimSpeed = JSON.stringify(parsed.simSpeed);
        var serverUptime = JSON.stringify(parsed.uptime);
        var serverMemberCount = JSON.stringify(parsed.memberCount);

        res.render('status.hbs', {status: serverstatus, sim: serverSimSpeed, uptime: serverUptime, memberCount: serverMemberCount});
        }
      } catch (e) {
        notify.notify(3, e)
      }
    } else {
      res.redirect('/login');
    }
  });

  /*app.get('/panel/getSettings', (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      //serverSystem.postStop('!restart 1');
      (async () => {
        var string = JSON.parse(await serverSystem.getSettings());
        var output = jp.query(string, '$')
        res.send(output)
      })();
      
    } else {
      res.redirect('/login');
    }
  });*/



}