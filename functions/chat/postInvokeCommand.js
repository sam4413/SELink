//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postInvokeCommand = async function (string) {
  string = JSON.stringify(string)
  var send = `{"command": ${string} }`
  JSON.parse(send)
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/chat/command`,
    body: send,
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
      notify.notify(3, `Error accessing remote data with a status code of ${response.statusCode}.`);
      resolve(response.statusCode);
    }
    resolve(response.body);
  });
});
};
/*
//For debugging
var postInvokeCommand = require(__dirname + '/postInvokeCommand.js');

(async () => {
  console.log(await postInvokeCommand.postInvokeCommand('cleanup delete blockslessthan 20'));
})();
*/