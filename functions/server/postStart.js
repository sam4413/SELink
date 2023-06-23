//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postStart = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/server/start`,
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

    if (response.statusCode != 200){
      resolve(response.statusCode);
    } else {
      resolve(response.statusCode);
    }
  });
});
};
/* // For debugging
var postStart = require(__dirname + '/postStart.js');

(async () => {
  console.log(await postStart.postStart());
})();
*/
