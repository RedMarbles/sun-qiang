const { RichEmbed } = require('discord.js');

const colors = require('../data/colors');

// Default skill cooldown
const DEFAULT_COOLDOWN = 5;

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

			const skill = message.client.skills.get(skillName);
			const element = await cache.get(message.author.id);
			const user = element.user;

			// Checking for stamina
			if (user.stamina < skill.stamina) {
				return message.channel.send(new RichEmbed({
					color: colors.red,
					title: 'Your right arm is weary',
					description: `Sorry **${message.member.displayName}**, you do not have enough stamina to use that skill`
						+ '\nYou can either wait for your stamina to refill or use an item to gain it back',
				}));
			}

			// Check if skill is occupation locked
			if (skill.occupation_locked && (cache.getRole(message.member).name !== skill.occupation)) {
				return message.channel.send(new RichEmbed({
					color: colors.red,
					title: 'You can\'t thread a needle with a hammer',
					description: `Sorry **${message.member.displayName}**, but you need to have the ${skill.occupation} role to use the \`${skill.name}\` skill`,
				}));
			}

			// Check if skill is on cooldown
			if (element.cooldowns.has(skillName)) {
				const remainingTime = (element.cooldowns.get(skillName) - Date.now()) / 1000;
				// If cooldown is not yet over
				if (remainingTime > 0) {
					// Send the error message, then delete it after 6 seconds
					return message.channel.send(new RichEmbed({
						color: colors.red,
						description: `${message.author}, the \`${skillName}\` command is still on cooldown for the next ${remainingTime.toFixed(1)} seconds`,
					})).then(msg => msg.delete(6000));
				}
				// If cooldown is over but the timestamp wasn't deleted
				element.cooldowns.delete(skillName);
			}

			// Add cooldown
			const cooldownAmount = (skill.cooldown || DEFAULT_COOLDOWN) * 1000;
			const expirationTime = Date.now() + cooldownAmount;
			element.cooldowns.set(skillName, expirationTime);
			setTimeout(() => element.cooldowns.delete(skillName), cooldownAmount);

			// Update skill usage counter and stamina
			await cache.incrementSkillCount(message.author.id, skillName);
			await cache.addStats(message.author.id, { stamina: -skill.stamina });

			// Execute the skill
			await skill.execute(message, args, cache);
		}
		catch(error) {
			return console.log(`ERROR [command skill] - Unknown error - (args: [ ${args.join(' ')} ]) \n${error}`);
		}
	},
};