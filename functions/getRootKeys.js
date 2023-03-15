const process = require('process');
const chalk = require('chalk');
const { resolve } = require('path');
require('dotenv').config();

exports.getRootKeys = async function (json) {
    return new Promise((resolve) => {
        const jsonObj = JSON.parse(json);
        const rootKeys = Object.keys(jsonObj.schema.properties);
        
        //console.log(rootKeys);
        resolve(rootKeys)
    });
}
/*
//For debugging
var getRootKeys = require(__dirname + '/getRootKeys.js');

(async () => {
    // Value 1 = Info, 2 = Warn, 3 = Error, 4 = Fatal
    console.log(await getRootKeys.getRootKeys(`{"name":"Profiler","schema":{"type":"object","properties":{"enabled":{"type":"boolean"},"silenceInvalidPatch":{"type":"boolean"},"suppressWpfOutput":{"type":"boolean"},"enableLoggingTrace":{"type":"boolean"},"enableLoggingDebug":{"type":"boolean"},"logFilePath":{"type":"string"}}}}`))
})()
*/

