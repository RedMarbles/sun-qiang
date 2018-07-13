const { RichEmbed } = require('discord.js');
const colors = require('../colors.js');

module.exports = {
	name: 'Apothecary',
	// The folder name inside which the skills are stored
	folder: 'apothecary',
	// A description of the occupation
	description: 'Gathers herbs to concoct into pills. Sub-occupations include herbologists and pill demons.',
	// The most basic skill which is automatically learned upon switching to the occupation
	default_skill: 'gather_herbs',
	// The levels and their exp requirements of the occupation
	exp_levels: [
		{ level: 0, name: 'Apprentice Apothecary', exp: 10 },
		{ level: 1, name: '1-star Apothecary', exp: 50 },
		{ level: 2, name: '2-star Apothecary', exp: 300 },
		{ level: 3, name: '3-star Apothecary', exp: 1500 },
		{ level: 4, name: '4-star Apothecary', exp: 9000 },
		{ level: 5, name: '5-star Apothecary', exp: 55000 },
		{ level: 6, name: '6-star Apothecary', exp: 325000 },
		{ level: 7, name: '7-star Apothecary', exp: 2000000 },
		{ level: 8, name: '8-star Apothecary', exp: 12000000 },
		{ level: 9, name: '9-star Apothecary', exp: 9e16 },
	],
	// The names of the skills under this occupation
	skills: [
		// Level 0
		'gather_herbs',
		// Level 1
		'forge_pill',
		'refine_herb',
		// Level 2
		'plant_herb',
	],
	// Checks if the user is eligible to level up
	canLevelUp(message, cache) {
		const element = cache.get(message.member.id);
		const exp = element.occupations.get('Apothecary').experience;
		const level = element.occupations.get('Apothecary').level;

		const requirements = [];

		if ((level < 9) && (exp >= this.exp_levels[level].exp)) {
			return true;
		}

		message.channel.send(new RichEmbed({
			color: colors.darkblue,
			title: 'Bottleneck Ahoy!',
			description: `${message.member.displayName}, you've reached a bottleneck in your progression along the path of the Apothecary. The requirements to pass the bottleneck are:`,
		}).addField('Requirements', requirements.join('\n'), true));
		return false;
	},
};