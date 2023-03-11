//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();
var JSONbig = require('json-bigint');
const { parse } = require('path');

exports.getAllGrids = async function () {

  try {
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids`,
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
//console.log("part1")
    if (response.statusCode == 401) {
      console.log("[E008] Error accessing remote data.")
      resolve(response.statusCode);
    } else if (response.statusCode == 500){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      resolve(response.statusCode);
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      resolve(response.statusCode);
    }

    var array = JSONbig.parse(body);
    //console.log(array.length)
    //console.log(array)
    //Now that we have all the grids, we need to spam the api to get all the current grids. (Thank god theres no ratelimit)
    let result = ""

    for(let i = 0; i < array.length; i++){
      const options2 = {
           url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${array[i]}`,
           headers: {
           'Authorization': `Bearer ${bearerToken}`
           }
       };
   new Promise((resolve) => {
   request.get(options2, (error2, response2, body2) => {
     if (error2) {
       console.error(error2);
       return;
     }
 
     if (response2.statusCode == 401) {
       console.log("[E008] Error accessing remote data.")
       resolve(response2.statusCode);
     } else if (response2.statusCode == 500){
       console.log(`[E009] Error accessing remote data with a status code of ${response2.statusCode}.`)
       //console.log(body2)
       resolve(response2.statusCode);
     } else if (response2.statusCode != 200){
       console.log(`[E009] Error accessing remote data with a status code of ${response2.statusCode}.`)
       resolve(response2.statusCode);
     }
   result += body2 + ',';
   return result //result
   });
   });
   //console.log(result)
}
//Parse the data to a tangable format, aka JerryRig a new array.
setTimeout(() => {
  var fixArray = result.slice(0, -1);
  var fixArray2 = "["+fixArray+"]";
  var parseme = JSONbig.parse(fixArray2)
  var sortme = parseme.sort((a,b) => {
    if (a.blockCount < b.blockCount) {
      return -1
    }
  });
  //console.log(JSONbig.stringify(sortme))
  resolve(sortme);
  return sortme
  //sorted by blockCount Key, least to greatest
}, process.env.GET_ALL_GRIDS_TIMEOUT);
})


});
} catch(err) {
  console.log("[AMPLink]: ",err)
}
}



// For debugging
var getAllGrids = require(__dirname + '/getAllGrids.js');

(async () => {
  console.log(JSONbig.stringify(await getAllGrids.getAllGrids()));
})();
