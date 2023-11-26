//AMPLink Configurator Route Handler
//Made by sam

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing configurator route...")


const fs = require('fs')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
const path = require('path');
const { jsonrepair } = require('jsonrepair');

const utilitySystem = require("../functions/utilitySystem.js");
const pluginSystem = require('../functions/plugins/pluginSystem.js');
const settingSystem = require("../functions/settings/settingSystem.js");
const userSystem = require("../functions/userSystem.js");

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
  SERVER CONFIGURATION EDITOR
  ============================*/

  app.get('/configurator', async (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
      if (await userSystem.isSuperuser(userId) == true){
        (async () => {
          var dataset = await settingSystem.getTorchSettings();
          res.render('configurator.hbs', {result2: dataset});
        })();
      } else {
        res.render('error.hbs', {/*message: results[0].username,*/ errormsg: 'Only superusers are allowed to access this page. Please contact your Administator if you beleve this is an error.'});
      }
    });

    
    app.get('/configurator/installedplugins', async (req, res) => {
      if (!req.session.userId) {
        res.render('login.hbs');
        return;
      }
      const userId = req.session.userId;
  
      if (await userSystem.isSuperuser(userId) == true) {
        (async () => {
          var string = JSON.parse(await pluginSystem.getAllPlugins());
        //var output = jp.query(string, '$..')
        res.render('installedplugins.hbs', {result: string});
        })();

        } else {
          res.render('error.hbs', {/*message: results[0].username, */errormsg: 'Only superusers are allowed to access this page. Please contact your Administator if you beleve this is an error.'});
        }
    });

app.get('/configurator/plugins', async (req, res) => {
    if (!req.session.userId) {
      res.render('login.hbs');
      return;
    }
  
    const userId = req.session.userId;
  
    if (await userSystem.isSuperuser(userId) == true){
        //Result
        res.render('plugins.hbs');
          } else {
            res.send('You do not have permission to access this page.');
          }
    });


    app.get('/configurator/plugins/list', async (req, res) => {
      if (!req.session.userId) {
        res.render('login.hbs');
        return;
      }
    
      const userId = req.session.userId;
      
      console.log(userSystem.isSuperuser(userId))
      if (await userSystem.isSuperuser(userId) == true){
          //Result
          var plugins = JSON.parse(await pluginSystem.getPluginsDownloadsAll());
          var output = jp.query(plugins, '$.*')
          var shortDescriptions = jp.query(plugins, '$..description').map(function(description) {
            if (description) {
              return description.substring(0, 100);
            }
            return null;
          });
          //console.log(shortDescriptions);
          res.render('pluginslist.hbs', {shortdesc: 'shortDescriptions', result: output});
            } else {
              res.send('You do not have permission to access this page.');
            }
          });

      app.post('/configurator/plugin/info/:guid', async (req, res) => {
        if (!req.session.userId) {
          res.render('login.hbs');
          return;
        }
        
        const userId = req.session.userId;
        var guid = req.params.guid;
        // Check if the user is a superuser
        if (await userSystem.isSuperuser(userId) == true){
            //Result
            (async () => {
              var plugins = JSON.parse(await pluginSystem.getPluginsDownloadsAll());
              var pluginName = jp.query(plugins, `$[?(@.guid=="${guid}")].name`)
              var author = jp.query(plugins, `$[?(@.guid=="${guid}")].author`)
              var downloads = jp.query(plugins, `$[?(@.guid=="${guid}")].downloads`)
              var description = jp.query(plugins, `$[?(@.guid=="${guid}")].description`)
              var latestVersion = jp.query(plugins, `$[?(@.guid=="${guid}")].latestVersion`)
              var pluginGuid = jp.query(plugins, `$[?(@.guid=="${guid}")].guid`)
              var icon = jp.query(plugins, `$[?(@.guid=="${guid}")].icon`)
            
            res.render('pluginsinfo.hbs', {pluginName: pluginName, author: author, downloads: downloads, description: description, latestVersion: latestVersion, pluginGuid: pluginGuid, icon: icon})
            })();
              } else {
                res.send('You do not have permission to access this page.');
              }
      });

      app.get('/configurator/plugins/installed', consoleLimiter, async (req, res) => {
      if (!req.session.userId) {
        res.render('login.hbs');
        return;
      }
    
      const userId = req.session.userId;
    
      if (await userSystem.isSuperuser(userId) == true){
          //Result
          (async () => {
            
            var allPlugins = (await pluginSystem.getAllPlugins())
            var parse = jp.query(JSON.parse(allPlugins), '$..settingId')
            notify.notify(1,parse)
            
            for (let i = 0; i < parse.length; i++) {
              if (parse[i] === null) {
                parse.splice(i, 1)
                i--;
              }
            } 
            //notify.notify(1, parse)
            
            //notify.notify(1,installedPlugins)

            let results = ""; 
            //let getLayout;

            try {
              parse.forEach(async (parse) => {
                var getLayout = (await settingSystem.getTorchSchema(parse))
                //notify.notify(1, getLayout)
                results += getLayout+","
              });
              //let fixArray = "";

              setTimeout(() => {
                var fixArray = results.slice(0, -1);
                var fixArray2 = JSON.parse("["+fixArray+"]")
                var fixArray3 = jp.query(fixArray2, "$.*.name")
                res.json(fixArray2)
                notify.notify(1, fixArray2)
                return fixArray3
              }, 1000);

            } catch(e) {
              notify.notify(3,e)
            }
            
          })();
            } else {
              res.send('You do not have permission to access this page.');
            }
          });

