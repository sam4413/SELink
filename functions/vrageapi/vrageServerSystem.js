//AMPLink VRage API Implimentation
//Made by sam

const crypto = require("crypto");
const request = require('request');
const fs = require('fs');
require('dotenv').config()
const notify = require("../notify.js")
const secret = process.env.REMOTECLIENT_TOKEN;

//Modules
const RateLimit = require('express-rate-limit');
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
const { resolve } = require("path");

/**
 * Get information of the server, such as CPU Usage, Number of players, and Sim Speed.
 * @returns Metadata
 */

exports.server = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/server\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/server`,
            timeout: 100,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            }
        };
        request.get(requestOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                if (error && error.code === 'ETIMEDOUT') {
                notify.notify(3,"A timeout has occured while processing the request.")
                resolve(error.code);
                } else {
                notify.notify(3,`A error while processing the request. (${error.code}) `+ error);
                resolve(error.code);
                }
            }
        });
    });
}
/**
 * Stops the server.
 * @returns Metadata
 */
exports.server.stop = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/server\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/server`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            }
        };
        request.delete(requestOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                if (error && error.code === 'ETIMEDOUT') {
                notify.notify(3,"A timeout has occured while processing the request.")
                resolve(error.code);
                } else {
                notify.notify(3,`A error while processing the request. (${error.code}) `+ error);
                resolve(error.code);
                }
            }
        });
    });
}
/**
 * 
 * @returns Metadata
 */
exports.server.ping = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/server/ping\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/server/ping`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            }
        };
        request.get(requestOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                if (error && error.code === 'ETIMEDOUT') {
                notify.notify(3,"A timeout has occured while processing the request.")
                resolve(error.code);
                } else {
                notify.notify(3,`A error while processing the request. (${error.code}) `+ error);
                resolve(error.code);
                }
            }
        });
    });
}


/*
//For debugging
var vrageServerSystem = require(__dirname + '/vrageServerSystem.js');

(async () => {
    console.log(await vrageServerSystem.server());
})();
*/