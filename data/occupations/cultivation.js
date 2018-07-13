const { RichEmbed } = require('discord.js');
const colors = require('../colors.js');

module.exports = {
	name: 'Cultivation',
	// The folder name inside which the skills are stored
	folder: 'cultivation',
	// A description of the occupation
	description: 'The basic cultivation of the character, defined as their progress on the path to immortality.',
	// The most basic skill which is automatically learned upon switching to the occupation
	default_skill: 'cultivate',
	// The levels and their exp requirements of the occupation
	exp_levels: [
		{ level: 0, name: 'Mortal Cultivator', exp: 5 },
		{ level: 1, name: '1-dan Fighter - Juxi realm', exp: 25 },
		{ level: 2, name: '2-dan Fighter - Dantian realm', exp: 75 },
		{ level: 3, name: '3-dan Fighter - Zhenqi realm', exp: 200 },
		{ level: 4, name: '4-dan Fighter - Pigu realm', exp: 500 },
		{ level: 5, name: '5-dan Fighter - Dingli realm', exp: 1000 },
		{ level: 6, name: '6-dan Fighter - Pixue realm', exp: 72000 },
		{ level: 7, name: '7-dan Fighter - Tongxuan realm', exp: 2000000 },
		{ level: 8, name: '8-dan Fighter - Zongshi realm', exp: 12000000 },
		{ level: 9, name: '9-dan Fighter - Zhizun realm', exp: 9e16 },
	],
	// The names of the skills under this occupation
	skills: [
		// Level 0 - Mortal
		'cultivate',
		// Level 1 - Juxi
		// 'simple_punch',
		// 'innate_breathing',
		// Level 2 - Dantian
		// 'enhanced_stamina',
		// 'focus_energy',
		// 'halo_of_hostility' - (passive) every time you perform an action involving another player, you are likely to aggravate them and initiate combat. Grants bonus EXP and extra chance to succeed in subsequent skills.
	],
	// Checks if the user is eligible to level up
	canLevelUp(message, cache) {
		const element = cache.get(message.member.id);
		const exp = element.occupations.get('Cultivation').experience;
		const level = element.occupations.get('Cultivation').level;

		const requirements = [];

		if ((level < 18) && (exp >= this.exp_levels[level].exp)) {
			// cache.addStats(message.member.id, { health_max: 20, stamina_max: 4 });
			// message.channel.send(new RichEmbed({
			// 	color: colors.blue,
			// 	title: `${message.member.displayName}, you have permanently gained stats`,
			// 	description: 'Max Health: +20 HP'
			// 		+ '\nMax Stamina: +4 SP',
			// }));
			return true;
		}

		message.channel.send(new RichEmbed({
			color: colors.darkblue,
			title: 'Bottleneck Ahoy!',
			description: `${message.member.displayName}, you've reached a bottleneck in your progression along the path of Cultivation. The requirements to pass the bottleneck are:`,
		}).addField('Requirements', requirements.join('\n'), true));
		return false;
	},
};