//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

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
  request.post(options, (error, response, body) => {
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
var deletePlugin = require(__dirname + '/deletePlugin.js');

(async () => {
  console.log(await deletePlugin.deletePlugin());
})();
*/