//AMPLink File Controller
//Made by sam

const request = require('request');
const { json } = require('stream/consumers');
const fs = require('fs');
require('dotenv').config();

exports.deleteFile = async function (file, path) {

  return new Promise((resolve) => {
  //preform file operation

  //preform a check if the variable exists
  
  if (path !== null) {

  }
  fs.deleteFile(file)
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

/*
// For debugging
var getSteamPlayerSummaries = require(__dirname + '/getSteamPlayerSummaries.js');
(async () => {
  console.log(await getSteamPlayerSummaries.getSteamPlayerSummaries('YOUR_KEY_HERE', "76561198246034874"));
})();*/