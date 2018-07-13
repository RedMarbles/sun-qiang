// Main file for launching the bot

const DEFAULT_COOLDOWN = 3;
const DEFAULT_CHANNEL = 'faceslap';

// The Discord API
const Discord = require('discord.js');

// The Node.js fileserver library
const fs = require('fs');

const config = require('./config.json');
const { prefix } = config;

const { cache } = require('./dbObjects');

// const colors = require('./data/colors.js');

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
// const occupationFiles = fs.readdirSync('./data/occupations').filter(file => file.endsWith('.js'));
// Directly specify the files so that the order of occupations is preserved
const occupationFiles = [ 'Cultivation.js',
	// 'Master Teacher.js',
	'Apothecary.js',
	// 'Physician',
	// 'Beast Tamer',
	// 'Formation Master',
	// 'Soul Oracle',
	// 'Celestial Designer',
	// 'Poison Master',
	// 'Painter',
	'Demonic Tunist',
	// 'Blacksmith',
	// 'Tea Master',
];
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

// Function to periodically update stamina and health of everyone
const update = async function() {
	const promises = [];
	cache.forEach((element, id) => {
		promises.push(cache.addStats(id, { health: config.update_health, stamina: config.update_stamina, slaps: 5 - element.user.slaps }));
	});
	await Promise.all(promises);
	setTimeout(update, config.update_delay * 1000);
};

// Set up a cooldown timer
const cooldowns = new Discord.Collection();

client.on('ready', async () => {
	// Ready cache data
	await cache.init();
	cache.client = client;
	console.log('Cache initialized');

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.channel.name.startsWith(DEFAULT_CHANNEL) && message.channel.type !== 'dm') {
		return message.channel.send(`Sorry, Sun Qiang will only reply on the ${DEFAULT_CHANNEL} channels`);
	}

	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const commandArgs = input.split(/ +/);
	const commandName = commandArgs.shift();

	// Find correct command file while considering aliases
	const command = client.commands.get(commandName)
		|| client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	// Check if the command is a server-only command
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.channel.send('Sorry, this command can only be used in a server text channel');
	}

	// Check if the command can only be used by a moderator or admin
	if (command.modOnly && message.author.tag !== 'TribeOfOne#4217') {
		return message.channel.send('Sorry, this command can only be used by the owner of this bot');
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
			return (await message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`))
				.delete(Math.max(expirationTime - now, 2000));
		}
		// User is not on cooldown, but their entry wasn't deleted yet
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// Check if user has a role yet
	const role = cache.getRole(message.member);
	// Make sure the user has the default skill for the current class
	if (role) await cache.defaultSkill(message.member, message.channel, role.name);
	await cache.defaultSkill(message.member, message.channel, 'Cultivation');

	// Execute the actual command
	try {
		command.execute(message, commandArgs, cache);
	}
	catch (error) {
		console.error(error);
		message.reply('Sun Qiang encountered an error while trying to execute that command.');
	}
});

client.login(config.token).catch(console.error);

update();