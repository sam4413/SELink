const process = require('process');
const chalk = require('chalk');
require('dotenv').config();

exports.notify = async function (level, content) {
    if (level == 1) {
        console.log("[INFO]  ",`${content}`)
    } else if (level == 2) {
        console.log(chalk.magenta("[WARN]  ",`${content}`))
    } else if (level == 3) {
        console.log(chalk.yellow("[ERROR] ",`${content}`))
    } else if (level == 4) {
        console.log(chalk.redBright("[FATAL]  ",`${content}`))
        process.exit()
    } else {
        console.log(chalk.yellow("[ERROR] ",`Unknown level in notify()! Ensure value is from 1-4`))
    }
}
 
/*
var notify = require(__dirname + '/notify.js');
// Value 1 = Info, 2 = Warn, 3 = Error, 4 = Fatal
notify.notify(1, "test")
*/