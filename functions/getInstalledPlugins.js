const process = require('process');
const chalk = require('chalk');
const { resolve } = require('path');
const getAllPlugins = require('./plugins/getAllPlugins.js');
const getTorchSchema = require('./settings/getTorchSchema.js');
const notify = require('./notify.js');
require('dotenv').config();
var jp = require('jsonpath');

exports.getInstalledPlugins = async function () {
    return new Promise(async (resolve) => {
    var allPlugins = (await getAllPlugins.getAllPlugins())
    var parse = jp.query(JSON.parse(allPlugins), '$..settingId')
    //notify.notify(1,parse)
    
    for (let i = 0; i < parse.length; i++) {
      if (parse[i] === null) {
        parse.splice(i, 1)
        i--;
      }
    } 
    let results = ""; 

    try {
      parse.forEach(async (parse) => {
        var getLayout = (await getTorchSchema.getTorchSchema(parse))
        results += getLayout+","
      });
      var fixArray3 = "";
      setTimeout(() => {
        var fixArray = results.slice(0, -1);
        var fixArray2 = JSON.parse("["+fixArray+"]")
        var fixArray3 = jp.query(fixArray2, "$.*.name")

        //resolve(fixArray3)
        return fixArray3
      }, 1000);
      
      return fixArray3

    } catch(e) {
      notify.notify(3,e)
    }
    //return fixArray3
        
})
}


//For debugging
var getInstalledPlugins = require(__dirname + '/getInstalledPlugins.js');

(async () => {
    console.log(await getInstalledPlugins.getInstalledPlugins())
})()
