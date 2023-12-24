const express = require('express');
const basicFtp = require('basic-ftp');
const path = require('path');
const ftp = require('ftp');
const fs = require('fs');

const app = express();

require('dotenv').config()
const notify = require("../functions/notify.js");
notify.notify(1,"Initializing ftp route...")

const userSystem = require("../functions/userSystem.js");

// Serve static files from the public directory
app.use(express.json())

// FTP configuration
var ftpConfig;
if (process.env.ENABLE_FTP_SERVER == 'true') {
  ftpConfig = {
    host: process.env.FTP_SERVER_ADDRESS, // Replace with your FTP server address
    port: process.env.FTP_SERVER_PORT, // Replace with the appropriate port
    user: process.env.FTP_SERVER_USERNAME,
    password: process.env.FTP_SERVER_PASSWORD,
    secure: false
  }; 
  notify.notify(1,"FTP Server: Enabled.")
} else {
  notify.notify(1,"FTP Server: Disabled.")
}

// Connect to FTP server
const ftpClient = new ftp();
ftpClient.connect(ftpConfig);


// Function to retrieve file and folder information
function getDirectoryContents(remotePath) {
  return new Promise((resolve, reject) => {
    ftpClient.list(remotePath, (err, list) => {
      if (err) {
        reject(err);
      } else {
        resolve(list);
      }
    });
  });
}
//TODO: Make a switch statement (and not awful)

//const characters = [".", ":", "?", '"', "<", ">", "|", "*", "$", "(", ")", "{", "}", "[", "]", "\""];
function isLegalName(currentPath) {
  if (currentPath.length >= 64) {
    return false;
  } else if (currentPath == "/") {
    return false;
  } else if (currentPath == "") {
    return false;
  } else if (currentPath == ".") {
    return false;
  } else if (currentPath.includes(":")) {
    return false;
  } else if (currentPath.includes("?")) {
    return false;
  } else if (currentPath.includes('"')) {
    return false;
  } else if (currentPath.includes("<")) {
    return false;
  } else if (currentPath.includes(">")) {
    return false;
  } else if (currentPath.includes("|")) {
    return false;
  } else if (currentPath.includes("\"")) {
    return false;
  } else if (currentPath.includes("*")) {
    return false;
  } else if (currentPath.includes("$")) {
    return false;
  } else if (currentPath.includes("(")) {
    return false;
  } else if (currentPath.includes(")")) {
    return false;
  } else if (currentPath.includes("{")) {
    return false;
  } else if (currentPath.includes("}")) {
    return false;
  } else if (currentPath.includes("[")) {
    return false;
  } else if (currentPath.includes("]")) {
    return false;
  } else {
    return true;
  }
}

