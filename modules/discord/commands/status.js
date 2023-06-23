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
const notify = require("../../../functions/notify.js");
//steam
const getSteamPlayerSummaries = require('../../../functions/steam/getSteamPlayerSummaries.js');

//chat
const postInvokeCommand = require('../../../functions/chat/postInvokeCommand.js')
const postSendChatMessage = require('../../../functions/chat/postSendChatMessage.js')

//server
const getHeartbeat = require('../../../functions/server/getHeartbeat.js');
const getSettings = require('../../../functions/server/getSettings.js');
const getStatus = require('../../../functions/server/getStatus.js');
const postSettings = require('../../../functions/server/postSettings.js');
const postStart = require('../../../functions/server/postStart.js');
const postStop = require('../../../functions/server/postStop.js');
const getAllPlayers = require('../../../functions/players/getAllPlayers.js');
const getAllBannedPlayers = require('../../../functions/players/getAllBannedPlayers.js')
const postBanPlayer = require('../../../functions/players/postBanPlayer.js');
const postKickPlayer = require('../../../functions/players/postKickPlayer.js');
const postPromotePlayer = require('../../../functions/players/postPromotePlayer.js');
const postDemotePlayer = require('../../../functions/players/postDemotePlayer.js');
const postDisconnectPlayer = require('../../../functions/players/postDisconnectPlayer.js');
const postUnbanPlayer = require('../../../functions/players/postUnbanPlayer.js');

const { randomInt } = require('crypto');
const { json } = require('stream/consumers');

const { SlashCommandBuilder } = require('discord.js');

notify.notify(1, "Command 'status.js' Initialized")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('View the server status!'),
	async execute(interaction) {
		await interaction.reply('Command recieved!');
	},
};