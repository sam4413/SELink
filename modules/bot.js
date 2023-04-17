const { Client, GatewayIntentBits } = require('discord.js');
//Config
require('dotenv').config({ path: '.env' })

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'goofy') {
		await interaction.reply('aaa');
	}
});

//console.log(process.env.BOT_TOKEN)
client.login(process.env.BOT_TOKEN);
