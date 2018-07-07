const Discord = require('discord.js');

const { occupations, attributes } = require('../data/occupations');
const colors = require('../data/colors');

module.exports = {
	name: 'info',
	description: 'Tells you about the health and remaining handly ammunition possessed by you / another cultivator, as well as your damage multipliers',
	args: false,
	usage: '[@user]',
	aliases: ['status'],
	guildOnly: true,
	cooldown: 10,
	async execute(message, args, cache) {
		const target = message.mentions.members.first() || message.member;
		const role = target.roles.find(r => occupations.map(occ => occ.name).includes(r.name));
		const { health, slaps } = await cache.getStats(target.id);

		const embed = new Discord.RichEmbed({ 
			color: colors.gray,
		});
		embed.setThumbnail(target.user.displayAvatarURL);
		// let output = `> Username: ${target.displayName}`;
		embed.addField('Username', target.displayName, true);
		// output += `\n> Occupation: ${role.name}`;
		embed.addField('Occupation', role.name, true);
		// output += `\n> Health: ${health} HP`;
		embed.addField('Health', `${health} HP`, true);
		// output += `\n> Slap Ammunition: ${slaps} slaps`;
		embed.addField('Ammunition', `${slaps} slaps`, true);

		// output += '\n> Offensive multipliers:';
		const offenseMultpliers = [];
		attributes.forEach(att => {
			if (att.user === role.name) {
				offenseMultpliers.push(`${att.multiplier.toFixed(1)} vs ${att.target}s`);
			}
		});
		if (!offenseMultpliers.length) offenseMultpliers.push('N/A');
		embed.addField('Offensive Multipliers', offenseMultpliers.join('\n'), true);

		// output += '\n> Defensive multipliers:';
		const defensiveMultipliers = [];
		attributes.forEach(att => {
			if (att.target === role.name) {
				defensiveMultipliers.push(`${att.multiplier.toFixed(1)} from ${att.user}s`);
			}
		});
		if (!defensiveMultipliers.length) defensiveMultipliers.push('N/A');
		embed.addField('Defensive Multipliers', defensiveMultipliers.join('\n'), true);
		
		// message.channel.send(output, { code: true });
		message.channel.send(embed);
	}
};