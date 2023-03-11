//AMPLink Updater
//Made by sam
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const notify = require('./notify.js');
const { PassThrough } = require('stream');
require('dotenv').config();

const localFolder = path.join(__dirname, './');
const gitRepository = 'https://github.com/sam4413/AMPLink';


function checkLocalFolder() {
  return new Promise((resolve, reject) => {
    fs.stat(localFolder, (error, stats) => {
      if (error && error.code === 'ENOENT') {
        resolve(false);
      } else if (error) {
        notify.notify(3, error);
      } else if (stats.isDirectory()) {
        resolve(true);
      } else {
        reject(new Error(notify.notify(3, `${localFolder} exists but is not a directory`)));
      }
    });
  });
}

function cloneRepository() {
  return new Promise((resolve, reject) => {
    exec(`git clone ${gitRepository} ${localFolder}`, (error, stdout, stderr) => {
      if (error) {
        reject(notify.notify(3, (error)));
      } else {
        notify.notify(1, stdout);
        notify.notify(1, stderr);
        resolve();
      }
    });
  });
}

function pullUpdates() {
  return new Promise((resolve, reject) => {
    exec(`cd ${localFolder} && git pull`, (error, stdout, stderr) => {
      if (error) {
        reject(notify.notify(3, (error)));
      } else {
        notify.notify(1, stdout);
        notify.notify(1, stderr);
        resolve();
      }
    });
  });
}

async function updateRepository() {
  try {
    const exists = await checkLocalFolder();
    if (!exists) {
      notify.notify(2, `${localFolder} does not exist, cloning repository...`);
      await cloneRepository();
    } else {
      notify.notify(1, `${localFolder} exists, pulling updates...`);
      await pullUpdates();
    }
    notify.notify(1, 'Update complete. Please restart AMPLink to apply changes.');
  } catch (error) {
    notify.notify(3, error);
  }
}
if (process.env.AUTOMATIC_UPDATES == true) {
  updateRepository()
} else {
  notify.notify(2, "Skipping auto-update system.")
}



