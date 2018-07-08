const Discord = require('discord.js');

const { occupations, attributes } = require('../data/occupations');
const colors = require('../data/colors');

const DEFAULT_DAMAGE = 10;

module.exports = {
	name: 'faceslap',
	description: 'Launch a humiliating attack against another cultivator',
	args: true,
	usage: '<user>',
	aliases: ['slap', 'face'],
	guildOnly: true,
	cooldown: 4,
	async execute(message, args, cache) {
		const target = message.mentions.members.first();
		if(!target) {
			return message.reply('This command requires you to mention a target user');
		}

		const validRoles = occupations.map(occ => occ.name);
		const userRole = message.member.roles.find(r => validRoles.includes(r.name)) || { name: 'Unemployed' };
		const targetRole = target.roles.find(r => validRoles.includes(r.name)) || { name: 'Unemployed' };

		const userStats = await cache.getStats(message.member.id);
		const targetStats = await cache.getStats(target.id);

		if (userStats.health < 1) {
			return message.channel.send(new Discord.RichEmbed({
				color: colors.red,
				description: `Sorry **${message.member.displayName}**, but your health is currently ${userStats.health}. You're too weak to fight.`,
			}));
		}
		if (userStats.slaps < 1) {
			return message.channel.send(new Discord.RichEmbed({
				color: colors.red,
				description: `Sorry **${message.member.displayName}**, but you've used up all your slaps for the day.`,
			}));
		}
		if (targetStats.health < 1) {
			return message.channel.send(new Discord.RichEmbed({
				color: colors.red,
				description: `**${target.displayName}** has already been knocked senseless. There's no point beating a dead horse.`,
			}));
		}

		// Calculate damage dealt
		const matchup = attributes.find(att => (att.user === userRole.name) && (att.target === targetRole.name));
		const multiplier = (matchup) ? matchup.multiplier : 1.0;
		const damage = Math.floor(DEFAULT_DAMAGE * multiplier);
		await cache.addStats(target.id, {health: -damage});
		await cache.addStats(message.member.id, {slaps: -1});

		let output = `*${userRole.name}* **${message.member.displayName}** brutally faceslapped *${targetRole.name}* **${target.displayName}**, dealing **${damage}** damage.`;
		output += `\n${target.displayName} has **${targetStats.health} HP** remaining.`;
		output += `\n${message.member.displayName} has **${userStats.slaps}** slaps remaining for the day.`;
		message.channel.send(new Discord.RichEmbed({ 
			color: colors.yellow, 
			title: 'Faceslap!', 
			description: output, }));
	},
};