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
  request.delete(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }
    if (response.statusCode == 500){
      resolve(response.statusCode+" Invalid GUID provided. Ensure GUID is valid, or plugin exists on server.")
    }
    if (response.statusCode != 200){
      resolve(response.statusCode);
    } else {
      resolve(response.statusCode+` Plugin with GUID of ${string} has been successfully removed.`)
    }
  });
});
};
/*
 // For debugging
var deletePlugin = require(__dirname + '/deletePlugin.js');

(async () => {
  console.log(await deletePlugin.deletePlugin('d89130c3-c658-482a-beb7-e5c027ba9dab'));
})();
*/