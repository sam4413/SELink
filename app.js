// AMPLink Main File
// Made by sam

// Welcome to the main file. It is not recommended to edit any values here, 
// unless you know what you are doing. 

// The main file initializes all the pages, as well as all the server-side actions, as well as calling actions from the TorchRemote API.

//Modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs')
var randomstring = require("randomstring");
const fileUpload = require('express-fileupload');
const path = require('path')

require('dotenv').config()
const notify = require("./functions/notify.js");
notify.notify(1,"Initializing Modules...")
const utilitySystem = require("./functions/utilitySystem.js");

const websocketChat = require('./functions/logs/websocketChat.js')
const websocketLogs = require('./functions/logs/websocketLogs.js');

const { del } = require('request');

require("./functions/updater.js")
require('./functions/autoRestartInterval.js')
//updater.update()

notify.notify(1,"Starting AMPLink...")

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD, //leave empty to '' if none
    database: process.env.DATABASE
  });
``
connection.connect((error) => {
  if (error) {
    notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`)
  } else {
    notify.notify(1, "Successfully connected to MySQL Database.")
  }
});

// Set up the Express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //50mb 
app.use(fileUpload());

//Routes Manager
//loop through routes folder
fs.readdir('./routes', (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join('./routes', file);
    fs.readFile(filePath, 'utf8', (err) => {
      try {
        require('./routes/'+file)(app);
      } catch (err) {
        notify.notify(3, "Error loading route: "+file+"! Skipping load! \n"+err.message)
      }
    });
  });
});

//Randomize some letters to make key
var token = randomstring.generate();

if (process.env.USE_AMP_TOKEN == 'true') {
  notify.notify(2,"USE_AMP_TOKEN = true")
  var token = process.env.AMP_SESSION_TOKEN;
} else {

}
//notify.notify(3,token)
app.use(session({
  secret: token,
  resave: false,
  saveUninitialized: false,
}));
//initialize Express.JS
app.use(express.static(__dirname + "/views"));

const directoryPath = "./views";

//loop through views folder
const files = fs.readdirSync(directoryPath);

for (const file of files) {
  const filePath = path.join(directoryPath, file);

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
      notify.notify(1,"Loading static folder: "+filePath)
      app.use(express.static(__dirname + filePath));
  } else {
    /*notify.notify(2,"File "+filePath+" is not in its own folder. Skipping load!")*/
  }
}

//Set view engine
app.set('view engine', 'hbs');


//call websocket console manager to start logging
async function startWebsocketManager() {
  websocketLogs.websocketLogs()
}
//call websocket console manager to start logging
async function startWebsocketChatManager() {
  websocketChat.websocketChat()
}

//run it
app.listen(`${process.env.AMP_PORT}`, ()=> {
    notify.notify(1, `AMPLink started on port ${process.env.AMP_PORT}`)

  //Initialize configuration

    if (process.env.LOG_CONSOLE == 'true') {
      startWebsocketManager()
      startWebsocketChatManager()
    } else {
      notify.notify(1, `[AMPLink]: LOG_CONSOLE = ${process.env.LOG_CONSOLE}`)
    }

    
})

//Initialize the truncating system
try {
  if (process.env.TRUNCATE_LOGS == 'true') {
      setInterval(() => {
        //notify.notify(2,"Truncate")
        utilitySystem.truncate("./logs.html", process.env.TRUNCATE_MAX_SIZE, process.env.TRUNCATE_MAX_SIZE)
        utilitySystem.truncate("./chat.html", process.env.TRUNCATE_MAX_SIZE, process.env.TRUNCATE_MAX_SIZE)
      }, process.env.TRUNCATE_TIME);
  } else {
    return;
  }
} catch(err) {
  notify.notify(3,err)
}