//AMPLink Server Controllers
//Made by sam

  const WebSocket = require('ws')
  const fs = require('fs')
  require('dotenv').config();

  exports.websocketLogs = function () {

  function connect() {
  try {
  const token = `${process.env.TORCHREMOTE_TOKEN}`;
  var ws = new WebSocket(`${process.env.TORCHREMOTE_WEBSOCKET}/api/live/logs`, {headers: {Authorization: `Bearer ${token}`}})
  var consoleconf = `${process.env.WSM_LOGGING}`
  console.log("[AMPLink Websockets Manager]: Connecting to server logs...")
  ws.on('open', function open() {
    try {
    fs.writeFile('logs.html', '<b style="color:#0099ff;">[AMPLink Websockets Manager]: Connected to server logs. Waiting for messages...</b><br>', (err) => {
      if (err) throw err;
      console.log('[AMPLink Websockets Manager]: Established websocket connection with server.');
      //connect()
    });
  } catch(err){
    console.log('[AMPLink Websockets Manager]: ',err);
  }
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
  
    fs.appendFile("logs.html", `<b>${time} ${logger}:</b> ${msg}<br>` , (err) => {
      if (consoleconf == true) {
        console.log(`${time} ${logger}: ${msg}`);
      } else if (consoleconf == false) {
        if (err) throw err; 
      }
      });
  } catch (err) {
    console.log('[AMPLink Websockets Manager]: ',err);
  }
  });
  
  
  ws.on('error', (err) => {
    try {
    if (err.code === 'ECONNREFUSED') {
      console.error('[AMPLink Websockets Manager]: Connection refused. Please check the server is running and the port is correct.');
      ws.terminate();
      fs.writeFile('logs.html', '<b style="color:#0099ff;">[AMPLink Websockets Manager]: Connection refused. Please check the server is running and the port is correct.</b><br>', (err) => {
        if (err) throw err;
        //console.log('Connecting to server logs & clearing data...');
        //connect()
      });
      setTimeout(() => {
        console.log('[AMPLink Websockets Manager]: Reconnecting...');
        connect()
      }, process.env.WSM_RECONNECT_INTERVAL);
    } else {
      console.log('[AMPLink Websockets Manager]: ',err);
    }
  } catch(err) {
    console.log('[AMPLink Websockets Manager]: ',err);
  }
  });

    ws.on('close', function close() {
      try {
      
      console.log("[AMPLink Websockets Manager]: Connection to server logs has been lost. Attempting to reconnect...")
      fs.appendFile("logs.html", `<b style="color:#ff4848;">[AMPLink Websockets Manager]: Connection to server logs has been lost. Attempting to reconnect...<br></b>` , (err) => {
      ws.terminate();
      setTimeout(() => {
        console.log('[AMPLink Websockets Manager]: Reconnecting...');
        connect()
      }, process.env.WSM_RECONNECT_INTERVAL);
  })
} catch(err) {
  console.log('[AMPLink Websockets Manager]: ',err);
}
});

} catch(err) {
  console.log('[AMPLink Websockets Manager]: ',err);
}


}
connect()
}