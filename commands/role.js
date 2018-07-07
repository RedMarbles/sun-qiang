const { occupations } = require('../data/occupations');

function changeRole(oldRole, newRole, message) {
	if (!newRole) {
		return message.channel.send('Sorry, this server doesn\'t seem to have that role available.');
	}
	if (oldRole) {
		message.member.removeRole(oldRole.id);
	}
	message.member.addRole(newRole.id);
	message.reply(`You have switched to the ${newRole.name} occupation!`);
};

module.exports = {
	name: 'role',
	description: 'Switch roles for the user',
	args: false,
	usage: '[role]',
	aliases: [],
	guildOnly: true,
	cooldown: 5,
	execute(message, args, cache) {
		// Extact the current occupation of the user, or set as 'Unemployed' if no role is found
		const oldRole = message.member.roles.find(r => occupations.map(occ => occ.name).includes(r.name)) || { name: 'Unemployed' };
		let newRole = undefined;

		// If there was an argument, compare against the occupations and aliases to find the correct new occupation
		if (args.length) {
			const argsString = args.join(' ').toLowerCase();
			const newOccupation = occupations.find(occ => (argsString === occ.name.toLowerCase()) || occ.alias.map(a => a.toLowerCase()).includes(argsString));
			if (!newOccupation) return message.reply(`Sorry, I couldn't find an occupation that matches '${argsString}'`);
			newRole = message.guild.roles.find(r => r.name === newOccupation.name);
			changeRole(oldRole, newRole, message);
		}
		// If there was no argument, provide a list of occupations to choose from
		else {
			let output = 'The occupations you can choose from are:';
			let count = 1;
			occupations.forEach(occ => {
				output += `\n ${count}. ${occ.name}   [ ${occ.alias.join(', ')} ]`;
				count += 1;
			});
			output += '\nSelect the number that corresponds to the chosen occupation.';
			message.reply(output);

			// Create a collector to get the response from the user
			const filter = m => (m.author.id === message.author.id) && Number.isInteger(Number(m.content));
			const collector = message.channel.createMessageCollector(filter, { time: 10000 });
			collector.on('collect', m => {
				const n = Number(m.content);
				if ((n < 1) || (n > occupations.length)) {
					return message.channel.send(`Please enter a number between 1 and ${occupations.length}`);
				}
				const newOccupation = occupations[n - 1];
				newRole = message.guild.roles.find(r => r.name === newOccupation.name);
				changeRole(oldRole, newRole, message);
				collector.stop();
			});
			collector.on('end', collected => {
				if (!newRole) {
					message.channel.send('Sorry, you did not select a new role.');
				}
			});
		}
	},
};