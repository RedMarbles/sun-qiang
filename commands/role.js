const Discord = require('discord.js');

const { occupations } = require('../data/occupations');
const colors = require('../data/colors');
const { prefix } = require('../config');

async function changeRole(oldRole, newRole, message, cache) {
	try {
		if (!newRole) {
			message.channel.send('Sorry, this server doesn\'t seem to have that role available.');
			return false;
		}
		if (oldRole) {
			await message.member.removeRole(oldRole.id);
		}
		await message.member.addRole(newRole.id);
		message.channel.send(new Discord.RichEmbed({ color: colors.gray, description: `${message.author} has become a **${newRole.name}**!` }));
		await cache.defaultSkill(message.member, message.channel, newRole.name);
		return true;
	}
	catch(error) {
		console.error(`ERROR [command role.changeRole()] - (oldRole: ${oldRole.name}, newRole: ${newRole.name})`);
	}
}

function findOccupation(input, message) {
	const newOccupation = occupations.find(occ => (input === occ.name.toLowerCase()) || occ.alias.map(a => a.toLowerCase()).includes(input));
	if (!newOccupation || newOccupation.unlisted) {
		message.reply(`Sorry, I couldn't find an occupation that matches '${input}'`);
		return undefined;
	}
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
		// Extact the current occupation of the user
		const oldRole = cache.getRole(message.member);
		let newRole = undefined;

		if (oldRole) await cache.defaultSkill(message.member, message.channel, oldRole.name);

		// If there was an argument, compare against the occupations and aliases to find the correct new occupation
		if (args.length) {
			newRole = findOccupation(args.join(' ').toLowerCase(), message);
			await changeRole(oldRole, newRole, message, cache);
		}
		// If there was no argument, provide a list of occupations to choose from
		else {
			const output = [];
			let count = 1;
			occupations.forEach(occ => {
				if (occ.unlisted) return;
				output.push(`**${count}.** ${occ.name}   [ ${occ.alias.join(', ')} ]`);
				count += 1;
			});
			const listEmbed = new Discord.RichEmbed({ color: colors.gray });
			listEmbed.addField('Choose an occupation:', output.join('\n'));
			message.channel.send(listEmbed);

			// Create a collector to get the response from the user
			const filter = m => (m.author.id === message.author.id);
			const collector = message.channel.createMessageCollector(filter, { time: 20000 });
			collector.on('collect', async (m) => {
				if (m.content.startsWith(prefix)) return collector.stop();

				if (Number.isInteger(Number(m.content))) {
					const n = Number(m.content);
					if ((n < 1) || (n > occupations.length - 2)) {
						return message.channel.send(`Please enter a number between 1 and ${occupations.length - 2}`);
					}
					const newOccupation = occupations[n + 1];
					newRole = message.guild.roles.find(r => r.name === newOccupation.name);
					await changeRole(oldRole, newRole, message, cache);
					collector.stop();
					return;
				}

				// If the option isn't a number but a string
				newRole = findOccupation(m.content.trim().toLowerCase(), message);
				if (await changeRole(oldRole, newRole, message, cache)) {
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