const Discord = require('discord.js');

// const { attributes } = require('../data/occupations');
const colors = require('../data/colors');

async function generateEmbed(message, target, cache) {
	const role = cache.getRole(target);
	const { health, health_max, slaps, stamina, stamina_max } = await cache.getStats(target.id);

	// Make sure the user has the default skill for the current class
	if (role) await cache.defaultSkill(target, message.channel, role.name);

	const embed = new Discord.RichEmbed({
		color: colors.gray,
	});
	embed.setThumbnail(target.user.displayAvatarURL);
	embed.addField('Username', target.displayName, true);
	embed.addField('Occupation', (role) ? role.name : 'Unemployed', true);
	embed.addField('Health', `${health}/${health_max} HP`, true);
	embed.addField('Stamina', `${stamina}/${stamina_max} SP`, true);

	const obtainedSkills = await cache.getSkillNames(target.id);
	async function process(occData, occName) {
		const occinfo = [];

		// Exp and skill points info
		const { experience, level, skill_points } = await cache.getOccupation(target.id, occName);
		const experience_max = occData.exp_levels[level].exp;

		// Skill info (do not print occupation information unless the character has a skill in that occupation)
		const skillinfo = [];
		occData.skills.forEach(element => {
			if (obtainedSkills.includes(element)) skillinfo.push(`\`${element}\``);
		});
		if (!skillinfo.length) return;

		occinfo.push(`Category: ${occData.name}`);
		occinfo.push(`EXP : ${experience}/${experience_max}`);
		occinfo.push(`Skill Points: ${skill_points}`);
		occinfo.push('Skills: ' + skillinfo.join(', '));

		embed.addField(occData.exp_levels[level].name, occinfo.join('\n'), true);

		return Promise.resolve();
	}
	const promises = [];
	message.client.occupations.forEach((occData, occName) => {
		promises.push(process(occData, occName));
	});
	await Promise.all(promises);

	embed.addField('Ammunition', `${slaps} slaps`, true);

	// const offenseMultpliers = [];
	// attributes.forEach(att => {
	// 	if (att.user === role.name) {
	// 		offenseMultpliers.push(`${att.multiplier.toFixed(1)} vs ${att.target}s`);
	// 	}
	// });
	// if (!offenseMultpliers.length) offenseMultpliers.push('N/A');
	// embed.addField('Offensive Multipliers', offenseMultpliers.join('\n'), true);

	// const defensiveMultipliers = [];
	// attributes.forEach(att => {
	// 	if (att.target === role.name) {
	// 		defensiveMultipliers.push(`${att.multiplier.toFixed(1)} from ${att.user}s`);
	// 	}
	// });
	// if (!defensiveMultipliers.length) defensiveMultipliers.push('N/A');
	// embed.addField('Defensive Multipliers', defensiveMultipliers.join('\n'), true);

	return embed;
}

module.exports = {
	name: 'info',
	description: 'Tells you about the health and remaining handly ammunition possessed by you / another cultivator, as well as your damage multipliers',
	args: false,
	usage: '[@user]',
	aliases: ['status'],
	guildOnly: true,
	cooldown: 10,
	async execute(message, args, cache) {
		let infoSelf = false;
		let target = message.mentions.members.first();
		if (!target) {
			target = message.member;
			infoSelf = true;
		}

		// Making the message information available for other functions
		cache.get(message.author.id).last_message = message;

		const embed = await generateEmbed(message, target, cache);

		// If it is information about another user, send the message to the text channel
		if (!infoSelf) {
			await message.channel.send(embed);
		}
		// If it is information about the user, send message to DM
		else {
			embed.setFooter('This message will auto-update with the user\'s stats');
			cache.get(message.author.id).last_info = await message.author.send(embed);
			message.channel.send(new Discord.RichEmbed({
				color: colors.gray,
				description: `${message.author}, I've sent you a DM with an auto-updating info tab`,
			}));
		}
	},
	async updateInfo(id, cache) {
		try {
			const last_info = cache.get(id).last_info;
			const last_message = cache.get(id).last_message;
			if (!last_info) return;
			if (!last_message) throw 'last_message not defined';
			const member = last_message.channel.members.get(id);
			const embed = await generateEmbed(last_message, member, cache);
			embed.setFooter('This message will auto-update with the user\'s stats');
			last_info.edit(embed);
		}
		catch(error) {
			console.error(`ERROR [command info.updateInfo] \n${error}`);
		}
	},
};