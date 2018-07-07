const { occupations, attributes } = require('../data/occupations');

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

		let output = `> Username: ${target.displayName}`;
		output += `\n> Occupation: ${role.name}`;
		output += `\n> Health: ${health} HP`;
		output += `\n> Slap Ammunition: ${slaps} slaps`;
		output += '\n> Offensive multipliers:';
		let countOff = 0;
		attributes.forEach(att => {
			if (att.user === role.name) {
				output += `\n    ${att.multiplier.toFixed(1)} vs ${att.target}s`;
				countOff += 1;
			}
		});
		if (!countOff) output += '\n    N/A';
		output += '\n> Defensive multipliers:';
		let countDef = 0;
		attributes.forEach(att => {
			if (att.target === role.name) {
				output += `\n    ${att.multiplier.toFixed(1)} from ${att.user}s`;
				countDef += 1;
			}
		});
		if (!countDef) output += '\n    N/A';
		message.channel.send(output, { code: true });
	}
};