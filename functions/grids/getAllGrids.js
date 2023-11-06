//AMPLink Grid Controllers
//Made by sam

const request = require('request');
require('dotenv').config();
const JSONbig = require('json-bigint');
const notify = require('../notify');
const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`;


//GridSystem v2
exports.getAllGridIds = async function() {
  try {
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
        } else {
          resolve(body);
        }
      });
    });
  } catch (err) {
    notify.notify(3, err)
  }
}

exports.getAllGridInfo = async function(ids) {
  const batchSize = 10;
  const delayBetweenBatches = 1000;

  let result = "";
  ids = JSONbig.parse(ids);

  async function performBatchRequests(ids) {

    if (ids.length === 0) {
      var fixArray = result.slice(0, -1);
      var fixArray2 = "[" + fixArray + "]";
      return fixArray2;
    }
    //console.log(ids)

    const batch = ids.slice(0, batchSize);
    ids = ids.slice(batchSize);

    if (!Array.isArray(batch)) {
      notify.notify(3,'Invalid batch:', batch);
      return;
    }

    batch.forEach(id => {
      const options = {
        url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/grids/${id}`,
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      };
      request.get(options, (error, response, body) => {
        if (response.statusCode != 200) {
          notify.notify(3, `Grid id ${id} no longer exists (${response.statusCode}).`);
        } else {
          result += `${body},`
        }
      });
    });
    setTimeout(() => {
      //notify.notify(3,"==================== WAITING ====================")
      performBatchRequests(ids);
    }, delayBetweenBatches);
  }
  performBatchRequests(ids);
}

// For debugging
var getAllGrids = require(__dirname + '/getAllGrids.js');
async function getAllGridsExample() {
  var ids = await getAllGrids.getAllGridIds();
  console.log(await getAllGrids.getAllGridInfo(ids));
  
}
getAllGridsExample()


