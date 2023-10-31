//AMPLink Utilities
//Made by sam
const process = require('process');
const chalk = require('chalk');
const { resolve } = require('path');
const fs = require('fs');
const notify = require('./notify.js');
const { jsonrepair } = require('jsonrepair');

require('dotenv').config();

exports.truncate = async function (path, size, chars) {

const logFilePath = path;
const maxFileSize = size * size; 
const charactersToRemove = chars;
bytesToRemove = charactersToRemove * 4

fs.stat(logFilePath, (err, stats) => {
  if (err) {
    notify.notify(3,err);
    return;
  }

  const fileSize = stats.size;

  if (fileSize > maxFileSize) {
    const readStream = fs.createReadStream(logFilePath, { highWaterMark: bytesToRemove  });
    let content = '';

    readStream.on('data', (chunk) => {
      content += chunk.toString();
      if (content.length > charactersToRemove) {
        content = content.slice(content.length - charactersToRemove);
      }
    });

    readStream.on('end', () => {
      fs.writeFile(logFilePath, content, (err) => {
        if (err) {
          notify.notify(3,err);
          return;
        }
        //notify.notify(1,"Log at path "+path+" truncated.")
      });
    });
  }
});

}
/*
//For debugging
const truncate = require("./truncate.js")
truncate.truncate('')
*/

exports.getRootKeys = async function (json) {
  return new Promise((resolve) => {
      const jsonObj = JSON.parse(json);
      const rootKeys = Object.keys(jsonObj.schema.properties);
      const RootArray = rootKeys.filter(key => !key.startsWith("_")); 
      //console.log(rootKeys);
      resolve(RootArray)
  });
}
/*
//For debugging
var utilitySystem = require(__dirname + '/utilitySystem.js');
var settingSystem = require(__dirname + '/settings/settingSystem.js');

(async () => {
  const configOption = 'Essentials.EssentialsConfig'; //Replace with user data from Client
  var jsondata = (await settingSystem.getTorchSchema(configOption)); //Get the Schema
  var array = (await utilitySystem.getRootKeys(jsondata)); //Get the root values of the schema to get a tangible output
  array = JSON.stringify(array); //Make it a string in order for it not to break
  console.log(await settingSystem.getTorchValues(configOption, array)); //Get the config data.
})()
*/