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

exports.admin.promotedPlayers = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/admin/promotedPlayers\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/admin/promotedPlayers`,
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

exports.admin.promotedPlayers.promote = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/admin/promotedPlayers/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/admin/promotedPlayers/${data}`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            }
        };
        request.post(requestOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                if (error && error.code === 'ETIMEDOUT') {
                notify.notify(3,"A timeout has occured while processing the request.")
                resolve(error.code);
                } else {
                notify.notify(3,`A error while processing the request. (${error}) `+ error);
                resolve(error);
                }
            }
        });
    });
}

exports.admin.promotedPlayers.demote = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/admin/promotedPlayers/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/admin/promotedPlayers/${data}`,
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
                notify.notify(3,`A error while processing the request. (${error}) `+ error);
                resolve(error);
                }
            }
        });
    });
}


/*
//For debugging
var vrageAdminSystem = require(__dirname + '/vrageAdminSystem.js');

(async () => {
    console.log(await vrageAdminSystem.promotedPlayers())
})();
*/