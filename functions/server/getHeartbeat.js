//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.getHeartbeat = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/server/status`,
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
      //console.log("[E008] Error accessing remote data.")
      resolve(response.statusCode);
    } else if (response.statusCode != 200){
      resolve(response.statusCode);
    }
    resolve(response.statusCode);
  });
});
};
/*// For debugging
var getHeartbeat = require(__dirname + '/getHeartbeat.js');

(async () => {
  console.log(await getHeartbeat.getHeartbeat());
})();*/

