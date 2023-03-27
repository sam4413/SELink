//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.getTorchSchema = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/settings/${string}`,
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
/*
// For debugging
var getTorchSchema = require(__dirname + '/getTorchSchema.js');

(async () => {
  var stringme = JSON.parse(await getTorchSchema.getTorchSchema('Profiler.ProfilerConfig'));
  console.log(stringme);
})();
*/