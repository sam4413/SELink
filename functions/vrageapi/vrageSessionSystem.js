//AMPLink VRage API Implimentation
//Made by sam

const crypto = require("crypto");
const request = require('request');
const fs = require('fs');
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
require('dotenv').config()
const notify = require("../notify.js")
const secret = process.env.REMOTECLIENT_TOKEN;

/**
 * 
 * @param {*} data Optional - Save with new name. Keep "" to retain current.
 * @returns Metadata
 */

exports.session = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    if (!data) {
        data = "";
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            },
            body: data
        };
        request.patch(requestOptions, (error, response, body) => {
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
 * @returns all players
 */

exports.session.players = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/players\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/players`,
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

/**
 * 
 * @returns all asteroids
 */

exports.session.asteroids = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/asteroids\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/asteroids`,
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

/**
 * 
 * @param {*} data Required - Entity ID for asteroid
 * @returns Metadata
 */

exports.session.asteroids.delete = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/asteroids/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/asteroids/${data}`,
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

/**
 * 
 * @returns all floating objects
 */

exports.session.floatingObjects = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/floatingObjects\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/floatingObjects`,
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

/**
 * 
 * @param {*} data Required - Entity ID for floating object
 * @returns Metadata
 */


exports.session.floatingObjects.stop = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/floatingObjects/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/floatingObjects/${data}`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            }
        };
        request.patch(requestOptions, (error, response, body) => {
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

/**
 * 
 * @param {*} data Required - Entity ID for floating object
 * @returns Metadata
 */

exports.session.floatingObjects.delete = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/floatingObjects/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/floatingObjects/${data}`,
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

/**
 * 
 * @returns all grids
 */

exports.session.grids = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/grids\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/grids`,
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
                notify.notify(3,`A error while processing the request. (${error}) `+ error);
                resolve(error.code);
                }
            }
        });
    });
}

/**
 * 
 * @param {*} data Required - Entity ID for grids
 * @returns Metadata
 */

exports.session.grids.stop = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/grids/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/grids/${data}`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            }
        };
        request.patch(requestOptions, (error, response, body) => {
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

/**
 * 
 * @param {*} data Required - Entity ID for grids
 * @returns Metadata
 */

exports.session.grids.delete = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/grids/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/grids/${data}`,
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

/**
 * 
 * @param {*} data Required - Entity ID for powered grid
 * @returns Metadata
 */

exports.session.grids.powerUp = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/poweredGrids/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/poweredGrids/${data}`,
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

/**
 * 
 * @param {*} data Required - Entity ID for powered grid
 * @returns Metadata
 */

exports.session.grids.powerDown = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/poweredGrids/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/poweredGrids/${data}`,
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

/**
 * 
 * @returns all planets
 */

exports.session.planets = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/planets\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/planets`,
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
                notify.notify(3,`A error while processing the request. (${error}) `+ error);
                resolve(error.code);
                }
            }
        });
    });
}

/**
 * 
 * @param {*} data Required - Entity ID for planet
 * @returns Metadata
 */

exports.session.planets.delete = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/planets/${data}\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/planets/${data}`,
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

/**
 * 
 * @returns all chat
 */

exports.session.chat = async function () {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/chat\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/chat`,
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
                notify.notify(3,`A error while processing the request. (${error}) `+ error);
                resolve(error.code);
                }
            }
        });
    });
}

/**
 * 
 * @param {*} data Required - Message for chat
 * @returns Metadata
 */

exports.session.chat = async function (data) {
    if (process.env.USE_REMOTECLIENT_API != 'true') {
        return null;
    }
    if (!data) {
        data = "";
    }
    const getNonce = () => crypto.randomBytes(20).toString('base64');
    const getUtcDate = () => new Date().toUTCString();

    const nonce = getNonce();
    const date = getUtcDate();

    const key = Buffer.from(secret, 'base64');
    const message = `/vrageremote/v1/session/chat\r\n${nonce}\r\n${date}\r\n`;
    const hash = crypto.createHmac('sha1', key).update(Buffer.from(message)).digest('base64');

    return new Promise((resolve) => {
        const requestOptions = {
            url: `${process.env.REMOTECLIENT_ADDRESS}/vrageremote/v1/session/chat`,
            timeout: 1000,
            headers: {
                'Authorization': `${nonce}:${hash}`,
                'Date': date,
            },
            body: data
        };
        request.patch(requestOptions, (error, response, body) => {
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
var vrageSessionSystem = require(__dirname + '/vrageSessionSystem.js');

(async () => {
    
    var gridlist = await vrageSessionSystem.session.grids();
    // Parse the JSON string with JSONbig library
    const jsonData = JSONbig.parse(gridlist);
    // Convert the jsonData to a regular JavaScript object
    const jsonObject = JSON.parse(JSON.stringify(jsonData));
    // Perform JSONPath query to obtain all values with the key "id"
    const alldata = jp.query(jsonObject, '$..data');

    console.log(JSONbig.stringify(alldata))
})();
*/

/*
//For debugging
var vrageSessionSystem = require(__dirname + '/vrageSessionSystem.js');

(async () => {
    console.log(await vrageSessionSystem.session.asteroids.delete(`596379863931097963`))
})();
*/

/*
//For debugging
var vrageSessionSystem = require(__dirname + '/vrageSessionSystem.js');

(async () => {
    console.log(await vrageSessionSystem.session())
})();
*/