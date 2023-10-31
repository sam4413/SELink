//AMPLink Settings Controllers
//Made by sam

const request = require('request');
const { jsonrepair } = require('jsonrepair');
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
      resolve(jsonrepair(body));
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
exports.getTorchSettings = async function () {

  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/settings`,
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
var getTorchSettings = require(__dirname + '/getTorchSettings.js');

(async () => {
  console.log(await getTorchSettings.getTorchSettings());
})();

*/

exports.getTorchValues = async function (string, array) {

    const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
    const options = {
      url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/settings/${string}/values`,
      body: array,
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
  var getTorchValues = require(__dirname + '/getTorchValues.js');
  //var getTorchSchema = require(__dirname + '/getTorchSchema.js');
  var jp = require('jsonpath');
  (async () => {
    //var array = `[\r\n    "chatName",\r\n    "chatColor",\r\n    "noGui"\r\n]`
    //var array = console.log(await getTorchSchema.getTorchSchema('Torch.Server.TorchConfig'));
    
    //All Torch Settings
    var array =   `["gameMode","characterInventorySizeMultiplier","blockInventorySizeMultiplier","assemblerSpeedMultiplier","refinerySpeedMultiplier","maxPlayers","maxFloatingObjects","maxBackupSaves","maxGridSize","maxBlocksPerPlayer","totalPCU","maxFactionsCount","blockLimitsEnabled","enableRemoteBlockRemoval","environmentHostility","autoHealing","enableCopyPaste","weaponsEnabled","showPlayerNamesOnHud","thrusterDamage","cargoShipsEnabled","enableSpectator","worldSizeKm","respawnShipDelete","resetOwnership","welderSpeedMultiplier","grinderSpeedMultiplier","realisticSound","hackSpeedMultiplier","permanentDeath","autoSaveInMinutes","enableSaving","startInRespawnScreen","enableResearch","enableGoodBotHints","infiniteAmmo","enableContainerDrops","spawnShipTimeMultiplier","proceduralDensity","proceduralSeed","destructibleBlocks","enableIngameScripts","floraDensityMultiplier","enableToolShake","voxelGeneratorVersion","enableOxygen","enableOxygenPressurization","enable3rdPersonView","enableEncounters","enableConvertToStation","stationVoxelSupport","enableSunRotation","enableRespawnShips","physicsIterations","sunRotationIntervalMinutes","enableJetpack","spawnWithTools","enableVoxelDestruction","enableDrones","enableWolfs","enableSpiders","blockTypeLimits","enableScripterRole","minDropContainerRespawnTime","maxDropContainerRespawnTime","enableTurretsFriendlyFire","enableSubgridDamage","syncDistance","viewDistance","experimentalMode","adaptiveSimulationQuality","enableVoxelHand","trashRemovalEnabled","trashFlagsValue","blockCountThreshold","playerDistanceThreshold","optimalGridCount","playerInactivityThreshold","playerCharacterRemovalThreshold","optimalSpawnDistance","enableAutoRespawn","tradeFactionsCount","stationsDistanceInnerRadius","stationsDistanceOuterRadiusStart","stationsDistanceOuterRadiusEnd","economyTickInSeconds","enableBountyContracts","depositsCountCoefficient","depositSideDenominator","enableEconomy","voxelTrashRemovalEnabled","enableSupergridding","enableSelectivePhysics","enableFamilySharing","enablePCUTrading","enableWeatherSystem"]`
    //console.log(JSON.stringify(array));
    
    console.log(await getTorchValues.getTorchValues('Torch.Server.ViewModels.SessionSettingsViewModel', array));
  })();
  */

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
  console.log(await patchTorchValues.patchTorchValues('ScriptLogger.ScriptLoggerConfig', `[
    {
      "$type": "integer",
      "value": 60,
      "name": "scanningInt"
    },
    {
      "$type": "boolean",
      "value": true,
      "name": "enabled"
    }
  ]`));
})();
*/


