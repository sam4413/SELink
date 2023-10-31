//AMPLink Players Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing players route...")

const fs = require('fs')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');

const playerSystem = require('../functions/players/playerSystem.js');
const chatSystem = require('../functions/chat/chatSystem.js');
const steamSystem = require('../functions/steam/steamSystem.js');

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
      PLAYERS MANAGEMENT
  ============================*/

  app.get('/players', async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')
        
        res.render('chatplayers.hbs');
      } catch (e) {
        notify.notify(3, e)
      } 
    } else {
      res.render('login.hbs');
    }
  });


  app.get('/banned', async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')

        res.render('bannedplayers.hbs');
        } catch (e) {
        notify.notify(3, e)
      }
    } else {
      res.render('login.hbs');
    }
  });
  app.get('/players/banned', consoleLimiter, async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')
        var players = await playerSystem.getAllBannedPlayers();
        if (process.env.UGC_SERVICE_TYPE == 'eos') {
          
          if (players == 500) {
            res.send(`<h3>Server is offline. Please start it in order to get live player stats.</h3>`);
          } else {
            var parsed2 = JSONbig.parse(players)
            //console.log(parsed)
            var values = jp.query(parsed2, '$.*')
            
            let platform = `{"platformType":[`;

            for (let i = 0; i < values.length; i++) {
              const value = BigInt(values[i]);

              if (value < BigInt('10')) {
                platform += `"Unknown",`
              } else if (value < BigInt('9000000000000000')) {
                platform += `"XBOX",`
              } else if (value < BigInt('79999999999999999')) {
                platform += `"Steam",`;
              } else {
                platform += `"PlayStation",`;
              }
            }
            platform = platform.slice(0, -1);
            platform = platform+"]}";
            platform = JSON.parse(platform)
            var result = jp.query(platform, '$.*')
            //result = jp.query(result, '$.*.*');

          }
          //const playernames = "Cannot be determined with current configuration."
          res.render('banned.hbs', {play: playersList, eosnames: values, names: undefined, platforms: result});

        } else if (process.env.UGC_SERVICE_TYPE == "steam") {
          var platform = "Steam";
          var players = await playerSystem.getAllBannedPlayers();
          var playernames = await steamSystem.getSteamPlayerSummaries(process.env.STEAM_API_TOKEN, players);
          
          var playernames2 = JSON.parse(playernames)
          var playernames3 = jp.query(playernames2, '$.response.players.*')
          if (players == 500) {
            res.send(`<h3>Server is offline. Please start it in order to get live player stats.</h3>`);
          } else {
          var parsed2 = JSONbig.parse(players)
          //console.log(parsed)
          var playersList = jp.query(parsed2, '$.*')
          //console.log(playernames3)
          res.render('banned.hbs', {play: playersList, names: playernames3, platforms: platform});
        }
        
        }
      } catch (e) {
        notify.notify(3, e)
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.get('/players/list', consoleLimiter, async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')
        var players = await playerSystem.getAllPlayers();
        if (players == 500) {
          res.send(`<h3>Server is offline. Please start it in order to get live player stats.</h3>`);
        } else {
        var parsed = JSONbig.parse(players)
        //console.log(parsed)
        var playersList = jp.query(parsed, '$.*')

      
        res.render('players.hbs', {play: playersList});
        }
      } catch (e) {
        notify.notify(3, e)
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/players/ban/:id', async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')
      var id = req.params.id;
        await playerSystem.postBanPlayer(id);
        notify.notify(1, `Player with steam ID of ${id} has been banned.`)
        res.redirect('/players');
      } catch (e) {
        notify.notify(3, e)
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/players/:id/unban', async (req, res) => {
    if (req.session.userId) {
      try {
      //console.log('panel')
      var id = req.params.id;
        await playerSystem.postUnbanPlayer(id);
        notify.notify(1, `Player with steam ID of ${id} has been unbanned.`)
        res.redirect('/banned');
        //res.render('bannedplayers.hbs', {output: `Player with steam ID of ${id} has been unbanned`});
      } catch (e) {
        notify.notify(3, e)
        res.render('bannedplayers.hbs', {output: e});
      }
    } else {
      res.render('login.hbs');
    }
  });

  app.post('/players/kick/:id', async (req, res) => {
    if (req.session.userId) {
      try {
        //console.log('panel')
        var id = req.params.id;
          await playerSystem.postKickPlayer(id);
          notify.notify(1, `Player with steam ID of ${id} has been kicked.`)
          res.redirect('/players');
        } catch (e) {
          notify.notify(3, e)
        }
    } else {
      res.render('login.hbs');
    }
  });

  

  app.post('/players/promote/:id', async (req, res) => {
    if (req.session.userId) {
      try {
        var id = req.params.id;
        await playerSystem.postPromotePlayer(id);
        notify.notify(1, `Player with steam ID of ${id} has been promoted.`)
        res.redirect('/players');
      } catch (e) {
        notify.notify(3, e)
      }
    } else {
      res.render('login.hbs');
    }
  });
  app.post('/players/demote/:id', async (req, res) => {
    if (req.session.userId) {
      try {
        //console.log('panel')
        var id = req.params.id;
          await playerSystem.postDemotePlayer(id);
          notify.notify(1, `Player with steam ID of ${id} has been demoted.`)
          res.redirect('/players');
        } catch (e) {
          notify.notify(3, e)
        }
    } else {
      res.render('login.hbs');
    }
  });
  app.post('/players/disconnect/:id', async (req, res) => {
    if (req.session.userId) {
      try {
        //console.log('panel')
        var id = req.params.id;
          await playerSystem.postDisconnectPlayer(id);
          notify.notify(1, `Player with steam ID of ${id} has been disconnected.`)
          res.redirect('/players');
        } catch (e) {
          notify.notify(3, e)
        }
    } else {
      res.render('login.hbs');
    }
  });
  app.post('/players/manualban', async (req, res) => {
    if (req.session.userId) {
      const { banuser } = req.body;
      try {
        //console.log('panel')
        await playerSystem.postBanPlayer(banuser);
          notify.notify(1, `Player with steam ID of ${banuser} has been banned.`)
          res.render('bannedplayers.hbs', {output: `Player with steam ID of ${banuser} has been banned`});
        } catch (e) {
          notify.notify(3, e)
          res.render('bannedplayers.hbs', {output: e});
        }
    } else {
      res.render('login.hbs');
    }
  });


  app.post('/players/postMessage', async (req, res) => {
    if (req.session.userId) {
      try {
        const { command } = req.body;
        //console.dir("InvokeCommand:", string)

        var checkcase = command.includes('<') || command.includes('</');
        if (checkcase == true) {
          res.render('chatplayers.hbs', {errormsg: 'Error: Forbidden characters. Characters cannot resemble HTML tags.'});
          return;
        } else {
          var status = (await chatSystem.postSendChatMessage(command, `${process.env.CHAT_AUTHOR}`, 1));

          fs.appendFile('./chat.html', `<span style="color:#00ff99;"><b>00:00:00.0000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${process.env.CHAT_AUTHOR} (00000000000000000): </b>${command}</span><br>`, (err) => { 
            if (err) notify.notify(3, err);
          });

          if (status == 503) {
            const data = { errormsg: 'Error: Server is offline.' };
            res.redirect(`/players?message=${data.errormsg}`)
          } else {
            const data = { message: 'Sent message to server.' };
            res.redirect(`/players?message=${data.errormsg}`)
        }
        
        }
        } catch (e) {
          notify.notify(3, e)
        }
    } else {
      res.render('login.hbs');
    }
  });
}