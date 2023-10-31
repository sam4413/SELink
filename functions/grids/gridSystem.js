//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();
const JSONbig = require('json-bigint');
const notify = require('../notify');
const { Console } = require('console');

exports.getGroupGridId = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${string}/group`,
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

    if (response.statusCode == 401) {
      console.log("[E008] Error accessing remote data.")
      resolve(response.statusCode);
    } else if (response.statusCode == 500){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      //var body = `[]`
      resolve(response.statusCode);
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      console.log(body)
      resolve(response.statusCode);
    }
    resolve(body)
    console.log(JSONbig.parse(body))
  })
})
}

exports.getAllGrids = async function() {
  try {
    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`;
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids`,
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    return new Promise((resolve) => {
      
      request.get(options, (error, response, body) => {
        if (error) {
          notify.notify(3, error)
          return;
        }

        if (response.statusCode == 401) {
          notify.notify(3, "Error accessing remote data.");
          resolve(response.statusCode);
        } else if (response.statusCode == 500) {
          notify.notify(3, `Error accessing remote data with a status code of ${response.statusCode}.`);
          resolve(response.statusCode);
        } else if (response.statusCode != 200) {
          notify.notify(3, `Error accessing remote data with a status code of ${response.statusCode}.`);
          resolve(response.statusCode);
        }

        var array = JSONbig.parse(body);

        let result = "";
        for (let i = 0; i < array.length; i++) {
          const options2 = {
            url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${array[i]}`,
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            },
            timeout: 1000
          };

          new Promise((resolve) => {
            try {
            request.get(options2, (error2, response2, body2) => {
              if (error2) {
                return false;
              }

              if (response2.statusCode == 401) {
                notify.notify(3, "Error accessing remote data.");
                resolve(response2.statusCode);
              } else if (response2.statusCode == 500) {
                notify.notify(3, `Error accessing remote data with a status code of ${response2.statusCode}.`);
                resolve(response2.statusCode);
              } else if (response2.statusCode != 200) {
                notify.notify(3, `Error accessing remote data with a status code of ${response2.statusCode}.`);
                resolve(false);
                return false;
              }

              result += body2 + ',';
              return result;
            });
          } catch(err) {
            notify.notify(3, err)
          }
        });
        }

        setTimeout(() => {
          var fixArray = result.slice(0, -1);
          var fixArray2 = "[" + fixArray + "]";
          var parseme = JSONbig.parse(fixArray2);
          resolve(JSONbig.stringify(parseme));
          return JSONbig.stringify(parseme);
        }, process.env.GET_ALL_GRIDS_TIMEOUT);
          
        
      });
    });
  } catch (err) {
    notify.notify(3, err)
  }
};
/*
// For debugging
var getAllGrids = require(__dirname + '/gridSystem.js');

(async () => {
  console.log(await getAllGrids.getAllGrids());
})();
*/

exports.deleteGridId = async function (string) {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${string}`,
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  };
  return new Promise((resolve) => {
  request.delete(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode == 401) {
      notify.notify(3, "Error accessing remote data.");
      resolve(response.statusCode);
    } else if (response.statusCode == 500) {
      notify.notify(3, `Error accessing remote data with a status code of ${response.statusCode}.`);
      resolve(response.statusCode);
    } else if (response.statusCode != 200) {
      notify.notify(3, `Error accessing remote data with a status code of ${response.statusCode}.`);
      console.log(body)
      resolve(response.statusCode);
    }
    resolve(body)
  })
})
}
/*
// For debugging
var deleteGridId = require(__dirname + '/deleteGridId.js');

(async () => {
  console.log(await deleteGridId.deleteGridId('111111111111111111'));
})();
*/