//AMPLink Users Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing grids route...")

const chatSystem = require('../functions/chat/chatSystem.js');
const gridSystem = require('../functions/grids/gridSystem.js');


//Modules
const RateLimit = require('express-rate-limit');
const fs = require('fs')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');


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
         GRIDS PANEL
  ============================*/
  
  //Grid Listing System
  app.get('/grids/gridlist', consoleLimiter, async (req, res) => {
    if (req.session.userId) {
      try {
        // Your JSON string
        var gridlist = await gridSystem.getAllGrids()
        // Parse the JSON string with JSONbig library
        const jsonData = JSONbig.parse(gridlist);

        // Convert the jsonData to a regular JavaScript object
        const jsonObject = JSON.parse(JSON.stringify(jsonData));

        // Perform JSONPath query to obtain all values with the key "id"
        const alldata = jp.query(jsonObject, '$.*');
        // Output the results
        res.render('gridlist.hbs', {alldata: alldata, success: true});
      } catch(err) {
        notify.notify(3,err.message);
        res.render('gridlist.hbs', {errormsg: err});
      }
      
    } else {
      res.render('login.hbs');
    }
  });

  app.get('/grids', async (req, res) => {
    if (req.session.userId) {
        res.render('grids.hbs');
      
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/delete/:id', async (req, res) => {
    if (req.session.userId) {
      try {
        const id = req.params.id; 
        var delGrid = await gridSystem.deleteGridId(id);
        var resmsg = "SUCCESS: "+delGrid;
        res.render('grids.hbs', {errormsg: resmsg});
      } catch(err) {
        var resmsg = "ERROR: "+err;
        res.render('grids.hbs', {errormsg: resmsg});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/cleanup/blocks', async (req, res) => {
    if (req.session.userId) {
      var status = (await chatSystem.postInvokeCommand(`${process.env.AC_TRASH_REMOVAL_BLOCKS}`));
      if (status == 500) {
        //res.redirect('/console');
        res.render('grids.hbs', {errormsg: 'An error occured while preforming the action (500).'});
      } else {
      //res.redirect('/console');
      res.render('grids.hbs', {errormsg: `Sent cleanup request to server. ${process.env.AC_TRASH_REMOVAL_BLOCKS}`});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/cleanup/voxels/planets', async (req, res) => {
    if (req.session.userId) {
      var status = (await chatSystem.postInvokeCommand(`${process.env.AC_VOXEL_CLEANUP_PLANETS}`));
      if (status == 500) {
        //res.redirect('/console');
        res.render('grids.hbs', {errormsg: 'An error occured while preforming the action (500).'});
      } else {
      //res.redirect('/console');
      res.render('grids.hbs', {errormsg: `Sent cleanup request to server. ${process.env.AC_VOXEL_CLEANUP_PLANETS}`});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/cleanup/voxels', async (req, res) => {
    if (req.session.userId) {
      var status = (await chatSystem.postInvokeCommand(`${process.env.AC_VOXEL_CLEANUP_ALL}`));
      if (status == 500) {
        //res.redirect('/console');
        res.render('grids.hbs', {errormsg: 'An error occured while preforming the action (500).'});
      } else {
      //res.redirect('/console');
      res.render('grids.hbs', {errormsg: `Sent cleanup request to server. ${process.env.AC_VOXEL_CLEANUP_ALL}`});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/cleanup/unowned', async (req, res) => {
    if (req.session.userId) {
      var status = (await chatSystem.postInvokeCommand(`${process.env.AC_CLEANUP_UNOWNED}`));
      if (status == 500) {
        //res.redirect('/console');
        res.render('grids.hbs', {errormsg: 'An error occured while preforming the action (500).'});
      } else {
      //res.redirect('/console');
      res.render('grids.hbs', {errormsg: `Sent cleanup request to server. ${process.env.AC_CLEANUP_UNOWNED}`});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/cleanup/unnamed/:id', async (req, res) => {
    if (req.session.userId) {
      const gridName = req.params.id;
      var status = (await chatSystem.postInvokeCommand(`${AC_CLEANUP_UNNAMED}`+gridName));
      if (status == 500) {
        //res.redirect('/console');
        res.render('grids.hbs', {errormsg: 'An error occured while preforming the action (500).'});
      } else {
      //res.redirect('/console');
      res.render('grids.hbs', {errormsg: `Sent cleanup request to server. ${process.env.AC_CLEANUP_UNNAMED + gridName}`});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/grids/cleanup/floating', async (req, res) => {
    if (req.session.userId) {
      var status = (await chatSystem.postInvokeCommand(`${process.env.AC_FLOATING_CLEANUP}`));
      if (status != 200) {
        //res.redirect('/console');
        res.render('grids.hbs', {errormsg: 'An error occured while preforming the action (500).'});
      } else {
      //res.redirect('/console');
      res.render('grids.hbs', {errormsg: `Sent cleanup request to server. ${process.env.AC_FLOATING_CLEANUP}`});
      }
    } else {
      res.render('login.hbs');
    }
  });
}