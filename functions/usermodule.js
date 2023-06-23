//Modules
const process = require('process');
const chalk = require('chalk');
const notify = require("./functions/notify.js");
require('dotenv').config();

exports.isSuperuser = async function (session_id) {
    // Check if the user is a superuser
    const query = `SELECT is_superuser FROM users WHERE id = ?`;
    connection.query(query, [userId], async (error, results) => {
        if (error) {
            notify.notify(3, `MySQL query error:', ${error}`)
            res.render('error.hbs', {message: results[0].username, errormsg: 'A 500 server error has occured.', error});
        } else if (results[0].is_superuser === 1) {
            //Result
            res.render('ampcfg.hbs')
        } else {
                res.send('You do not have permission to access this page.');
        }
    });
}


 
/*
var notify = require(__dirname + '/notify.js');
// Value 1 = Info, 2 = Warn, 3 = Error, 4 = Fatal
notify.notify(1, "test")
*/