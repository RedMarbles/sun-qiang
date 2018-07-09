const Discord = require('discord.js');

const { occupations } = require('../data/occupations');
const colors = require('../data/colors');
const { prefix } = require('../config');

function changeRole(oldRole, newRole, message) {
	if (!newRole) {
		return message.channel.send('Sorry, this server doesn\'t seem to have that role available.');
	}
	if (oldRole) {
		message.member.removeRole(oldRole.id);
	}
	message.member.addRole(newRole.id);
	message.channel.send(new Discord.RichEmbed({ color: colors.gray, description: `${message.author} has become a **${newRole.name}**!` }));
	return true;
}

function findOccupation(input, message) {
	const newOccupation = occupations.find(occ => (input === occ.name.toLowerCase()) || occ.alias.map(a => a.toLowerCase()).includes(input));
	if (!newOccupation) return message.reply(`Sorry, I couldn't find an occupation that matches '${input}'`);
	return message.guild.roles.find(r => r.name === newOccupation.name);
}

module.exports = {
	name: 'role',
	description: 'Switch roles for the user',
	args: false,
	usage: '[role]',
	aliases: [],
	guildOnly: true,
	cooldown: 5,
	async execute(message, args, cache) {
		// Extact the current occupation of the user, or set as 'Unemployed' if no role is found
		const oldRole = message.member.roles.find(r => occupations.map(occ => occ.name).includes(r.name)) || { name: 'Unemployed' };
		let newRole = undefined;

		await cache.defaultSkill(message.member, message.channel);

		// If there was an argument, compare against the occupations and aliases to find the correct new occupation
		if (args.length) {
			newRole = findOccupation(args.join(' ').toLowerCase(), message);
			changeRole(oldRole, newRole, message);
			await cache.defaultSkill(message.member, message.channel);
		}
		// If there was no argument, provide a list of occupations to choose from
		else {
			const output = [];
			let count = 1;
			occupations.forEach(occ => {
				output.push(`**${count}.** ${occ.name}   [ ${occ.alias.join(', ')} ]`);
				count += 1;
			});
			const listEmbed = new Discord.RichEmbed({ color: colors.gray });
			listEmbed.addField('Choose an occupation:', output.join('\n'));
			message.channel.send(listEmbed);

			// Create a collector to get the response from the user
			const filter = m => (m.author.id === message.author.id);
			const collector = message.channel.createMessageCollector(filter, { time: 10000 });
			collector.on('collect', m => {
				if (m.beginsWith(prefix)) return collector.stop();

				if (Number.isInteger(Number(m.content))) {
					const n = Number(m.content);
					if ((n < 1) || (n > occupations.length)) {
						return message.channel.send(`Please enter a number between 1 and ${occupations.length}`);
					}
					const newOccupation = occupations[n - 1];
					newRole = message.guild.roles.find(r => r.name === newOccupation.name);
					changeRole(oldRole, newRole, message);
					cache.defaultSkill(message.member, message.channel);
					collector.stop();
					return;
				}

				newRole = findOccupation(m.content.trim().toLowerCase(), message);
				if (changeRole(oldRole, newRole, message)) {
					cache.defaultSkill(message.member, message.channel);
					collector.stop();
				}
			});
			collector.on('end', collected => {
				if (!newRole) {
					message.channel.send('Sorry, you did not select a new role.');
				}
			});
		}
	},
};