//AMPLink Login Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing login route...")


const chatSystem = require('../functions/chat/chatSystem.js');
const gridSystem = require('../functions/grids/gridSystem.js');

//Modules
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const RateLimit = require('express-rate-limit');
const fs = require('fs')
var sqlEscape = require('sql-escape');


require('dotenv').config();

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
    
// Init db connection
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_ROOT,
  password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
  database: process.env.DATABASE
});

//Homepage
app.get('/', (req, res) => {
  // Check if the user is logged in
  if (req.session.userId) {
    // The user is logged in
    // Get the username of the logged-in user
    const query = `SELECT username FROM users WHERE id = ?`;
    connection.query(query, [req.session.userId], (error, results) => {
      if (error) {
        notify.notify(3, `MySQL query error:', ${error}`)
        res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
      } else {
        res.render("home.hbs", {message: req.session.username})
      }
    });
  } else {
    // The user is not logged in
    res.render("login.hbs")
  }
});




app.get("/register", escapeMiddleware, (req, res) => {
    res.render("register.hbs")
})

app.get('/login'), (req, res) => {
    res.render("login.hbs")
}


app.post('/login', limiter, escapeMiddleware, (req, res) => {
  
    const { username, password } = req.body;
    // Is user in database?
    const query = `SELECT * FROM users WHERE username = ?`;
    connection.query(query, [username], (error, results) => {
      if (error) {
        notify.notify(3, `MySQL query error:', ${error}`)
        res.render('error.hbs', {message: 'A 500 server-side error has occured. Check if the database is running correctly, and try again.',error})  
      } else if (results.length === 0) {
        res.render('login.hbs', {message: 'Invalid password. Please try again.'})
      } else {
        // Get the hashed password from the database
        const hashedPassword = results[0].password;
        // Compare password with hashed one using bcrypt
        bcrypt.compare(password, hashedPassword, (error, result) => {
          if (error) {
            notify.notify(3, `Bycrypt error:', ${error}`)
            res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
          } else if (result) {
            // Save the user ID in the session
            req.session.userId = results[0].id;
            res.render('home.hbs', {message: results[0].username})
          } else {
            res.render('login.hbs', {message: 'Invalid password. Please try again.'})
          }
        });
      }
    });
  });

  
app.post('/register', embeddedLimiter, escapeMiddleware, (req, res) => {
    // Ensure passwords match
    if (req.session.userId) {
        const { username, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
        res.render('register.hbs', {message: 'Ensure the passwords match, and try again.'})
        } else {
        
          

        // Check if the username is already taken
        const query = `SELECT * FROM users WHERE username = ?`;
        connection.query(query, [username], (error, results) => {
            if (error) {
              notify.notify(3, `MySQL query error:', ${error}`)
            res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
            } else if (results.length > 0) {
            res.render('register.hbs', {message: 'Username already taken.'})
            } else {
            // Hash the password using bcrypt
            bcrypt.hash(password, 10, (error, hashedPassword) => {
                if (error) {
                  notify.notify(3, `Bycrypt error:', ${error}`)
                res.render('register.hbs', {message: 'An error has occured. Please try again later.',error})
                } else {
                // Insert the new user into the database
                const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
                connection.query(insertQuery, [username, hashedPassword], (error) => {
                    if (error) {
                    notify.notify(3, `MySQL query error:', ${error}`)
                    res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
                    } else {
                    // The user was successfully registered
                    res.render('register.hbs', {message: 'User successfully registered. You may now login to the user.'})
                    }
                });
                }
            });
            }
        });
        }
      } else {
        res.render('login.hbs');
    }
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      notify.notify(3, `Session error:', ${error}`)
      res.send('An error occurred. Please try again later.');
    } else {
      res.render('login.hbs', {message: 'You have successfully logged out.'});
    }
  });
});


  app.get('/restricted', (req, res) => {
    if (req.session.userId) {
      res.send('This is a restricted page.');
    } else {
      res.render('login.hbs');
    }
  });

  app.get('/login', (req, res) => {
    if (req.session.userId) {
      res.render('home.hbs');
    } else {
      res.render('login.hbs');
    }
  });

  



  }