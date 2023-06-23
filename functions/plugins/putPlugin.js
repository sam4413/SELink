//AMPLink Server Controllers
//Made by sam


const request = require('request');
const fs = require('fs');
const notify = require('../notify');
require('dotenv').config();

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

};
/*
// For debugging
var putPlugin = require(__dirname + '/putPlugin.js');

(async () => {
  console.log(await putPlugin.putPlugin('./temp/manifest.zip'));
})();

*/