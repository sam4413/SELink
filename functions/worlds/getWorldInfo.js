//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.getWorldInfo = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/worlds/${string}`,
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

    if (response.statusCode != 200){
      resolve(response.statusCode);
    } else {
      resolve(body);
    }
  });
});
};
/*  // For debugging
var getWorldInfo = require(__dirname + '/getWorldInfo.js');

(async () => {
  console.log(await getWorldInfo.getWorldInfo());
})();
*/
