//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.patchTorchValues = async function (string, sendData) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/settings/${string}/select`,
    body: sendData,
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    }
    
  };
  return new Promise((resolve) => {
  request.patch(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode == 401) {
      console.log("[E008] Error accessing remote data.")
    } else if (response.statusCode == 400) {
      console.log("[E011] Error on server end.")
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
    }
    resolve(response.statusCode);
  });
});
};
/* // For debugging
var patchTorchValues = require(__dirname + '/patchTorchValues.js');

(async () => {
  console.log(await patchTorchValues.patchTorchValues());
})();
*/
//currently broken
