//AMPLink Main File
//Made by sam

// Welcome to the main file. It is not recommended to edit any values here, 
// unless you know what you are doing. 

//Modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const RateLimit = require('express-rate-limit');
const e = require('express');
const fs = require('fs')
const { jsonrepair } = require('jsonrepair')
const WebSocket = require('ws')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
var sqlEscape = require('sql-escape');

//Config
require('dotenv').config()

//Local Files

//chat
const postInvokeCommand = require('./functions/chat/postInvokeCommand.js')
const postSendChatMessage = require('./functions/chat/postSendChatMessage.js')
//logs 
//const websocketChat = require('./functions/logs/websocketChat.js') Coming soon:tm:
const websocketLogs = require('./functions/logs/websocketLogs.js')
//plugins
const deletePlugin = require('./functions/plugins/deletePlugin.js')
const getAllPlugins = require('./functions/plugins/getAllPlugins.js')
const putPlugin = require('./functions/plugins/putPlugin.js')
  //plugins download
  const getPluginsDownloadsAll = require('./functions/plugins/downloads/getPluginsDownloadsAll.js')
//server

const getHeartbeat = require('./functions/server/getHeartbeat.js');
const getSettings = require('./functions/server/getSettings.js');
const getStatus = require('./functions/server/getStatus.js');
const postSettings = require('./functions/server/postSettings.js');
const postStart = require('./functions/server/postStart.js');
const postStop = require('./functions/server/postStart.js');
const getAllPlayers = require('./functions/players/getAllPlayers.js');
const postBanPlayer = require('./functions/players/postBanPlayer.js');
const postKickPlayer = require('./functions/players/postKickPlayer.js');
const postPromotePlayer = require('./functions/players/postPromotePlayer.js');
const postDemotePlayer = require('./functions/players/postDemotePlayer.js');
const postDisconnectPlayer = require('./functions/players/postDisconnectPlayer.js');
//settings
const getTorchValues = require("./functions/settings/getTorchValues.js")
const patchTorchValues = require("./functions/settings/patchTorchValues.js")

const { randomInt } = require('crypto');
const { json } = require('stream/consumers');

try {


const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD, //leave empty to '' if none
    database: process.env.DATABASE
  });

connection.connect((error) => {
  if (error) {
    console.error('[E001] MySQL connection error:', error);
  } else {
    console.log('[I001] MySQL connected!');
  }
});

// Set up the Express app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//Randomize some letters to make key
var randomLetters = Math.random(30);
//console.log(randomLetters)
app.use(session({
  secret: `41vP*5${randomLetters}`,
  resave: false,
  saveUninitialized: true,
}));

const limiter = RateLimit({
    windowMs: 60 * 1000, //Limit length 
    max: 5, // limit each IP to 5 requests per windowMs
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    message: `<h1 style="font-family: Arial, sans-serif; text-align:center;">Too many login attempts. Please try again in one minute.</h1>` // custom error message
  });

//initialize the css
app.use(express.static(__dirname + '/views'));


//make the functions
function getDB() {
    const query = `SELECT * FROM users`;
    connection.query(query, (error, results) => {
        if (error) {
        console.error('[E004] MySQL query error:', error,'\n\nEnsure that the MySQL Database is running, and you have proper access to the database.');
        //res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error});
        } else {
            var data = JSON.parse(JSON.stringify(results));
            return data
        }
    });
}


//Set view engine
app.set('view engine', 'hbs');


//call websocket manager to start logging
async function startWebsocketManager() {
  websocketLogs.websocketLogs()
}


//Prevent sql attack
function escapeMiddleware(req, res, next) {
  for (let key in req.body) {
    req.body[key] = sqlEscape(req.body[key]);
  }
  next();
}



// Set up the routes



