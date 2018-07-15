const { RichEmbed } = require('discord.js');
const colors = require('../colors.js');

module.exports = {
	name: 'Painter',
	// The folder name inside which the skills are stored
	folder: 'painter',
	// A description of the occupation
	description: 'Paints pictures and uses calligraphy to summon various effects into the world',
	// The most basic skill which is automatically learned upon switching to the occupation
	default_skill: 'paint',
	// The levels and their exp requirements of the occupation
	exp_levels: [
		{ level: 0, name: 'Apprentice Painter', exp: 10 },
		{ level: 1, name: '1-star Painter', exp: 50 },
		{ level: 2, name: '2-star Painter', exp: 300 },
		{ level: 3, name: '3-star Painter', exp: 1500 },
		{ level: 4, name: '4-star Painter', exp: 9000 },
		{ level: 5, name: '5-star Painter', exp: 55000 },
		{ level: 6, name: '6-star Painter', exp: 325000 },
		{ level: 7, name: '7-star Painter', exp: 2000000 },
		{ level: 8, name: '8-star Painter', exp: 12000000 },
		{ level: 9, name: '9-star Painter', exp: 9e16 },
	],
	// The names of the skills under this occupation
	skills: [
		// Level 0
		'paint',
		// Level 1
		// mix_colors
		// Level 2
		// ??
	],
	// Checks if the user is eligible to level up
	canLevelUp(message, cache) {
		const element = cache.get(message.member.id);
		const exp = element.occupations.get('Painter').experience;
		const level = element.occupations.get('Painter').level;

		const requirements = [];

		if ((level < 9) && (exp >= this.exp_levels[level].exp)) {
			return true;
		}

		message.channel.send(new RichEmbed({
			color: colors.darkblue,
			title: 'Bottleneck Ahoy!',
			description: `${message.member.displayName}, you've reached a bottleneck in your progression along the path of the Painter. The requirements to pass the bottleneck are:`,
		}).addField('Requirements', requirements.join('\n'), true));
		return false;
	},
};