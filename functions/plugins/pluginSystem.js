//AMPLink Plugins
//Made by sam
const process = require('process');
const chalk = require('chalk');
const { resolve } = require('path');
const getTorchSchema = require('../settings/getTorchSchema.js');
const notify = require('../notify.js')
const pluginSystem = require('./pluginSystem.js');
var jp = require('jsonpath');

const request = require('request');
const fs = require('fs');

require('dotenv').config();

exports.getPluginsDownloadsAll = async function () {

    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/downloads`,
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    return new Promise((resolve) => {
    request.get(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }
  
      if (response.statusCode != 200){
        resolve(response.statusCode);
      } else {
        resolve(body);
      }
    });
  });
  };

exports.postPluginsDownload = async function (string) {
  
    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/downloads/${string}/install`,
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    return new Promise((resolve) => {
    request.post(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }
  
      if (response.statusCode != 200){
        resolve(response);
      } else {
        resolve(response);
      }
    });
  });
  };

  exports.deletePlugin = async function (string) {

    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/${string}`,
      //data: string,
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      }
      
    };
    return new Promise((resolve) => {
    request.delete(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }
      if (response.statusCode == 500){
        resolve(response.statusCode+" Invalid GUID provided. Ensure GUID is valid, or plugin exists on server.")
      }
      if (response.statusCode != 200){
        resolve(response.statusCode);
      } else {
        resolve(response.statusCode+` Plugin with GUID of ${string} has been successfully removed.`)
      }
    });
  });
  };
exports.getAllPlugins = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/`,
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  };
  return new Promise((resolve) => {
  request.get(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode != 200){
      resolve(response.statusCode);
    } else {
      resolve(body);
    }
  });
});
};
exports.getInstalledPlugins = async function () {
    return new Promise(async (resolve) => {
    var allPlugins = (await pluginSystem.getAllPlugins())
    var parse = jp.query(JSON.parse(allPlugins), '$..settingId')
    //notify.notify(1,parse)
    
    for (let i = 0; i < parse.length; i++) {
      if (parse[i] === null) {
        parse.splice(i, 1)
        i--;
      }
    } 
    let results = ""; 

    try {
      parse.forEach(async (parse) => {
        var getLayout = (await getTorchSchema.getTorchSchema(parse))
        results += getLayout+","
      });
      var fixArray3 = "";
      setTimeout(() => {
        var fixArray = results.slice(0, -1);
        var fixArray2 = JSON.parse("["+fixArray+"]")
        var fixArray3 = jp.query(fixArray2, "$.*.name")

        //resolve(fixArray3)
        return fixArray3
      }, 1000);
      
      return fixArray3

    } catch(e) {
      notify.notify(3,e)
    }
    //return fixArray3
        
})
}

exports.putPlugin = async function (string) {
    return new Promise((resolve, reject) => {
  
    //make the request
    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/`,
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      },
      formData: {
        data: fs.readFileSync(string)
      },
      timeout: 5000 
  
    };
  
      request.put(options, function(err, httpResponse, body) {
        if (err) {
          console.error('Error:', err);
          reject(err);
        }
        resolve(body);
      });
    });
}