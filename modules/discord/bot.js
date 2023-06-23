//Modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const RateLimit = require('express-rate-limit');
const e = require('express');
const fs = require('fs')
const { jsonrepair } = require('jsonrepair')
const WebSocket = require('ws')
var jp = require('jsonpath');
var JSONbig = require('json-bigint');
var sqlEscape = require('sql-escape');
var randomstring = require("randomstring");
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
var moment = require('moment')

//Config
require('dotenv').config();
//Local Files

// Console formatting
const notify = require("../../functions/notify.js");/*
const getInstalledPlugins = require('../../functions/getInstalledPlugins.js');
const getRootKeys = require('../../functions/getRootKeys.js');
//steam
const getSteamPlayerSummaries = require('../../functions/steam/getSteamPlayerSummaries.js');
*/
//chat
const postInvokeCommand = require('../../functions/chat/postInvokeCommand.js')
const postSendChatMessage = require('../../functions/chat/postSendChatMessage.js')
/*
//logs 
const websocketChat = require('./events/DBwebsocketChat.js')
const websocketLogs = require('./functions/DBwebsocketLogs.js')
//plugins
const deletePlugin = require('../../functions/plugins/deletePlugin.js')
const getAllPlugins = require('../../functions/plugins/getAllPlugins.js')
const putPlugin = require('../../functions/plugins/putPlugin.js')
  //plugins download
  const getPluginsDownloadsAll = require('../../functions/plugins/downloads/getPluginsDownloadsAll.js')
//server
const getHeartbeat = require('../../functions/server/getHeartbeat.js');
*/const getSettings = require('../../functions/server/getSettings.js');
const getStatus = require('../../functions/server/getStatus.js');/*
const postSettings = require('../../functions/server/postSettings.js');
const postStart = require('../../functions/server/postStart.js');
const postStop = require('../../functions/server/postStop.js');*/
const getAllPlayers = require('../../functions/players/getAllPlayers.js');
/*const getAllBannedPlayers = require('../../functions/players/getAllBannedPlayers.js')
const postBanPlayer = require('../../functions/players/postBanPlayer.js');
const postKickPlayer = require('../../functions/players/postKickPlayer.js');
const postPromotePlayer = require('../../functions/players/postPromotePlayer.js');
const postDemotePlayer = require('../../functions/players/postDemotePlayer.js');
const postDisconnectPlayer = require('../../functions/players/postDisconnectPlayer.js');
const postUnbanPlayer = require('../../functions/players/postUnbanPlayer.js');
//settings
const getTorchValues = require("../../functions/settings/getTorchValues.js")
const getTorchSchema = require("../../functions/settings/getTorchSchema.js")
const getTorchSettings = require("../../functions/settings/getTorchSettings.js")
const patchTorchValues = require("../../functions/settings/patchTorchValues.js")
*/
const { randomInt } = require('crypto');
const { json } = require('stream/consumers');
const { guildId, clientId } = require('./config.json');



const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');

//Discord
const embedManager = require("./functions/embeds/embedManager.js")

//const websocketChat = require('./events/DBwebsocketChat');
//const { token } = require('./config.json');

