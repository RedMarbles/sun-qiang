// Main file for launching the bot

const DEFAULT_COOLDOWN = 3;
const DEFAULT_HEALTH = 100;
const DEFAULT_SLAPS = 5;
const DEFAULT_CHANNEL = 'faceslap';

const Discord = require('discord.js');

const fs = require('fs');

const config = require('./config.json');
const { prefix } = config;

const { Users } = require('./dbObjects');

const client = new Discord.Client();

// Caches the values of the users
const cache = new Discord.Collection();

// Helper methods using the cache
Reflect.defineProperty(cache, 'newUser', {
	value: async function newUser(id) {
		try {
			const user = await Users.create({ user_id: id, health: DEFAULT_HEALTH, slaps: DEFAULT_SLAPS });
			console.log('User creation successful');
			cache.set(id, user);
			return user;
		}
		catch(error) {
			console.log('newUser error');
			console.error(error);
		}
	},
});
Reflect.defineProperty(cache, 'addHealth', {
	value: async function addHealth(id, amount) {
		const user = cache.get(id) || await cache.newUser(id);
		if (user) {
			user.health += Number(amount);
			try {return user.save();}
			catch(error) {console.error('addhealth error');}
		}
		return console.error('Error - Could not find user');
	},
});
Reflect.defineProperty(cache, 'addSlaps', {
	value: async function addSlaps(id, amount) {
		const user = cache.get(id) || await cache.newUser(id);
		if (user) {
			user.slaps += amount;
			try {return user.save();}
			catch(error) {console.error('addSlaps error');}
		}
		return console.error('Error - Could not find user');
	},
});
Reflect.defineProperty(cache, 'getStats', {
	value: async function getStats(id) {
		const user = cache.get(id) || await cache.newUser(id);
		if (user) return { health: user.health, slaps: user.slaps };
		console.error('Error - Could not find user');
		return { health: 0, slaps: 0 };
	},
});
Reflect.defineProperty(cache, 'reset', {
	value: async function reset() {
		cache.forEach((user, id, map) => {
			user.health = DEFAULT_HEALTH;
			user.slaps = DEFAULT_SLAPS;
			try {user.save();}
			catch(error) {console.error('cache reset error');}
		});
	},
});

// Set up the message handler files
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Set up a cooldown timer
const cooldowns = new Discord.Collection();

client.on('ready', async () => {
	// Ready cache data
	const storedUsers = await Users.findAll();
	storedUsers.forEach(user => cache.set(user.user_id, user));
	console.log(`Found ${storedUsers.length} users in the existing database.`);

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
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

	// Execute the actual command
	try {
		command.execute(message, commandArgs, cache);
	}
	catch (error) {
		console.error(error);
		message.reply('Sun Qiang encountered an error while trying to execute that command.');
	}

	// if (command === 'role') {
	// 	message.channel.send(`Roles you have: \n${message.member.roles.map(r => r.name).join('\n')}`);
	// }
});

client.login(config.token);