//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postKickPlayer = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/kick`,
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
      if (response.statusCode != 200){
        resolve(response.statusCode);
      } else {
        resolve(response.statusCode);
      }
    });
  });
  };
/* // For debugging
var postKickPlayer = require(__dirname + '/postKickPlayer.js');

(async () => {
  console.log(await postKickPlayer.postKickPlayer());
})();
*/ 
