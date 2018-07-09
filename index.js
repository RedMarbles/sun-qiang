// Main file for launching the bot

const DEFAULT_COOLDOWN = 3;
const DEFAULT_HEALTH = 100;
const DEFAULT_SLAPS = 5;
const DEFAULT_CHANNEL = 'faceslap';

// The Discord API
const Discord = require('discord.js');

// The Node.js fileserver library
const fs = require('fs');

const config = require('./config.json');
const { prefix } = config;

const { cache, Users, Occupations } = require('./dbObjects');

const client = new Discord.Client();

// Set up the command handler files
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Set up the occupation and skill handler files
client.occupations = new Discord.Collection();
client.skills = new Discord.Collection();
const occupationFiles = fs.readdirSync('./data/occupations').filter(file => file.endsWith('.js'));
for (const occFile of occupationFiles) {
	const occupation = require(`./data/occupations/${occFile}`);
	client.occupations.set(occupation.name, occupation);
	console.log(`Loaded occupation: ${occupation.name}`);

	const skillFiles = fs.readdirSync(`./data/occupations/${occupation.folder}`).filter(file => file.endsWith('.js'));
	for (const skillFile of skillFiles) {
		const skill = require(`./data/occupations/${occupation.folder}/${skillFile}`);
		client.skills.set(skill.name, skill);
		console.log(`Loaded skill: ${skill.name}`);
	}
}

// Set up a cooldown timer
const cooldowns = new Discord.Collection();

client.on('ready', async () => {
	// Ready cache data
	await cache.init();

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	if (message.channel.name !== DEFAULT_CHANNEL && message.channel.type !== 'dm') {
		return message.channel.send(`Sorry, Sun Qiang will only reply on the ${DEFAULT_CHANNEL} channel`);
	}

	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const commandArgs = input.split(/ +/);
	const commandName = commandArgs.shift();

	// Find correct commad file while considering aliases
	const command = client.commands.get(commandName)
		|| client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	// Check if the command is a server-only command
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.channel.send('Sorry, this command can only be used in a server text channel');
	}

	// Check if the command requires arguments
	if (command.args && !commandArgs.length) {
		let reply = 'This command needs arguments!';
		if (command.usage) {
			reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// Check and set cooldowns for the command
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || DEFAULT_COOLDOWN) * 1000;
	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
		// User is still on cooldown
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`);
		}
		// User is not on cooldown, but their entry wasn't deleted yet
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// Make sure the user has the default skill for the current class
	await cache.defaultSkill(message.member, message.channel);

	// Execute the actual command
	try {
		command.execute(message, commandArgs, cache);
	}
	catch (error) {
		console.error(error);
		message.reply('Sun Qiang encountered an error while trying to execute that command.');
	}
});

client.login(config.token);