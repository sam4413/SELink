//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();
var JSONbig = require('json-bigint');

exports.getGroupGridId = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/86768568801471620`,
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
    console.log(JSONbig.parse(body))
  })
})
}

// For debugging
var getGroupGridId = require(__dirname + '/getGroupGridId.js');

(async () => {
  console.log(await getGroupGridId.getGroupGridId());
})();
