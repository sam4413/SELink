//AMPLink Truncater
//Made by sam
const fs = require('fs');
const notify = require('./notify.js')
exports.truncate = async function (path, size, chars) {

const logFilePath = path;
const maxFileSize = size * size; 
const charactersToRemove = chars;
bytesToRemove = charactersToRemove * 4

fs.stat(logFilePath, (err, stats) => {
  if (err) {
    notify.notify(3,err);
    return;
  }

  const fileSize = stats.size;

  if (fileSize > maxFileSize) {
    const readStream = fs.createReadStream(logFilePath, { highWaterMark: bytesToRemove  });
    let content = '';

    readStream.on('data', (chunk) => {
      content += chunk.toString();
      if (content.length > charactersToRemove) {
        content = content.slice(content.length - charactersToRemove);
      }
    });

    readStream.on('end', () => {
      fs.writeFile(logFilePath, content, (err) => {
        if (err) {
          notify.notify(3,err);
          return;
        }
        //notify.notify(1,"Log at path "+path+" truncated.")
      });
    });
  }
});

}
/*
const truncate = require("./truncate.js")
truncate.truncate('')
*/