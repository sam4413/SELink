//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postDisconnectPlayer = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/disconnect`,
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
/*
// For debugging
var postDisconnectPlayer = require(__dirname + '/postDisconnectPlayer.js');

(async () => {
  console.log(await postDisconnectPlayer.postDisconnectPlayer());
})();
*/