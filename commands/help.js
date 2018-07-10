const Discord = require('discord.js');

const { prefix } = require('../config.json');
const colors = require('../data/colors');

module.exports = {
	name: 'help',
	description: 'Prints a list of available commands',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 3,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			// Print the full help command
			data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => `\`${command.name}\``).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command.`);
			return message.author.send(new Discord.RichEmbed({ color: colors.gray, description: data.join('\n') }))
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.channel.send(new Discord.RichEmbed({ color: colors.gray, description: `${message.author}, I\'ve sent you a DM with all my commands.` }));
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.channel.send(new Discord.RichEmbed({ color: colors.red, description: `${message.author}, It seems like I can\'t DM you. Do you have DMs disabled?`}));
				});
		}
		else {
			// Print only the help for a specific command
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.channel.send(new Discord.RichEmbed({ 
					color: colors.red, 
					description: `${message.author}, That\'s not a valid command!`,
				}));
			}

			const embed = new Discord.RichEmbed({ color: colors.gray, title: 'Command help' });
			embed.addField('Name', `\`${command.name}\``, true);
			if (command.aliases) embed.addField('Aliases', `\`${command.aliases.join('\`, \`')}\``, false);
			if (command.description) embed.addField('Description', command.description, false);
			if (command.usage) embed.addField('Usage', `\`${prefix}${command.name} ${command.usage}\``, true);
			embed.addField('Cooldown', `${command.cooldown || 3} second(s)`, true);

			message.channel.send(embed);
		}
	},
};