//AMPLink Users Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing users route...")

const fs = require('fs')
const mysql = require('mysql');
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
var sqlEscape = require('sql-escape');
const bodyParser = require('body-parser');

const userSystem = require("../functions/userSystem.js");

const RateLimit = require('express-rate-limit');

const embeddedLimiter = RateLimit({
  windowMs: 60 * 1000, //Limit length 
  max: process.env.AMP_EMBEDDED_RATELIMIT, // limit each IP to x requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  message: `
  <p class="callout-danger col-md-11">Error: You are sending too many requests.</p>
  ` // custom error message
});

module.exports = function(app){

// Init db connection
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_ROOT,
  password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
  database: process.env.DATABASE
});

/*=============================
           AMP LINK
         USER CONTROL
============================*/


app.get('/users', embeddedLimiter, bodyParser.json(), async (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
  
    //if (await userSystem.isSuperuser(userId) == true){
        // If the user is a superuser, query the database to get a list of all users.
        // Init db connection
        
        var results = await userSystem.listAll();
            var superuser = req.session.userId;
            if (superuser == 0) {
              superuser = "Regular User";
              
            } else if (superuser >= 1) {
              superuser = "Superuser";
              
            } else if (superuser >= 2) {
              superuser = "Superuser (Elevated)";
              
            } else {
              superuser = "Unknown level";
            }


            res.render('account.hbs', {username: req.session.username, is_superuser: superuser, userId: req.session.userId});
            
          /*} else {
        // Limited page
        res.render('account.hbs', {username: results[0].username, is_superuser: superuser, userId: results[0].id});
      }*/
    });

  app.get('/users/list', embeddedLimiter, bodyParser.json(), async (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
  
    const userId = req.session.userId;
    if (await userSystem.isSuperuser(userId) == true){
        // If the user is a superuser, query the database to get a list of all users.
        var results = await userSystem.listAll();
        //console.log(results)
        res.render('users.hbs', { users: results });

      } else {
        // Limited page
        res.render('error.hbs', {message: req.session.username, errormsg: 'Only superusers are allowed to access this page. Please contact your Administator if you beleve this is an error.'});
      }
    });

  app.post('/users/resetPassword', async (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
  
    const userId = req.session.userId;
    notify.notify(3,userId)
      const { currentPass, newPass, confirmPassword } = req.body;
        if (newPass !== confirmPassword) {
        res.render('account.hbs', {output: 'Ensure the passwords match, and try again.'})
        } else {
          notify.notify(3,newPass)
          const result = await userSystem.resetPassword(1, "12345");
          notify.notify(3,result)
          res.render('account.hbs', {output: 'Your password has successfully been changed. '+JSON.stringify(result)})
        }
  });
  

  app.post('/users/delete/:id', embeddedLimiter, async (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
  
    const userToDeleteId = req.params.id;
  
    const userId = req.session.userId;
    if (await userSystem.isSuperuser(userId) == true){
        // Delete the user from the database
        const query = `DELETE FROM users WHERE id = ?`;
        connection.query(query, [userToDeleteId], (error, results) => {
          if (error) {
            notify.notify(3, `MySQL query error:', ${error}`)
            res.send('An error occurred. Please try again later.');
          } else {
            notify.notify(1, `User with ID of ${userToDeleteId} has been sucessfully deleted. \n${results}`)
            // I am extremely lazy, so Ima just copy and paste html here lol
            res.send(`
            
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>AMPLink Control Panel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
<link href="style.css" rel="stylesheet" type="text/css">
</head>
<body>

<main>

<div class="content">
  <h2>User with ID of ${userToDeleteId} has been deleted.</h2>
  <p><form action="/users" ><input type="submit" value="Go back" class="btn btn-primary" style="float:left; margin-right: 10px;" ></form></p>
</div>

</main>
</body>
</html>
            
            `);
          }
        });
      } else {
        // The user is not a superuser
        res.send('You do not have permission to access this page.');
      }
    });




  //PromoteUser

  app.post('/users/promote/:id', embeddedLimiter, async (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
  
    const userId = req.session.userId;
  
    const userToDeleteId = req.params.id;
  
    if (await userSystem.isSuperuser(userId) == true){
              const userId = req.params.id;

        // Update the is_superuser column for the user with the given ID
        const query = `UPDATE users SET is_superuser = 1 WHERE id = ?`;
        connection.query(query, [userId], (error, results) => {
          if (error) {
            notify.notify(3, `MySQL query error:', ${error}`)
            res.send('An error occurred. Please try again later.');
          } else {
            res.send(`
            
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>AMPLink Control Panel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
<link href="style.css" rel="stylesheet" type="text/css">
</head>
<body>

<main>

<div class="content">
  <h2>User with ID of ${userToDeleteId} has been promoted to a superuser.</h2>
  <p><form action="/users" ><input type="submit" value="Go back" class="btn btn-primary" style="float:left; margin-right: 10px;" ></form></p>
</div>

</main>
</body>
</html>
            
            `);
          }
        });
      } else {
        // The user is not a superuser
        res.send('You do not have permission to access this page.');
      }
    });


  //demoteuser


  app.post('/users/demote/:id', embeddedLimiter, async (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
      return;
    }
  
    const userId = req.session.userId;
  
    const userToDeleteId = req.params.id;
  
    if (await userSystem.isSuperuser(userId) == true){
              const userId = req.params.id;

        // Update the is_superuser column for the user with the given ID
        const query = `UPDATE users SET is_superuser = 0 WHERE id = ?`;
        connection.query(query, [userId], (error, results) => {
          if (error) {
            notify.notify(3, `MySQL query error:', ${error}`)
            res.send('An error occurred. Please try again later.');
          } else {
            res.send(`
            
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>AMPLink Control Panel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
<link href="style.css" rel="stylesheet" type="text/css">
</head>
<body>

<main>

<div class="content">
  <h2>User with ID of ${userToDeleteId} has been demoted to a user.</h2>
  <p><form action="/users" ><input type="submit" value="Go back" class="btn btn-primary" style="float:left; margin-right: 10px;" ></form></p>
</div>

</main>
</body>
</html>
            
            `);
          }
        });
      } else {
        // The user is not a superuser
        res.send('You do not have permission to access this page.');
      }
    });
}