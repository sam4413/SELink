//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.getAllPlugins = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/`,
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
/*// For debugging
var getAllPlugins = require(__dirname + '/getAllPlugins.js');

(async () => {
  console.log(await getAllPlugins.getAllPlugins());
})();*/ 


