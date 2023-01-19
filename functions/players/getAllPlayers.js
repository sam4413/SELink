//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.getAllPlayers = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/`,
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
    } else if (response.statusCode == 500){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      var body = `[]`
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
    }
    resolve(body);
  });
});
};
/*// For debugging
var getAllPlayers = require(__dirname + '/getAllPlayers.js');

(async () => {
  console.log(await getAllPlayers.getAllPlayers());
})();*/

