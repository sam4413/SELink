//AMPLink UserSystem
//Made by sam


//Modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const RateLimit = require('express-rate-limit');
const e = require('express');
const fs = require('fs')
const repair = require('repair')
const WebSocket = require('ws')
var jp = require('path');
var sqlEscape = require('sql-escape');
var randomstring = require("randomstring");
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer');

const notify = require('./notify.js');
const { User } = require('discord.js');

require('dotenv').config();

    // 409 = already exists/conflict
    // 500 = error
    // 503 = service unavaiable
    // 200 = success

exports.isSuperuser = function (userId) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");

                // Check if the user is a superuser
                const query = `SELECT is_superuser FROM users WHERE id = ?`;
                connection.query(query, [userId], (error, results) => {
                    if (error) {
                        notify.notify(3, `MySQL query error:', ${error}`);
                        connection.end();
                        resolve(({status:500})); // Reject the promise if there's an error in the query
                    } else if (results[0].is_superuser === 1) {
                        connection.end();
                        resolve(true); // Resolve with true if the user is a superuser
                    } else {
                        connection.end();
                        resolve(false); // Resolve with false if the user is not a superuser
                    }
                });
            }
        });
    });
};

exports.isNormal = function (userId) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");

                // Check if the user is a superuser
                const query = `SELECT is_superuser FROM users WHERE id = ?`;
                connection.query(query, [userId], (error, results) => {
                    if (error) {
                        notify.notify(3, `MySQL query error:', ${error}`);
                        connection.end();
                        resolve(({status:500})); // Reject the promise if there's an error in the query
                    } else if (results[0].is_superuser === 0) {
                        connection.end();
                        resolve(true); // Resolve with true if the user is not a superuser
                    } else {
                        connection.end();
                        resolve(false); // Resolve with false if the user is a superuser
                    }
                });
            }
        });
    });
};

exports.setLevel = function (userId, value) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");

                // Check if the user is a superuser
                const query = `UPDATE users SET is_superuser = ? WHERE id = ?`
                connection.query(query, [value, userId], (error, results) => {
                    if (error) {
                        notify.notify(3, `MySQL query error:', ${error}`);
                        connection.end();
                        resolve(({status:500})); // Reject the promise if there's an error in the query
                    } else {
                        connection.end();
                        resolve(({status:200})); // success case
                    }
                });
            }
        });
    });
};
  
exports.delete = function (userId) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");

                // Check if the user is a superuser
                const query = `DELETE FROM users WHERE id = ?`;
                connection.query(query, [userId], (error, results) => {
                    if (error) {
                        notify.notify(3, `MySQL query error:', ${error}`);
                        connection.end();
                        resolve(({status:500})); // Reject the promise if there's an error in the query
                    } else {
                        connection.end();
                        resolve(({status:200})); // Resolve with false if the user is not a superuser
                    }
                });
            }
        });
    });
};

exports.create = function (username,password) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });


    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                // Check if the username is already taken
                const query = `SELECT * FROM users WHERE username = ?`;
                connection.query(query, [username], (error, results) => {
                    if (error) {
                        connection.end();
                        notify.notify(3, `MySQL query error:', ${error}`)
                        resolve(({status:500}));
                    } else if (results.length > 0) {
                        connection.end();
                        resolve(({status:409}));
                    } else {
                    // Hash the password using bcrypt
                    bcrypt.hash(password, 10, (error, hashedPassword) => {
                        if (error) {
                        notify.notify(3, `Bycrypt error:', ${error}`)
                        resolve(({status:500}));
                        } else {
                        // Insert the new user into the database
                        const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
                        connection.query(insertQuery, [username, hashedPassword], (error) => {
                            if (error) {
                                connection.end();
                                notify.notify(3, `MySQL query error:', ${error}`)
                                resolve(({status:500}));
                            } else {
                                // The user was successfully registered
                                connection.end();
                                resolve(({status:200}));
                            }
                        });
                        }
                    });
                    }
                });
            }
        });
    });
};


exports.setId = function (userId, value) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");

                // Check if the user is a superuser
                const query = `UPDATE users SET id = ? WHERE id = ?`;
                connection.query(query, [value,userId], (error, results) => {
                    if (error) {
                        notify.notify(3, `MySQL query error:', ${error}`);
                        connection.end();
                        resolve(({status:500})); // Reject the promise if there's an error in the query
                    } else {
                        connection.end();
                        resolve(({status:200})); // Success
                    }
                });
            }
        });
    });
};

exports.resetPassword = function (userId, password) {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");
                // Hash the password using bcrypt
                bcrypt.hash(password, 10, (error, hashedPassword) => {
                    if (error) {
                    notify.notify(3, `Bycrypt error:', ${error}`)
                    resolve(({status:500}));
                    } else {
                    // Check if the user is a superuser
                    const query = `UPDATE users SET password = ? WHERE id = ?`;
                    connection.query(query, [hashedPassword,userId], (error, results) => {
                        if (error) {
                            notify.notify(3, `MySQL query error:', ${error}`);
                            connection.end();
                            resolve(({status:500})); // Reject the promise if there's an error in the query
                        } else {
                            connection.end();
                            resolve(({status:200})); // Success
                        }
                    });
                }
            })}
        });
    });
};


exports.listAll = async function () {

    // Init db connection
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_ROOT,
        password: process.env.DATABASE_PASSWORD, // leave empty to '' if none
        database: process.env.DATABASE
    });

    return new Promise((resolve) => {
        connection.connect((error) => {
            if (error) {
                notify.notify(4, `MySQL connection error:', ${error}\nAMPLink cannot connect to the MySQL server. Ensure that it is running, then start the program again.`);
                resolve(({status:503})); // Reject the promise if there's an error connecting
            } else { 
                //notify.notify(1, "Accessing MySQL Database.");

                // Check if the user is a superuser
                const query = `SELECT * FROM users`;
                connection.query(query, (error, results) => {
                    if (error) {
                        notify.notify(3, `MySQL query error:', ${error}`);
                        connection.end();
                        resolve(({status:500})); // Reject the promise if there's an error in the query
                        return false;
                    } else {
                        resolve(results); // Resolve with false if the user is a superuser
                        return results;
                    }
                });
            }
        });
    });
};
/*
//For Debugging

(async () => {
  const UserSystem = require("./userSystem.js")
  console.log(await UserSystem.resetPassword(1,"123"));
})();


*/