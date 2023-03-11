//AMPLink Server Controllers
//Made by sam

  const WebSocket = require('ws')
  const fs = require('fs')
  const JSONbig = require('json-bigint')
  var moment = require('moment')
  require('dotenv').config();
  // Console formatting
  const notify = require("../notify.js")
  exports.websocketChat = function () {
  
  function connect() {
  try {
  const token = `${process.env.TORCHREMOTE_TOKEN}`;
  var ws = new WebSocket(`${process.env.TORCHREMOTE_WEBSOCKET}/api/live/chat`, {headers: {Authorization: `Bearer ${token}`}})
  var consoleconf = `${process.env.WSM_LOGGING}`
  notify.notify(1, "[AMPLink Websockets Manager]: Connecting to server chat...")
  ws.on('open', function open() {
    try {
    fs.writeFile('chat.html', '<b style="color:#0099ff;">[AMPLink Websockets Manager]: Connected to server chat. Waiting for messages...</b><br>', (err) => {
      if (err) throw err;
      notify.notify(1, '[AMPLink Websockets Manager]: Established websocket connection with server.');
      //connect()
    });
  } catch(err){
    notify.notify(3, '[AMPLink Websockets Manager]: ',err);
  }
});

  
  ws.on('message', function message(wsdata) {
    try {
    var parsed = JSONbig.parse(wsdata);
    var msg = parsed.message;
    var channel = parsed.channel;
    var time = moment.utc(parsed.time);
    var authorname = parsed.authorName;
    var date = moment(time).format('HH:mm:ss.SSSS');
    var logger = JSONbig.stringify(parsed.author);
    //notify.notify(1, wsdata)
    if (channel == 1) {
      fs.appendFile("chat.html", `<b style="color:#ff9100">${date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${authorname} (${logger}):</b> ${msg}<br>` , (err) => {
        if (consoleconf == true) {
          notify.notify(1, `${time} ${logger}: ${msg}`);
        } else if (consoleconf == false) {
          if (err) throw err; 
        }
        });
    } else {
      fs.appendFile("chat.html", `<b>${date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${authorname} (${logger}):</b> ${msg}<br>` , (err) => {
        if (consoleconf == true) {
          notify.notify(1, `${time} ${logger}: ${msg}`);
        } else if (consoleconf == false) {
          if (err) throw err; 
        }
        });
    }
    
    
  } catch (err) {
    notify.notify(3, '[AMPLink Websockets Manager]: ',err);
  }
  });
  
  
  ws.on('error', (err) => {
    try {
    if (err.code === 'ECONNREFUSED') {
      notify.notify(3, '[AMPLink Websockets Manager]: Connection refused. Please check the server is running and the port is correct.');
      ws.terminate();
      fs.writeFile('chat.html', '<b style="color:#0099ff;">[AMPLink Websockets Manager]: Connection refused. Please check the server is running and the port is correct.</b><br>', (err) => {
        if (err) notify.notify(3, '[AMPLink Websockets Manager]: ',err);
        //console.log('Connecting to server logs & clearing data...');
        //connect()
      });
      setTimeout(() => {
        notify.notify(2, '[AMPLink Websockets Manager]: Reconnecting...');
        connect()
      }, process.env.WSM_RECONNECT_INTERVAL);
    } else {
      notify.notify(3, '[AMPLink Websockets Manager]: ',err);
    }
  } catch(err) {
    notify.notify(3, '[AMPLink Websockets Manager]: ',err);
  }
  });

    ws.on('close', function close() {
      try {
      
        notify.notify(2, "[AMPLink Websockets Manager]: Connection to server chat has been lost. Attempting to reconnect...")
      fs.appendFile("chat.html", `<b style="color:#ff4848;">[AMPLink Websockets Manager]: Connection to server chat has been lost. Attempting to reconnect...<br></b>` , (err) => {
      ws.terminate();
      setTimeout(() => {
        notify.notify(1, '[AMPLink Websockets Manager]: Reconnecting...');
        connect()
      }, process.env.WSM_RECONNECT_INTERVAL);
  })
} catch(err) {
  notify.notify(3, '[AMPLink Websockets Manager]: ',err);
}
});

} catch(err) {
  notify.notify(3, '[AMPLink Websockets Manager]: ',err);
}

}
connect()
}
