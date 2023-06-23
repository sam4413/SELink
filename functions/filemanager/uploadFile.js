//AMPLink File Controller
//Made by sam

const request = require('request');
const { json } = require('stream/consumers');
require('dotenv').config();

exports.uploadFile = async function (file) {
  const options = {
    url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${string}`,
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
var getSteamPlayerSummaries = require(__dirname + '/getSteamPlayerSummaries.js');
(async () => {
  console.log(await getSteamPlayerSummaries.getSteamPlayerSummaries('YOUR_KEY_HERE', "76561198246034874"));
})();*/