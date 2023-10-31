//AMPLink Logger
//Made by sam
const process = require('process');
const chalk = require('chalk');
const fs = require('fs');
require('dotenv').config();
exports.notify = async function (level, content) {
    if (process.env.LOG_TO_FILE == 'true') {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        today = mm + '.' + dd + '.' + yyyy;
        var log_file_name = `./logs/${today}.txt`
        var log_file_content = `${content}\n`
        if (fs.existsSync(log_file_name)) {
            fs.appendFile(log_file_name, log_file_content, function (err) {
                if (err) throw err;
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
                    console.log(chalk.yellow("[ERROR] ",`Error in logger: Unknown level in notify()! Ensure value is from 1-4`))
                }
            });
        } else {
            const fsdescriptor = fs.writeFile(log_file_name, log_file_content, function (err) {
                if (err) throw err;
                console.log("[WARN]  ",`Creating new log file ${log_file_name}`)
            });
            
            fs.close(fsdescriptor, (err) => {
                if (err) console.log(chalk.yellow("[ERROR] ",`${err.message}`))
            })
        }      
        
    } else {
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
            console.log(chalk.yellow("[ERROR] ",`Error in logger: Unknown level in notify()! Ensure value is from 1-4`))
        }
    }
    
}
/*
let notify = require(__dirname + '/notify.js');
// Value 1 = Info, 2 = Warn, 3 = Error, 4 = Fatal
notify.notify(1, "test")
*/