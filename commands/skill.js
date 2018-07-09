const { RichEmbed } = require('discord.js');

const { occupations } = require('../data/occupations');
const colors = require('../data/colors');

module.exports = {
	name: 'skill',
	description: 'Use a skill that you have learnt',
	args: true,
	usage: '<skill name>',
	aliases: [],
	guildOnly: true,
	cooldown: 5,
	async execute(message, args, cache) {
		try {
			const skillName = args.shift();

			const availableSkills = await cache.getSkillNames(message.author.id);
			if (!availableSkills.includes(skillName)) {
				return message.channel.send(new RichEmbed({
					color: colors.red,
					title: 'You are unskilled',
					description: `Sorry **${message.member.displayName}**, you do not possess the skill \`${skillName}\``,
				}).setThumbnail(message.author.displayAvatarURL));
			}

			// TODO - Implement skill cooldown

			const skill = message.client.skills.get(skillName);
			const user = await cache.get(message.author.id);

			// Checking for stamina
			if ( user.stamina < skill.stamina ) {
				return message.channel.send(new RichEmbed({
					color: colors.red,
					title: 'Your right arm is weary',
					description: `Sorry **${message.member.displayName}**, you do not have enough stamina to use that skill`,
				}));
			}

			if (skill.occupation_locked && (cache.getRole(message.member).name !== skill.occupation)) return message.channel.send(new RichEmbed({
				color: colors.red,
				title: 'You can\'t thread a needle with a hammer',
				description: `Sorry **${message.member.displayName}**, but you need to have the ${skill.occupation} role to use the \`${skill.name}\` skill`,
			}));

			skill.execute(message, args, cache);
			await cache.incrementSkillCount(message.author.id, skillName);
			await cache.addStats(message.author.id, { stamina: -skill.stamina });
		}
		catch(error) {
			return console.log(`ERROR [command skill] - Unknown error - (skillname: ${skillName}) \n${error}`);
		}
	},
};