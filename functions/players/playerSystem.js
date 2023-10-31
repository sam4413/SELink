//AMPLink Players 
//Made by sam
const request = require('request');
require('dotenv').config();

exports.getAllBannedPlayers = async function () {

    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/banned`,
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
exports.getAllPlayers = async function () {
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/`,
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
exports.postBanPlayer = async function (string) {
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/ban`,
    data: string,
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
      if (response.statusCode == 401) {
        resolve(response.statusCode);
      } else if (response.statusCode == 400) {
        resolve(response.statusCode);
      } else if (response.statusCode != 200){
        resolve(response.statusCode);
      }
      resolve(response.statusCode);
    });
});
};
exports.postDemotePlayer = async function (string) {
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/demote`,
    data: string,
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
      resolve(response.statusCode);
    } else {
      resolve(response.statusCode);
    }
  });
});
};
exports.postDisconnectPlayer = async function (string) {
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/disconnect`,
    data: string,
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
      resolve(response.statusCode);
    } else {
      resolve(response.statusCode);
    }
  });
});
};
exports.postKickPlayer = async function (string) {
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/kick`,
    data: string,
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
        resolve(response.statusCode);
      } else {
        resolve(response.statusCode);
      }
    });
  });
};
exports.postPromotePlayer = async function (string) {

    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/promote`,
      data: string,
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
          resolve(response.statusCode);
        } else {
          resolve(response.statusCode);
        }
      });
    });
};
exports.postUnbanPlayer = async function (string) {

    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/players/${string}/unban`,
      data: string,
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
          resolve(response.statusCode);
        } else {
          resolve(response.statusCode);
        }
      });
    });
};

/*
// For debugging
var playerSystem = require(__dirname + '/playerSystem.js');

(async () => {
  console.log(await playerSystem.postKickPlayer());
})();

*/