//Homepage
app.get('/', (req, res) => {
  // Check if the user is logged in
  if (req.session.userId) {
    // The user is logged in
    // Get the username of the logged-in user
    const query = `SELECT username FROM users WHERE id = ?`;
    connection.query(query, [req.session.userId], (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
      } else {
        /*setInterval(() => {
          (async () => {
            var res = (await getStatus.getStatus());
            JSON.stringify(res)
            //console.log(res)
            return res
          })();
          
        }, 5000); // Update every 5 seconds*/
        res.render("home.hbs")
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

/*app.get('/legacylogin', escapeMiddleware, (req, res) => {
  // Render the login form
  res.send(`
    <h1>Login to AMPLink</h1>
    <form action="/login" method="post">
      <label for="username">Username:</label><br>
      <input type="text" id="username" name="username"><br>
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password"><br><br>
      <input type="submit" value="Submit">
    </form> 
  `);
});*/

app.get('/login'), (req, res) => {
    res.render("login.hbs")
}


app.post('/login', limiter, escapeMiddleware, (req, res) => {
  
    const { username, password } = req.body;
    // Is user in database?
    const query = `SELECT * FROM users WHERE username = ?`;
    connection.query(query, [username], (error, results) => {
      if (error) {
        console.error('[E002] MySQL query error:', error);
        res.render('error.hbs', {message: 'A 500 server-side error has occured. Check if the database is running correctly, and try again.',error})  
      } else if (results.length === 0) {
        res.render('login.hbs', {message: 'Invalid password. Please try again.'})
      } else {
        // Get the hashed password from the database
        const hashedPassword = results[0].password;
        // Compare password with hashed one using bcrypt
        bcrypt.compare(password, hashedPassword, (error, result) => {
          if (error) {
            console.error('[E007] Bcrypt error:', error);
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

  
app.post('/register', escapeMiddleware, (req, res) => {
    // Ensure passwords match
        const { username, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
        res.render('register.hbs', {message: 'Ensure the passwords match, and try again.'})
        } else {
        
          

        // Check if the username is already taken
        const query = `SELECT * FROM users WHERE username = ?`;
        connection.query(query, [username], (error, results) => {
            if (error) {
            console.error('[E004] MySQL query error:', error);
            res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
            } else if (results.length > 0) {
            res.render('register.hbs', {message: 'Username already taken.'})
            } else {
            // Hash the password using bcrypt
            bcrypt.hash(password, 10, (error, hashedPassword) => {
                if (error) {
                console.error('[E006] Bcrypt error:', error);
                res.render('register.hbs', {message: 'An error has occured. Please try again later.',error})
                } else {
                // Insert the new user into the database
                const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
                connection.query(insertQuery, [username, hashedPassword], (error) => {
                    if (error) {
                    console.error('[E005] MySQL query error:', error);
                    res.render('error.hbs', {message: 'A 500 error has occured. Please try again.',error})
                    } else {
                    // The user was successfully registered
                    res.render('register.hbs', {message: 'User successfully registered. Please login to continue.'})
                    }
                });
                }
            });
            }
        });
        }
    //}
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('[E003] Session destroy error:', error);
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

  app.get('/console', (req, res) => {
    if (req.session.userId) {
      res.render("console.hbs")
    } else {
      res.render('login.hbs');
    }
  });

  app.get('/console/logs', (req, res) => {
    if (req.session.userId) {
      fs.readFile('logs.html', 'utf-8', (err, data) => {
        if (err) throw err;
        //console.log(data)
        res.send(data)
      });
    } else {
      res.send('<p style="color:#ff4848;"><strong>[AMPLink Websockets Manager]: Invalid session. Please log into AMPLink to resume logging.<strong></p>')
    }
  });

  app.get('/about', (req, res) => {
    if (req.session.userId) {
      res.render("about.hbs")
    } else {
      res.render('login.hbs');
    }
  });
/*=============================
           AMP LINK
         USER CONTROL
  ============================*/



app.get('/users', (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
      } else if (results[0].is_superuser === 1) {
        // If the user is a superuser, query the database to get a list of all users.
        const query = `SELECT * FROM users`;
        connection.query(query, (error, results) => {
          if (error) {
            console.error('[E005] MySQL query error:', error);
            res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
          } else {
            //console.log(results)
            res.render('users.hbs', { users: results });
          }
        });
      } else {
        // Deny message
        res.render('error.hbs', {message: results[0].username, errormsg: 'Only superusers are allowed to access this page. Please contact your Administator if this is an error.'});
      }
    });
  });


  app.post('/users/delete/:id', (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    const userToDeleteId = req.params.id;
  
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.send('An error occurred. Please try again later.');
      } else if (results[0].is_superuser === 1) {
        // Delete the user from the database
        const query = `DELETE FROM users WHERE id = ?`;
        connection.query(query, [userToDeleteId], (error, results) => {
          if (error) {
            console.error('[E006] MySQL query error:', error);
            res.send('An error occurred. Please try again later.');
          } else {
            console.log(`[I002] User with ID of ${userToDeleteId} has been sucessfully deleted.`, results)
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
  });



  //PromoteUser

  app.post('/users/promote/:id', (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    const userToDeleteId = req.params.id;
  
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.send('An error occurred. Please try again later.');
      } else if (results[0].is_superuser === 1) {
              const userId = req.params.id;

        // Update the is_superuser column for the user with the given ID
        const query = `UPDATE users SET is_superuser = 1 WHERE id = ?`;
        connection.query(query, [userId], (error, results) => {
          if (error) {
            console.error('[E005] MySQL query error:', error);
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
  });


  //demoteuser


  app.post('/users/demote/:id', (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    const userToDeleteId = req.params.id;
  
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.send('An error occurred. Please try again later.');
      } else if (results[0].is_superuser === 1) {
              const userId = req.params.id;

        // Update the is_superuser column for the user with the given ID
        const query = `UPDATE users SET is_superuser = 0 WHERE id = ?`;
        connection.query(query, [userId], (error, results) => {
          if (error) {
            console.error('[E005] MySQL query error:', error);
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
  });

/*=============================
           AMP LINK
        SERVER ACTIONS
  ============================*/
  
  
  app.post('/invokeCommand', async (req, res) => {
    if (req.session.userId) {
      const { command } = req.body;
      //console.dir("InvokeCommand:", string)
      var status = (await postInvokeCommand.postInvokeCommand(command));
      if (status == 400) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server cannot be accessed.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent command request to server.'});
      }
      res.redirect('/console');
    }
  });

  app.post('/serverRestart', async (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      var string = 'restart';
      var status = (await postInvokeCommand.postInvokeCommand(string));
      if (status == 400) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server cannot be accessed.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent restart request to server.'});
      }
      res.redirect('/console');
    } else {
      res.render('login.hbs');
    }
  });


  app.post('/serverStop', async (req, res) => {
    if (req.session.userId) {
      var status = (await postStop.postStop());
      if (status == 400) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server has already stopped.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent stop request to server.'});
      }
      res.redirect('/console');
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/serverStart', async (req, res) => {
    if (req.session.userId) {
      var status = (await postStart.postStart());
      if (status == 400) {
        //res.redirect('/console');
        res.render('console.hbs', {errormsg: 'Error: Server has already started.'});
      } else {
      //res.redirect('/console');
      res.render('console.hbs', {errormsg: 'Sent start request to server.'});
      }
    } else {
      res.render('login.hbs');
    }
  });


  /*app.get('/panel/getSettings', (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      //postStop.postStop('!restart 1');
      (async () => {
        var string = JSON.parse(await getSettings.getSettings());
        var output = jp.query(string, '$')
        res.send(output)
      })();
      
    } else {
      res.render('login.hbs');
    }
  });*/


/*=============================
           AMP LINK
  SERVER CONFIGURATION EDITOR
  ============================*/


  //Redirect Securely
  app.post('/postConfigurator', (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      //postStop.postStop('!restart 1');

      res.redirect('/configurator');
    } else {
      res.render('login.hbs');
    }
  });

  //Redirect Securely
  app.post('/postInstance', (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      //postStop.postStop('!restart 1');

      res.render('error.hbs', {errormsg:" Feature not added, coming soon."});
    } else {
      res.render('login.hbs');
    }
  });

  //Redirect Securely
  app.post('/postScheduled', (req, res) => {
    if (req.session.userId) {
      //console.dir("InvokeCommand:", string)
      //postStop.postStop('!restart 1');

      res.render('error.hbs', {errormsg:" Feature not added, coming soon."});
    } else {
      res.render('login.hbs');
    }
  });


  app.get('/configurator', (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
      } else if (results[0].is_superuser === 1) {
        (async () => {
          var string = JSON.parse(await getAllPlugins.getAllPlugins());
          var output = jp.query(string, '$..name')
          res.render('configurator.hbs', {result: output});
        })();

          } else {
            res.render('error.hbs', {message: results[0].username, errormsg: 'Only superusers are allowed to access this page. Please contact your Administator if you beleve this is an error.'});
          }
        });
      }
    );
  
//GET ALL PLUGINS
/*
(async () => {
  var plugins = (await getAllPlugins.getAllPlugins());
  res.send(plugins)
})();
              */
//Redirect Securely
app.post('/postConfiguratorSearch', (req, res) => {
  if (req.session.userId) {
    //console.dir("InvokeCommand:", string)
    //postStop.postStop('!restart 1');

    res.redirect('/pluginsSearch');
  } else {
    res.render('login.hbs');
  }
});
app.get('/pluginsSearch', (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], async (error, results) => {
      if (error) {
        console.error('[E004] MySQL query error:', error);
        res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
      } else if (results[0].is_superuser === 1) {
        //Result
        var plugins = JSON.parse(await getPluginsDownloadsAll.getPluginsDownloadsAll());
        var output = jp.query(plugins, '$.*')
        var shortDescriptions = jp.query(plugins, '$..description').map(function(description) {
          if (description) {
            return description.substring(0, 100);
          }
          return null;
        });
        //console.log(shortDescriptions);
        res.render('plugins.hbs', {shortdesc: 'shortDescriptions', result: output});
          } else {
            res.send('You do not have permission to access this page.');
          }
        });
      }
    );

    app.get('/configurator/plugins/torchConfig', (req, res) => {
      if (!req.session.userId) {
        res.render('login.hbs');
        return;
      }
    
      const userId = req.session.userId;
    
      // Check if the user is a superuser
      const query = `SELECT is_superuser FROM users WHERE id = ?`;
      connection.query(query, [userId], async (error, results) => {
        if (error) {
          console.error('[E004] MySQL query error:', error);
          res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
        } else if (results[0].is_superuser === 1) {
          //Result
          (async () => {
            //var getSettings = await getTorchSettings.getTorchSettings('TorchRemote.Plugin.Config');
    
            //var array = `[\r\n    "chatName",\r\n    "chatColor",\r\n    "noGui"\r\n]`
          
            //All Torch Settings
            var array =   `["shouldUpdatePlugins","shouldUpdateTorch","instanceName","instancePath","noUpdate","forceUpdate","autostart",
      "tempAutostart","restartOnCrash","noGui","waitForPID","getTorchUpdates","getPluginUpdates","tickTimeout","plugins","localPlugins","disconnectOnRestart","chatName","chatColor","enableWhitelist","whitelist",
    "windowWidth","windowHeight","fontSize","ugcServiceType","branchName","lastUsedTheme","independentConsole","testPlugin","enableAsserts","sendLogsToKeen","deleteMiniDumps","loginToken"]`
            var outTorch = (await (getTorchValues.getTorchValues('Torch.Server.TorchConfig', array)));
            jparse = JSON.parse(outTorch)
            var parse = jp.query(jparse, '$.*')
            //console.log(parse)
            //var result = JSON.stringify(parse, null, 2);
            res.send(parse)
          })();
            } else {
              res.send('You do not have permission to access this page.');
            }
          });
        }
      );

      app.post('/configurator/plugin/info/:guid', (req, res) => {
        if (!req.session.userId) {
          res.render('login.hbs');
          return;
        }
        
        const userId = req.session.userId;
        var guid = req.params.guid;
        // Check if the user is a superuser
        const query = `SELECT is_superuser FROM users WHERE id = ?`;
        connection.query(query, [userId], async (error, results) => {
          if (error) {
            console.error('[E004] MySQL query error:', error);
            res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
          } else if (results[0].is_superuser === 1) {
            //Result
            (async () => {
              var plugins = JSON.parse(await getPluginsDownloadsAll.getPluginsDownloadsAll());
              var pluginName = jp.query(plugins, `$[?(@.guid=="${guid}")].name`)
              var author = jp.query(plugins, `$[?(@.guid=="${guid}")].author`)
              var downloads = jp.query(plugins, `$[?(@.guid=="${guid}")].downloads`)
              var description = jp.query(plugins, `$[?(@.guid=="${guid}")].description`)
              var latestVersion = jp.query(plugins, `$[?(@.guid=="${guid}")].latestVersion`)
              var pluginGuid = jp.query(plugins, `$[?(@.guid=="${guid}")].guid`)
              var icon = jp.query(plugins, `$[?(@.guid=="${guid}")].icon`)
              res.send(`    
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>AMPLink Control Panel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
</head>
<body class="bg-black text-white">
<h1><br></h1>
<main class="col-md-8 mx-auto text-center">
<div class="alert bg-dark">
<h2 class="text-left">${pluginName}</h2><img alt="logo" align="right" src="${icon}" width="100px" height="100px"><br><br><br>
<div class="card-header">
        <div class="row">
            <div class="col-md-4">
                <h4 class="card-title">Author:
                    ${author}
                </h4>
            </div>
            <!--display latest version of plugin-->
            <div class="col-md-4">
                <h4 class="card-title">Latest Version:
                    ${latestVersion}
                </h4>
            </div>
            <!---display cumulative downloads of plugin-->
            <div class="col-md-4">
                <h4 class="card-title">Cumulative Downloads:
                    ${downloads}
                </h4>
            </div>
        </div>
    </div>
    <div class="card-body" style="color: white;">
        <div class="col-md-12 bg-dark" id="default-desc-display">
          <p>${description}</p>
            </div>
        </div>
    </div>
    <div class="card-footer" style="background-color: #1c1919 !important;">
        <div class="row">
          <div class="col-md-12">
              <p style="color: white;">Plugin Guid: ${pluginGuid}<br><a href="https://torchapi.com/plugins/view/${pluginGuid}">Plugin Page</a></p>
          </div>
    </div>
</div>
<br>
<form action="/pluginsSearch" ><input type="submit" value="Go back" class="btn btn-primary" style="float:left; margin-right: 10px;" ></form>
</div>
</main>
</body>
</html>
            `);
            })();
              } else {
                res.send('You do not have permission to access this page.');
              }
            });
          }
        );

      app.post('/configurator/plugins/torchConfig/submit', (req, res) => {
        if (!req.session.userId) {
          res.render('login.hbs');
          return;
        }
      
        const userId = req.session.userId;
      
        // Check if the user is a superuser
        const query = `SELECT is_superuser FROM users WHERE id = ?`;
        connection.query(query, [userId], async (error, results) => {
          if (error) {
            console.error('[E004] MySQL query error:', error);
            res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
          } else if (results[0].is_superuser === 1) {
            //Result
            var { torchConfig } = req.body;
              console.log(torchConfig)
              //var parse = jp.query(torchConfig, '$.*')
              //console.log(jparse)
              var result = (patchTorchValues.patchTorchValues('Torch.Server.TorchConfig', torchConfig))
              
              //var result = JSON.stringify(parse, null, 2);
              res.render('configurator.hbs', {torchMsg: result})

              } else {
                res.send('You do not have permission to access this page.');
              }
            });
          }
        );

        

/*=============================
           AMP LINK
         SERVER PANEL
  ============================*/

  app.get('/panel', (req, res) => {
    if (req.session.userId) {
      (async () => {
        var string = JSON.parse(await getSettings.getSettings());
        
        var serverName = jp.query(string, '$.serverName')
        var mapName = jp.query(string, '$.mapName')
        var serverDescription = jp.query(string, '$.serverDescription')
        var memberLimit = jp.query(string, '$.memberLimit')
        var ip = jp.query(string, '$.listenEndPoint.ip')
        var port = jp.query(string, '$.listenEndPoint.port')

        //console.log(jp.query(string, '$'))
        res.render('panel.hbs', {sn: serverName, mn: mapName, sd: serverDescription, ml: memberLimit, ipn: ip, pt: port});
      })();
      
    } else {
      res.render('login.hbs');
    }
  });

    app.get('/panel/players', async (req, res) => {
      if (req.session.userId) {
        try {
        //console.log('panel')
          var players = await getAllPlayers.getAllPlayers();
          var parsed = JSONbig.parse(players)
          //console.log(parsed)
          var playersList = jp.query(parsed, '$.*')
  
        
          res.render('players.hbs', {play: playersList});
        } catch (e) {
          console.log(e)
        }
      } else {
        res.render('login.hbs');
      }
    });

    app.post('/panel/players/ban/:id', async (req, res) => {
      if (req.session.userId) {
        try {
        //console.log('panel')
        var id = req.params.id;
          var res = await postBanPlayer.postBanPlayer(id);
          console.log(res)
          res.redirect('/panel')
        } catch (e) {
          console.log(e)
        }
      } else {
        res.render('login.hbs');
      }
    });

    app.post('/panel/players/kick/:id', async (req, res) => {
      if (req.session.userId) {
        try {
          //console.log('panel')
          var id = req.params.id;
            var res = await postKickPlayer.postKickPlayer(id);
            console.log(res)
            res.redirect('/panel')
          } catch (e) {
            console.log(e)
          }
      } else {
        res.render('login.hbs');
      }
    });
    app.post('/panel/players/promote/:id', async (req, res) => {
      if (req.session.userId) {
        try {
          //console.log('panel')
          var id = req.params.id;
            var res = await postPromotePlayer.postPromotePlayer(id);
            console.log(res)
            res.redirect('/panel')
          } catch (e) {
            console.log(e)
          }
      } else {
        res.render('login.hbs');
      }
    });
    app.post('/panel/players/demote/:id', async (req, res) => {
      if (req.session.userId) {
        try {
          //console.log('panel')
          var id = req.params.id;
            var res = await postDemotePlayer.postDemotePlayer(id);
            console.log(res)
            res.redirect('/panel')
          } catch (e) {
            console.log(e)
          }
      } else {
        res.render('login.hbs');
      }
    });
    app.post('/panel/players/disconnect/:id', async (req, res) => {
      if (req.session.userId) {
        try {
          //console.log('panel')
          var id = req.params.id;
            var res = await postDisconnectPlayer.postDisconnectPlayer(id);
            console.log(res)
            res.redirect('/panel')
          } catch (e) {
            console.log(e)
          }
      } else {
        res.render('login.hbs');
      }
    });

/*=============================
           AMP LINK
        PLUGIN MANAGEMENT
  ============================*/


//run it
app.listen(`${process.env.AMP_PORT}`, ()=> {
    console.log("AMPLink started on port 5000")

  //Initialize configuration

    if (process.env.LOG_CONSOLE == 'true') {
      startWebsocketManager()
    } else {
      console.log(`[AMPLink]: LOG_CONSOLE = ${process.env.LOG_CONSOLE}`)
    }
    
})

} catch(err) {
  console.log("[AMPLink]: An error occured: ", err)
}
