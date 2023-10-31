//Modules
var jp = require('jsonpath');
//Config
require('dotenv').config();

//Local Files

// Console formatting
const notify = require("../../../../functions/notify.js");

//server
const serverSystem = require('../../../../functions/server/serverSystem.js');
const playerSystem = require('../../../../functions/players/playerSystem.js');

const { randomInt } = require('crypto');
const { json } = require('stream/consumers');

const { SlashCommandBuilder } = require('discord.js');

notify.notify(1, "Command 'status.js' Initialized")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get the server status!'),
	async execute(interaction) {
		await interaction.reply("Please wait, retrieving info...")
		notify.notify(3,"Retrieving statistics from server.")
			//Get all relavent information.
			var serversettings = await(serverSystem.getSettings())
			var serverstats = await(serverSystem.getStatus())
			var serverplayers = await(playerSystem.getAllPlayers())
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

			await interaction.reply({ embeds: [embed] })
	},
};