//Posts
app.post('/configurator/plugins/get/:id/post', async (req, res) => {
  if (!req.session.userId) {
    res.render('login.hbs');
    return;
  }

  const userId = req.session.userId;

  if (await userSystem.isSuperuser(userId) == true){
      //Result
      var id = req.params.id; 
      var result = (await settingSystem.getTorchSchema(`${id}`))
      var keys = (await utilitySystem.getRootKeys(result))
      var getLayout = (await settingSystem.getTorchValues(`${id}`, JSON.stringify(keys)))

      
      try {
        fs.writeFileSync(`./temp/plugins.json`, getLayout, (err) => {
          if (err) notify.notify(3, err);
        });
        fs.writeFileSync(`./temp/pluginName.tmp`, id, (err) => {
          if (err) notify.notify(3, err);
        });
      } catch(e) {
        res.send(e);
        notify.notify(3,e.message)
      }
      
      
      } else {
        res.send('You do not have permission to access this page.');
      }
});

app.get('/configurator/plugins/get/display', consoleLimiter, async (req, res) => {
  if (!req.session.userId) {
    res.render('login.hbs');
    return;
  }

  const userId = req.session.userId;

  if (await userSystem.isSuperuser(userId) == true){
      fs.readFile('./temp/plugins.json', 'utf-8', (err, data) => {
      if (err) {notify.notify(3,err);}
      res.send(data)
      })
    } else {
        res.send('You do not have permission to access this page.');
    }
});

app.post('/configurator/plugins/get/submit', async (req, res) => {
  if (!req.session.userId) {
    res.render('login.hbs');
    return;
  }

  const userId = req.session.userId;

  if (await userSystem.isSuperuser(userId) == true){
      //Result
      const { torchConfig } = req.body; //First grab the data from client.
      var torchParse = jsonrepair(torchConfig); //Repair json for any errors

      const data = fs.readFileSync('./temp/pluginName.tmp', 'utf8',);

      

      var result = (await settingSystem.patchTorchValues(data, torchParse))
      notify.notify(1,`Sending settings at ${data} with contents:\n${torchParse}\nWith status code of ${result}`)
      res.render("success.hbs", {data: data, torchParse: torchParse, result: result})
      } else {
        res.send('You do not have permission to access this page.');
      }
    });


  
  app.post('/uploadplugin', async (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.render('login.hbs');
    }

    if (await userSystem.isSuperuser(userId) == true){
      return res.status(403).send('Forbidden');
    }

    // Check if the request has a formFile field
    if (!req.files || !req.files.formFile) {
      return res.status(400).send('Missing file data');
    }
    // Extract the file from the request
    const file = req.files.formFile;
    
    // Save the file to disk
    //var fileName = `${Date.now()}.zip"`
    file.mv('./temp/storedPlugin.zip', async (error) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Failed to save file');
      }
      
      var result = await pluginSystem.putPlugin('./temp/storedPlugin.zip'); 
      res.render('configurator.hbs', {output: result});
      });
    });

  

  app.post('/installplugin/:id', async (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.render('login.hbs');
    }
  
      if (await userSystem.isSuperuser(userId) == true){
        return res.status(403).send('Forbidden');
      }
      const id = req.params.id; 
      var result = await pluginSystem.postPluginsDownload(id); 
      notify.notify(1,result.body)
      if (result.statusCode !== 200) {
        //var result = await pluginSystem.postPluginsDownload(id); 
        res.send(`<!doctypehtml><meta charset=utf-8><title>AMPLink Control Panel</title><link href=https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css rel=stylesheet crossorigin=anonymous integrity=sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT><link href=style.css rel=stylesheet><main><div class=content><h2>An error occured while trying to upload the plugin.</h2><p>${result.body}<br><form action=/pluginsSearch><input class="btn btn-primary"style=float:left;margin-right:10px type=submit value="Go back"></form></div></main>`);
      } else {
        
        res.send(`<!doctypehtml><meta charset=utf-8><title>AMPLink Control Panel</title><link href=https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css rel=stylesheet crossorigin=anonymous integrity=sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT><link href=style.css rel=stylesheet><main><div class=content><h2>Plugin with ID of ${id} has been installed.</h2><p>Status Code: ${result.statusCode}<br>Restart the server for changes to take place.<br><form action=/pluginsSearch><input class="btn btn-primary"style=float:left;margin-right:10px type=submit value="Go back"></form></div></main>`);
      }
        
      });

    app.post('/deleteplugin/:id', async (req, res) => {
      // Check if user is logged in
      if (!req.session.userId) {
        return res.render('login.hbs');
      }
    
        if (await userSystem.isSuperuser(userId) == true){
          return res.status(403).send('Forbidden');
        }
        const { delID } = req.body;
        const id = req.params.id; 
        if (delID == undefined) {
          res.render('configurator.hbs', {output: 'Error: Undefined'});
        } else {
          notify.notify(1,delID)
          var result = await pluginSystem.deletePlugin(id); 
          res.render('configurator.hbs', {output: result});
        }
    });
}