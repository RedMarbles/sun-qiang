// Main file for launching the bot

const Discord = require('discord.js');

const config = require('./config.json');
const { prefix } = config;

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith(prefix)) {
		const input = message.content.slice(prefix.length).trim();
		if (!input.length) return;
		const commandArgs = input.split(/ +/);
		const command = commandArgs.shift();

		console.log(`Command received: ${command}`);
		console.log(`Command arguments: [ ${commandArgs.join(' ; ')} ]`);
	}
});

client.login(config.token);