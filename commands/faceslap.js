const occupations = require('../data/occupations');

module.exports = {
	name: 'faceslap',
	description: 'Launch a humiliating attack against another cultivator',
	args: true,
	usage: '<user>',
	aliases: ['slap'],
	guildOnly: true,
	cooldown: 4,
	execute(message, args, cache) {
		const target = message.mentions.members.first();
		if(!target) {
			return message.reply('This command requires you to mention a target user');
		}

		const userRole = message.member.roles.find(r => occupations.includes(r.name));
		const targetRole = target.roles.find(r => occupations.includes(r.name));

		message.channel.send(`${userRole.name} ${message.member} faceslapped ${targetRole.name} ${target}`);
	},
};