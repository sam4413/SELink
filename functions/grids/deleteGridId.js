//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();
var JSONbig = require('json-bigint');

exports.deleteGridId = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${string}`,
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  };
  return new Promise((resolve) => {
  request.delete(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode == 401) {
      console.log("[E008] Error accessing remote data.")
      resolve(response.statusCode);
    } else if (response.statusCode == 500){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      //var body = `[]`
      resolve(response.statusCode);
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      console.log(body)
      resolve(response.statusCode);
    }
    resolve(body)
  })
})
}
/*
// For debugging
var deleteGridId = require(__dirname + '/deleteGridId.js');

(async () => {
  console.log(await deleteGridId.deleteGridId('134474719714784363'));
})();
*/