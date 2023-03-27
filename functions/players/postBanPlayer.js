//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postBanPlayer = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/ban`,
    data: string,
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
        resolve(response.statusCode);
      } else if (response.statusCode == 400) {
        resolve(response.statusCode);
      } else if (response.statusCode != 200){
        resolve(response.statusCode);
      }
      resolve(response.statusCode);
    });
});
};
/* // For debugging
var postBanPlayer = require(__dirname + '/postBanPlayer.js');

(async () => {
  console.log(await postBanPlayer.postBanPlayer());
})();
*/ 
