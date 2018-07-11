const Discord = require('discord.js');
const colors = require('../data/colors');

module.exports = {
	name: 'reset',
	description: 'Resets the health and slap counts for all users on the server',
	args: false,
	guildOnly: true,
	modOnly: true,
	cooldown: 180,
	async execute(message, args, cache) {
		await cache.reset();
		message.channel.send(new Discord.RichEmbed({
			color: colors.green,
			description: 'All stats reset! Slaps away!',
		}));
	},
};