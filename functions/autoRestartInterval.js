//AMPLink AutoRestart
//Made by sam
const notify = require('./notify');
require('dotenv').config();
if (process.env.AUTO_RESTART == 'true') {
    notify.notify(1,`AUTO_RESTART is enabled. AMPLink will restart every ${process.env.AUTO_RESTART_INTERVAL}ms`)
    setTimeout(() => {
        notify.notify(4,"Auto Restart is restarting AMPLink...")
    }, process.env.AUTO_RESTART_INTERVAL);
    
} else {
    notify.notify(2,"AUTO_RESTART is disabled.")
}
 


