//AMP 

  const WebSocket = require('ws')
  const fs = require('fs')
  require('dotenv').config();

  exports.websocketLogs = async function () {

  async function connect() {
  const token = `${process.env.TORCHREMOTE_TOKEN}`;
  var ws = new WebSocket(`${process.env.TORCHREMOTE_WEBSOCKET}/api/live/logs`, {headers: {Authorization: `Bearer ${token}`}})
  var consoleconf = `${process.env.LOG_CONSOLE}`
  
  ws.on('open', function open() {
    fs.writeFile('logs.txt', '<b style="color:#0099ff;">[AMPLink Websockets Manager]: Connected to server logs. Waiting for messages...</b><br>', (err) => {
      if (err) throw err;
      console.log('Connecting to server logs & clearing data...');
      //connect()
    });
  });
  
  
  
  ws.on('message', function message(wsdata) {
    try {
    var parsed = JSON.parse(wsdata);
    //console.log(parsed)
    
    //JSON.stringify(parsed)
    var msg = parsed.message;
    var time = parsed.time;
    //var level = wsdata.level;
    var logger = parsed.logger;
  
    fs.appendFile("logs.txt", `<b>${time} ${logger}:</b> ${msg}<br>` , (err) => {
      if (consoleconf == true) {
        console.log(`${time} ${logger}: ${msg}`);
      } else if (consoleconf == false) {
        if (err) throw err; 
      }
      });
  } catch (err) {
    console.log(err)
  }
  });
  
  
  ws.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.error('[AMPLink Websockets Manager]: Connection refused. Please check the server is running and the port is correct.');
      fs.writeFile('logs.txt', '<b style="color:#0099ff;">[AMPLink Websockets Manager]: Connection refused. Please check the server is running and the port is correct.</b><br>', (err) => {
        if (err) throw err;
        //console.log('Connecting to server logs & clearing data...');
        //connect()
      });
    } else {
      console.error(err);
    }
  });

    ws.on('close', function close() {
      console.log("[AMPLink Websockets Manager]: Connection to server logs has been lost. Attempting to reconnect...")
      fs.appendFile("logs.txt", `<b style="color:#ff4848;">[AMPLink Websockets Manager]: Connection to server logs has been lost. Attempting to reconnect...<br></b>` , (err) => {
      setTimeout(() => {
        console.log('Reconnecting...');
        connect()
        //ws.terminate(); // terminate the previous instance
        //var ws = new WebSocket(`${process.env.TORCHREMOTE_WEBSOCKET}/api/live/logs`, {headers: {Authorization: `Bearer ${token}`}})
      }, 5000);
  })
});
}
connect()
}