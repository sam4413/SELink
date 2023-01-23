//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postStop = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/server/stop`,
    data: "",
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    }
    
  };
  return new Promise((resolve) => {
  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode == 401) {
      console.log("[E008] Error accessing remote data.")
      resolve(401);
    } else if (response.statusCode == 400) {
      console.log("[E010] The server has already stopped.")
      resolve(400);
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      resolve(response.statusCode);
    }
    resolve(response.statusCode);
  });
});
};
/* // For debugging
var postStop = require(__dirname + '/postStop.js');

(async () => {
  console.log(await postStop.postStop());
})();
*/