module.exports = function(app){     
  // Define routes
  app.get('/ftp', async (req, res) => {
    const userId = req.session.userId;  
    if (req.session.userId) {
      if (await userSystem.isSuperuser(userId) != true){
        return res.status(403).send('Forbidden');
      }
      try {
        // Initial path, e.g., root directory '/'
        const currentPath = req.query.path || '/';
        const contents = await getDirectoryContents(currentPath);

        // Filter out folders and files
        const folders = contents.filter(item => item.type === 'd');
        // Assuming each item in contents has a 'name' and 'size' property
        const files = contents.filter(item => item.type === '-').map(file => {
          return { name: file.name, size: (file.size / 1024).toFixed(2) + ' KB' }; 
        });

        res.render('ftp', { folders, files, currentPath });
      } catch (error) {
        res.status(500).send('Internal Server Error');
        notify.notify(3,"FTP Server: "+error.message)
      }
    } else {
      res.redirect('/login')
    }
  });

    app.get('/ftp/download', async (req, res) => {
    const userId = req.session.userId;
    if (req.session.userId) {
      if (await userSystem.isSuperuser(userId) != true){
        return res.status(403).send('Forbidden');
      }
      try {
          const filePath = req.query.path;
          const fileStream = await getFileStream(filePath);

          res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filePath)}`);
          res.setHeader('Content-Type', 'application/octet-stream');

          fileStream.pipe(res);
      } catch (error) {
          res.status(500).send(`Internal Server Error. (${error.code})`);
          notify.notify(3,"FTP Server: "+error.message)
      }
    } else {
        res.redirect('/login')
    }
    });

    // Helper function to get file stream
    function getFileStream(filePath) {
    return new Promise((resolve, reject) => {
        ftpClient.get(filePath, (err, stream) => {
        if (err) {
            reject(err);
        } else {
            resolve(stream);
        }
        });
    });
    }

    //Uploading

    // Route for handling file uploads
    app.post('/ftp/upload', async (req, res) => {
    const userId = req.session.userId;
    if (req.session.userId) {
      if (await userSystem.isSuperuser(userId) != true){
        return res.status(403).send('Forbidden');
      }
      const ftp = new basicFtp.Client();
      await ftp.access(ftpConfig);
    try {
        const currentPath = req.query.path;
        const file = req.files.file;
        if (!file) {
            notify.notify(2,"FTP Server: Cannot upload an empty file!")
            return res.status(400).send('No file uploaded. (400)');
        } else if (file == null) {
            notify.notify(2,"FTP Server: Cannot upload an empty file!")
            return res.status(400).send('No file uploaded. (400)');
        }

        const targetPath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
        const remotePath = `${targetPath}${file.name}`;
        const fileName = file.name;
        // Check if the uploaded item is a directory
        if (file.mv) {
        // If it's a file, move it to a temporary location before upload
        const tempFilePath = path.resolve('./temp', fileName);
        await file.mv(tempFilePath);
        await ftp.uploadFrom(tempFilePath, remotePath);
        notify.notify(1,"FTP Server: Uploaded file: "+remotePath)
        fs.unlinkSync(tempFilePath); // Remove the temporary file after upload
        } else {
        // If it's a directory, handle it accordingly
        notify.notify(3,"FTP Server: Cannot upload a directory!")
        ftp.close();
        res.status(400).send(`Cannot upload a directory. (400)`);
        }

        ftp.close();
        setTimeout(() => {
          res.redirect(`/?path=${encodeURIComponent(currentPath)}`);
        }, 100);
    } catch (error) {
        ftp.close();
        notify.notify(3,"FTP Server: "+error.message)
        res.status(500).send(`Internal Server Error. (${error.code})`);
    }
    } else {
      res.redirect('/login')
    }
    });

    //Folder Create
    app.post('/ftp/createFolder', async (req, res) => {
    const userId = req.session.userId;
    if (req.session.userId) {
      if (await userSystem.isSuperuser(userId) != true){
        return res.status(403).send('Forbidden');
      }
      const ftp = new basicFtp.Client();
      await ftp.access(ftpConfig);
    try {
        const currentPath = req.query.path;
        const name = req.body.name;

        

        notify.notify(1,`FTP Server: Creating folder ${currentPath}${name}`)

        // Create new folder

        if (isLegalName(`${currentPath}${name}`)) {
          await ftp.ensureDir(`${currentPath}${name}`);
          notify.notify(1,`FTP Server: Folder ${currentPath}${name} created.`)
          ftp.close();
          res.redirect(`/`);
        } else {
          res.status(400).send(`Invalid name. (400).`);
          notify.notify(3,"FTP Server: Folder creation failed: Invalid name.")
        }
    } catch (error) {
        ftp.close();
        notify.notify(3,"FTP Server: "+error.message)
        res.status(500).send(`Internal Server Error. (${error.code})`);
    }
    } else {
        res.redirect('/login')
    }
    });


    //Folder Delete
    app.post('/ftp/deleteFolder', async (req, res) => {
    const userId = req.session.userId;
    if (req.session.userId) {
      if (await userSystem.isSuperuser(userId) != true){
        return res.status(403).send('Forbidden');
      }
      const ftp = new basicFtp.Client();
      await ftp.access(ftpConfig);
    try {
        const currentPath = req.query.path;

        if (isLegalName(currentPath)) {
        await ftp.removeDir(currentPath.substring(1))
        notify.notify(1,`Folder ${currentPath} deleted.`)
        ftp.close();

        res.redirect(req.get('referer'));
        } else {
            notify.notify(3,"FTP Server: Folder deletion failed: Invalid name.")
            res.status(400).send(`Invalid name. (400).`);
        }
        
    } catch (error) {
        ftp.close();
        notify.notify(3,"FTP Server: "+error.message)
        res.status(500).send(`Internal Server Error. (${error.code})`);
    }
    } else {
        res.redirect('/login')
    }
    });

    //Deleting
    // Route for handling file uploads
    app.post('/ftp/delete', async (req, res) => {
    const userId = req.session.userId;
    if (req.session.userId) {
      if (await userSystem.isSuperuser(userId) != true){
        return res.status(403).send('Forbidden');
      }
      const ftp = new basicFtp.Client();
      await ftp.access(ftpConfig);
    try {
        const currentPath = req.query.path;
    
        // Check if the uploaded item is a directory
        await ftp.remove("."+currentPath)
        notify.notify(1,`FTP Server: File ${currentPath} deleted.`)
        ftp.close();

        res.redirect(req.get('referer'));
        
    } catch (error) {
        ftp.close();
        notify.notify(3,"FTP Server: "+error.message)
        res.status(500).send(`Internal Server Error. (${error.code})`);
    }
    } else {
        res.redirect('/login')
    }
    });
}