//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postPluginsDownload = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/plugins/downloads/${string}/install`,
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  };
  return new Promise((resolve) => {
  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode != 200){
      resolve(response);
    } else {
      resolve(response);
    }
  });
});
};
/*
// For debugging
var postPluginsDownload = require(__dirname + '/postPluginsDownload.js');

(async () => {
  console.log(await postPluginsDownload.postPluginsDownload('11fca5c4-01b6-4fc3-a215-602e2325be2b'));
})();
*/