![AMPLink Logo](https://cdn.discordapp.com/attachments/617491056652582953/1085417601208946728/image.png)
## SELink (Space Engineers Linker)
(Formally AMPLink)

**We are currently going under a name change. Some stuff may be called AMPLink, but eventually it will all be called SELink.**

SELink is a powerful tool that allows Administrators easy access to their Space Engineers servers through an easy to use webpanel.
 
 SELink relies on a RestAPI plugin for Torch called "TorchRemote." You will need to have it installed in order to make the plugin work.
 https://torchapi.com/plugins/view/284017F3-9682-4841-A544-EB04DB8CB9BA
 
 ## ROADMAP:
- [ ] Torch Configuration
  - [X] Configuring Plugins
  - [X] Torch Plugins Search
  - [ ] Post configuration to server
  - [X] Upload new plugins
  - [ ] Automatic / Scheduled tasks
  
- [X] Moderation
  - [X] Chat monitoring
  - [X] Kick, ban, promote, and demote players
  - [X] Send Messages through Panel
  - [X] Entity list
  - [X] Delete a grid
  - [X] Banned players list
  - [X] Unban players 
- [X] Server
  - [X] Console monitoring
  - [X] Start, restart, and stop server
  - [X] Send commands through console
  - [X] Copy console
  - [X] Server info and description
  
- [ ] World
  - [ ] Basic world info
  - [ ] World size
 
- [X] Users Management
  - [X] Create users
  - [X] Delete users
  - [X] User level management
  - [X] Login page
  
- [ ] Other
  - [X] Configuratable .env
  - [X] Configuratable style.css
  - [ ] Automatic Updates
  - [ ] Restart SELink server
  
- [ ] Discord Bot Integration (This is far off, so this might change)
  - [X] Chat monitoring
  - [ ] Console monitoring
  - [ ] Send server commands through discord bot
  - [X] Send chat messages through discord bot

 ## Users system:

One unique thing about SELink is that you can give your users certain features. For instance, User A is registered as a Normal User, and can only:
 - restart the server
 - stop the server
 - start the server
 - view console
As well as:
 - Promote/Demote users in game
 - Kick/Ban users in game.

But on the other hand, User B, which is a superuser can:

 - Do everything a Normal User can with the addition of:
 - Add/Remove other users in SELink
 - Add/Remove mods from the Steam Workshop
 - Configure the Torch Instance and World Settings
 - Add/Remove Plugins from Torch as well as uploading your own plugin
 - Allow for the configuration of said plugins as well.
 
Clearly everything isnt added at the moment, but this is what I plan to add.<br>

## Installation
SELink relies on a MySQL database in order to function, and store the data nessesary for the users system. Obviously, because this is important, if the MySQL server and/or database is not found or running, SELink will throw a fatal error and not start up.

Step 1: Install XAMPP (easiest option) or WAMPServer (advanced). 
I will be going over how to install it using XAMPP.

Step 2: Once XAMPP is installed, start/install the Apache and MySQL services. This is how it should look:
![XAMPP](https://cdn.discordapp.com/attachments/617491056652582953/1087703768675655730/IMG_7248.png)

Step 3: Open phpMyAdmin by either navigating to http://localhost/phpmyadmin/ OR pressing "Admin" button by the MySQL section for XAMPP.

Step 4: Create the database by pressing "New" on the left hand panel. 
![PHP1](https://cdn.discordapp.com/attachments/617491056652582953/1087706267616813116/IMG_7249.png)

Step 5: You may name the database anything you want, however for a more straightforward setup, just name the database "SELink". Because I already have a database named SELink, I'm using the name "SELink-server". The name won't matter.
![PHP2](https://cdn.discordapp.com/attachments/617491056652582953/1087706267943964762/IMG_7251.png)

Step 5: Copy and paste the contents of the users.sql file into the SQL tab for the database on phpMyAdmin. 
![PHP3](https://cdn.discordapp.com/attachments/617491056652582953/1087706268195627028/IMG_7253.png)

Step 6: Navigate to the "Structure" tab. Ensure you see a table called "users". Inside of it, you should see a user named "root". If you see the table created, you have successfully made the Database for SELink.
![PHP4](https://cdn.discordapp.com/attachments/617491056652582953/1087706268526973038/IMG_7255.png)

Great! Now that you have created the database, you will now need to tell SELink what database should it run off of. If the database is not set correctly, the program will not start, and throw a fatal error.

Step 7: Go back to where you extracted the SELink folder and open the .env file. This is where you can configure all server-side SELink functions. Right-click it and open it with any text editor. I am using Notepad++.
![AMP1](https://cdn.discordapp.com/attachments/617491056652582953/1087709997422624838/IMG_7256.png)

Step 8: Find the config on where it says "DATABASE = SELink" If you have created a database with a different name, you will need to change the name accordingly. If your database has a "PASSWORD =  ", you can fill it here. If not, leave it empty. If any other setting applies to the database, change the config accordingly there as well. Otherwise, you are good to go.
![AMP2](https://cdn.discordapp.com/attachments/617491056652582953/1087711506352848937/IMG_7258.png)

Step 9: You have successfully linked your MySQL database to SELink. However, if you boot up SELink, you will still be greated with another fatal error: this time with a 401 Unauthorized Error. This is because TorchRemote, the torch plugin which allows AMP to function needs the bearer token. To retrieve the bearer token, either navigate to the TorchRemote.cfg file, or go to "Plugins" then "TorchRemote" in your server window. After which, you can copy the "Security Token" and paste it into the "TORCHREMOTE_TOKEN = YOURTOKENHERE= " configuration string (replacing the YOUR TOKEN HERE with the TorchRemote security token from the Torch Instance.<br>
<b>Security Warning: Do NOT share your TorchRemote Security Token with ANYONE! If an attacker gains access to the token, they can easily remotely control your server without your knowledge! You can always go into the TorchRemote.cfg file to change said token to any other value, and is recommended to do that every 1-2 months, just as a extra precaution, especially for larger servers and communities.</b>
![AMP3](https://cdn.discordapp.com/attachments/617491056652582953/1087715895310286908/IMG_7259.png)

Step 10: Now that you have linked up your TorchRemote token, you can now start linking up your TorchRemote API Address. This is usually set to 8080, and listener to Http.Sys. However, setting the listener to "Internal" will prevent crashes from occurring from the Torch Server. It is also recommended to change the port to something different for instance, 8000. Here is the recommended settings example:
![AMP4](https://cdn.discordapp.com/attachments/617491056652582953/1087720608428732526/IMG_7262.png)

Step 11: If your running SELink from the same box as the server, you would need to put in http://localhost:<your-torchremote-port>, not your box address. It is usually easier and more secure to keep AMP Running on the same box, as you don't have to port forward the API, preventing attackers from trying to attack the server.
TIP: If your running SELink from a separate server box from the server, you will need to make sure that the address is set to <b>the server's ip address+TorchRemote port.</b> For example: http://123.456.789.0:8000 as well has having the API port forwarded.
You can enter your address into the "TORCHREMOTE_ADDRESS = " Likewise, enter the same address into the "TORCHREMOTE_WEBSOCKET = " configuration string, but instead of having http://<yourip:port> it is ws://<yourip:port> 
![AMP5](https://cdn.discordapp.com/attachments/617491056652582953/1087720608160301056/IMG_7261.png)

You are almost done with setting up SELink! You just need to edit a few more settings:

Step 12: Go back into the configuration file, and find the "AMP_PORT = 6689" setting. This determines what port AMP is running off of, and what port should be forwarded as well. Edit this if you want to change the port on SELink.

Step 13: Start the AMP.bat file. You should see a message saying that "[INFO] SELink started on port 6687 (or whatever port you set it to)
If you don't encounter any issues, Congratulations! AMP is running.<br> Navigate to Your box address:the AMPPort to access it. (Make sure the SELink Port is Forwarded!) You will then be greeted by the login screen. The premade root users info is 
<br>Username: root<br>
Password: 123<br>
<b>It is recommended that you go into the program and create a new username with a stronger password and username. </b>


## Compatibility
SELink can be ran from any box. For instance: SELink can run on box 123.456.789:5000 but the server is on 888.888.888:27016.

It is not recommended to run SELink if you are running it through a server host and already have a control panel to control your SE Server.<br>
<b>Anything using TCAdmin will cause conflicts with both panels and if your running a server and the provider already has a control panel to control your SE Server from, it's recommended to just stick with the provided panel from the provider.</b><br>
This program is to allow servers that are running Space Engineers Torch on a Dedicated box, or their own server. On which they dont have their own panel.<br>

## Version 1.0 In Development 
I am currently developing SELink version 1.0. Because this is a big update, development may be a
bit slow. I plan on releasing it around New Years. Visit the SELink discord for more info.

Message @sam44 on discord if you have any questions.

<b>SELink is currently in BETA, and several features don't work, or are unstable! </b>

<br>Main (Stable branch): SELink v0.3-beta Build
<br>Staging (Unstable branch): SELink v0.2-beta Build
