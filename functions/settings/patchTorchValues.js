//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.patchTorchValues = async function (string, sendData) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/settings/${string}/values`,
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

    if (response.statusCode != 200){
      resolve(response.statusCode);
    } else {
      resolve(response.body);
    }
  });
});
};
/*
 // For debugging
var patchTorchValues = require(__dirname + '/patchTorchValues.js');

(async () => {
  console.log(await patchTorchValues.patchTorchValues('Torch.Server.ViewModels.SessionSettingsViewModel', `[
	{
		"$type": "enum",
		"value": "Creative",
		"name": "gameMode"
	}]`));
})();
*/
//currently broken