const client = new Client({ intents: [
	GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.DirectMessageReactions, 
	GatewayIntentBits.GuildEmojisAndStickers
] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		notify.notify(2,`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
var chanid = `${process.env.CHAT_LOGGING_ID}`;
console.log(chanid)


client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	await client.channels.cache.get(chanid).send(':globe_with_meridians: **Initializing AMPLink Discord Bridge...**');
	async function connect() {
		try {
		  const token = `${process.env.TORCHREMOTE_TOKEN}`;
		  var ws = new WebSocket(`${process.env.TORCHREMOTE_WEBSOCKET}/api/live/chat`, {headers: {Authorization: `Bearer ${token}`}})
		  var consoleconf = `${process.env.WSM_LOGGING}`
		  notify.notify(1, "[AMPLink Discord Websockets]: Connecting to server chat...")
		  await client.channels.cache.get(chanid).send(`:desktop:  <-- :electric_plug: **Connecting to server chat...**`);
		  ws.on('open', function open() {
		try {
		  client.channels.cache.get(chanid).send(`:white_check_mark: **Connected to server chat. Waiting for messages...**`);
			  //if (err) throw err;
			  notify.notify(1, '[AMPLink Discord Websockets]: Established websocket connection with server.');
			  //connect()
		  } catch(err) {
			notify.notify(3, '[AMPLink Discord Websockets]: ',err);
			client.channels.cache.get(chanid).send(`:warning: **An error occured:** ${err}`);
		  }
		});
		
		  
		  ws.on('message', function message(wsdata) {
			try { 
			var parsed = JSONbig.parse(wsdata);
			var msg = parsed.message;
			var channel = parsed.channel;
			var time = moment.utc(parsed.time);
			var authorname = parsed.authorName;
			var date = moment(time).format('HH:mm:ss.SSSS');
			var logger = JSONbig.stringify(parsed.author);
			//notify.notify(1, wsdata)
			
			preventping = msg.includes("<@") || msg.includes("@here") || msg.includes("@everyone");
			
			if (preventping == true) {
				notify.notify(2,"User attempted to ping another!")
				return;
			} else {
				client.channels.cache.get(chanid).send(`:rocket:**${authorname}:** ${msg}`);
			}

			
		
		
			if (channel == 1) {
				if (consoleconf == 'true') {
				  notify.notify(1, `${time} ${authorname}: ${msg}`);
				} else if (consoleconf == 'false') {
				  if (err) notify.notify(3, err); 
				}
			} else {
				if (consoleconf == 'true') {
				  notify.notify(1, `${time} ${authorname}: ${msg}`);
				} else if (consoleconf == 'false') {
				  if (err) notify.notify(3, err); 
				}
			}
			
			
		  } catch (err) {
			notify.notify(3, '[AMPLink Discord Websockets]: ',err);
		    client.channels.cache.get(chanid).send(`:warning: **An error occured:** ${err}`);
		  }
		  });
		  
		  
		  ws.on('error', async (err) => {
			try {
			if (err.code === 'ECONNREFUSED') {
			  notify.notify(3, '[AMPLink Discord Websockets]: Connection refused. Please check the server is running and the port is correct.');
			  await client.channels.cache.get(chanid).send(`:no_entry: **$Connection refused. Please check the server is running and the port is correct.**`);
			  ws.terminate();
				if (err) notify.notify(3, '[AMPLink Discord Websockets]: ',err);
				//console.log('Connecting to server logs & clearing data...');
				//connect()
			  setTimeout(() => {
				notify.notify(2, '[AMPLink Discord Websockets]: Reconnecting...');
				connect()
			  }, process.env.WSM_RECONNECT_INTERVAL);
			} else {
			  notify.notify(3, '[AMPLink Discord Websockets]: ',err);
			  await client.channels.cache.get(chanid).send(`:warning: **An error occured:** ${err}`);
			}
		  } catch(err) {
			notify.notify(3, '[AMPLink Discord Websockets]: ',err);
			await client.channels.cache.get(chanid).send(`:warning: **An error occured:** ${err}`);
		  }
		  });
		
			ws.on('close', async function close() {
			  try {
				
				notify.notify(2, "[AMPLink Discord Websockets]: Connection to server chat has been lost. Attempting to reconnect...")
				await client.channels.cache.get(chanid).send(`:warning: **Connection refused. Please check the server is running and the port is correct.**`);
			  
			  setTimeout(async () => {
				
				await client.channels.cache.get(chanid).send(`:desktop:  <-- :electric_plug: **Attempting to reconnect...**`);
				notify.notify(2, '[AMPLink Discord Websockets]: Reconnecting...');
				ws.terminate();
				connect()
			  }, process.env.WSM_RECONNECT_INTERVAL);
		} catch(err) {
		  notify.notify(3, '[AMPLink Discord Websockets]: ',err);
		  await client.channels.cache.get(chanid).send(`:warning: **An error occured:** ${err}`);
		}
		});
		
		} catch(err) {
		  notify.notify(3, '[AMPLink Discord Websockets]: ',err);
		  await client.channels.cache.get(chanid).send(`:warning: **An error occured:** ${err}`);
		}
	
	  }
	  connect()
})






//								//
// 		 Events Handler 		//
//								//



//Websockets 
client.on('messageCreate', async message => {

    if (message.channelId != chanid) return; //only check chanid
	if (message.author.bot) return; //prevent bot

	//await notify.notify(3,message.content)
	message.react('✅');
	postSendChatMessage.postSendChatMessage(message.content,"[Discord] "+message.author.username,1)
	//notify.notify(3,'success')
})

//Help
client.on('messageCreate', async message => {
    //if (message.channelId != chanid) return; //only check chanid
	if (message.author.bot) return; //prevent bot

	if (message.content == `${process.env.BOT_PREFIX}help`) {
		if (process.env.help == 'true') {

			const embed = new EmbedBuilder()
			.setColor(`${process.env.EMBED_COLOR}`)
			.setTitle(`**Help**`)
			.setDescription(`;help - Shows this page
			;start - Starts the Space Engineers server
			;stop - Stop the Space Engineers server
			;restart - Restart the Space Engineers server
			;command <command> - Send a command to the server
			;amprestart - Restarts the AMPLink Discord Bridge module
			;ping - Show bot ping
			;status - Show the current status and connected players of the server.`)
			.setFooter({ text: `${process.env.FOOTER_CONTENT}` });

			await client.channels.cache.get(message.channelId).send({ embeds: [embed] });

		} else {
			return;
		}
	}
})


//Status
client.on('messageCreate', async message => {
    //if (message.channelId != chanid) return; //only check chanid
	if (message.author.bot) return; //prevent bot

	if (message.content == `${process.env.BOT_PREFIX}status`) {
		if (process.env.status == 'true') {
			client.channels.cache.get(message.channelId).send("Please wait, retrieving info...");
			notify.notify(3,"Retrieving statistics from server.")
			//Get all relavent information.
			var serversettings = await(getSettings.getSettings())
			var serverstats = await(getStatus.getStatus())
			var serverplayers = await(getAllPlayers.getAllPlayers())
			serversettings = JSON.parse(serversettings)
			serverstats = JSON.parse(serverstats)
			serverplayers = JSON.parse(serverplayers)

			// Process data
			var names = jp.query(serverplayers, '$..name').join('\n');
			var levels = jp.query(serverplayers, '$..promoteLevel');
			var levelWords = levels.map(function(level) {
			if (level == 0) {return 'PLAYER';} else 
			if (level == 1) {return 'SCRIPTER';} else 
			if (level == 2) {return 'OBSERVER';} else 
			if (level == 3) {return 'SPACE_MASTER';} else 
			if (level == 4) {return 'ADMINISTRATOR';} else 
			if (level == 5) {return 'OPERATOR';} else 
			{return 'Cannot be determined.';}
			});
			var level = levelWords.join('\n');


			var sim = jp.query(serverstats, '$.simSpeed')
			var uptime = jp.query(serverstats, '$.uptime')
			var status = jp.query(serverstats, '$.status')
			if (status == 0) {status = "Stopped"} else
			if (status == 1) {status = "Starting"} else
			if (status == 2) {status = "Running"} else
			if (status == 3) {status = "Crashed"} else
			{status = "Cannot be determined."}
			var memCount = jp.query(serverstats, '$.memberCount')
			var memLimit = jp.query(serversettings, '$.memberLimit')
			var serverName = jp.query(serversettings, '$.serverName')
			var address = jp.query(serversettings, '$.listenEndPoint.ip')+":"+jp.query(serversettings, '$.listenEndPoint.port') 

			

			const embed = new EmbedBuilder()
			.setColor(`${process.env.EMBED_COLOR}`)
			.setTitle(`**${serverName}**`)
			.addFields({ name: '**__Server Status:__**', value: `Current Players: **${memCount}/${memLimit}**
			Sim Speed: **${sim}**
			Server Status: **${status}**
			Server Uptime: **${uptime}**
			`})
			.addFields(
				{ name: 'Connected Players', value: `${names}`, inline: true },
				//{ name: 'Player Level', value: `${level}`, inline: true },
			)
			.addFields({ name: 'Server Address', value: `${address}`})
			.setTimestamp()
			.setFooter({ text: `${process.env.FOOTER_CONTENT}` });

			client.channels.cache.get(message.channelId).send({ embeds: [embed] });
		} else {
			return;
		}
	}
})


//Status
client.on('messageCreate', async message => {
    //if (message.channelId != chanid) return; //only check chanid
	if (message.author.bot) return; //prevent bot

	if (message.content == `${process.env.BOT_PREFIX}amprestart`) {
		if (process.env.amprestart == 'true') {
			if (message.member.permissions.has("ADMINISTRATOR") == true) {
				const embed = new EmbedBuilder()
				.setColor(`${process.env.EMBED_COLOR_SUCCESS}`)
				.setTitle(`**Restarting AMPLink Discord Module**`)
				.setDescription(`Bot may experience a period of breif inactivity for approximatly 30 seconds.`)
				.setFooter({ text: `${process.env.FOOTER_CONTENT}` });

				await client.channels.cache.get(message.channelId).send({ embeds: [embed] });
				notify.notify(4,`${message.author.id} executed manual restart.`)
			} else {
				const embed = new EmbedBuilder()
				.setColor(`${process.env.EMBED_COLOR_FAILURE}`)
				.setTitle(`**Error: Insufficent permissions.**`)
				.setDescription(`You do not have the adequate permissions to preform this task.`)
				.setFooter({ text: `${process.env.FOOTER_CONTENT}` });

				client.channels.cache.get(message.channelId).send({ embeds: [embed] });
			}

			
		} else {
			return;
		}
	}
})

//Ping
client.on('messageCreate', async message => {
    //if (message.channelId != chanid) return; //only check chanid
	if (message.author.bot) return; //prevent bot

	if (message.content == `${process.env.BOT_PREFIX}ping`) {
		if (process.env.ping == 'true') {

			const embed = new EmbedBuilder()
			.setColor(`${process.env.EMBED_COLOR}`)
			.setTitle(`**Bot Ping**`)
			.setDescription(`Current ping is **${Date.now() - message.createdTimestamp}ms** with **${Math.round(client.ws.ping)}ms** of latency.`)
			.setFooter({ text: `${process.env.FOOTER_CONTENT}` });

			await client.channels.cache.get(message.channelId).send({ embeds: [embed] });

		} else {
			return;
		}
	}
})



//								//
// 		 	Run AMP DB	 		//
//								//
client.login(process.env.BOT_TOKEN);

