//AMPLink Panel Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing configurator route...")

//Modules
var jp = require('jsonpath');

const serverSystem = require('../functions/server/serverSystem.js');

module.exports = function(app){
/*=============================
           AMP LINK
         SERVER PANEL
  ============================*/

  app.get('/panel', async (req, res) => {
    if (req.session.userId) {
      //res.send('Redirecting...');
        var string = JSON.parse(await serverSystem.getSettings());
        var serverName = jp.query(string, '$.serverName')
        var mapName = jp.query(string, '$.mapName')
        var serverDescription = jp.query(string, '$.serverDescription')
        var memberLimit = jp.query(string, '$.memberLimit')
        var ip = jp.query(string, '$.listenEndPoint.ip')
        var port = jp.query(string, '$.listenEndPoint.port')
        //console.log(jp.query(string, '$'))
        res.render('panel.hbs', {sn: serverName, mn: mapName, sd: serverDescription, ml: memberLimit, ipn: ip, pt: port});
      
    } else {
      res.render('login.hbs');
    }
  });
}