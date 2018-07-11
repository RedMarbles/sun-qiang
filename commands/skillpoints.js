const { RichEmbed } = require('discord.js');
const colors = require('../data/colors.js');
const { prefix } = require('../config.json');

module.exports = {
	name: 'skillpoints',
	description: 'Buy available skills using the skill points from levelling up'
		+ '\nSubcommands: '
		+ '\n `check <occupation_name>` - Check skills that are currently available for purchase under an occupation'
		+ '\n `buy <skill_name>` - Uses 1 skill point to unlock that skill'
		+ '\n `info <skill_name> - Gives you information about the skill`',
	args: true,
	usage: '[check <occupation_name>] / [buy <skill_name>] / [info <skill name>]',
	aliases: ['SP', 'sp', 'skillpoint'],
	guildOnly: true,
	cooldown: 10,
	async execute(message, args, cache) {
		try {
			// User is trying to buy a new skill
			if (args[0] === 'buy') {
				// Check if skill exists
				const skillName = args[1];
				if (!message.client.skills.has(skillName)) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'Sorry babe',
						description: `There's no skill named \`${skillName}\``,
					}));
				}
				const skill = message.client.skills.get(skillName);

				// Check if user already has the skill
				const obtainedSkills = await cache.getSkillNames(message.member.id);
				if (obtainedSkills.includes(skillName)) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'Did you make a mistake?',
						description: `**${message.member.displayName}**, you already learnt the \`${skillName}\` skill`,
					}));
				}

				// Check if user has minimum job level for the skill
				const occName = skill.occupation;
				const occStats = await cache.getOccupation(message.member.id, occName);
				const occRefer = message.client.occupations.get(occName);
				if (skill.level > occStats.level) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'You\'re being too ambitious',
						description: `**${message.member.displayName}**, you need to be at least a ${occRefer.exp_levels[skill.level].name} to learn this skill`,
					}));
				}

				// Check if the user has the dependent skills for this skill
				if (!skill.requirements.every(sk => obtainedSkills.includes(sk))) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'You don\'t have what it takes',
						description: `**${message.member.displayName}**, in order to learn ${skillName}, you need to have all of these required skills first: \n\`${skill.requirements}\``,
					}));
				}

				// Check if the user has the required skill points to buy the skill
				if (occStats.skill_points < 1) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'Git more gud',
						description: `**${message.member.displayName}**, you don't have enough skill points to unlock the skill.`,
					}));
				}

				// Add the skill to the user
				occStats.skill_points -= 1;
				await occStats.save();
				cache.addSkill(message.member.id, occName, skillName, message.channel);
			}

			// Argument is the occupation name
			else if(args[0] === 'check') {
				const occName = args.slice(1).join(' ');
				if (!message.client.occupations.has(occName)) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'Check your spelling?',
						description: `Could not find an occupation named \`${occName}\``,
					}));
				}

				const outputtext = [];
				const occ = await cache.getOccupation(message.member.id, occName);
				outputtext.push(`You have **${occ.skill_points} skill point(s)** availble for **${occName}** skills.`);
				outputtext.push('Skills you can unlock are:');

				const obtainedSkills = await cache.getSkillNames(message.member.id);
				message.client.occupations.get(occName).skills.forEach(skillName => {
					const skill = message.client.skills.get(skillName);
					if (skill.min_level > occ.level) return;
					if (obtainedSkills.includes(skillName)) return;
					outputtext.push(` > \`${skillName}\` - ${skill.description}`);
				});
				if (outputtext.length === 2) outputtext.push(' There are currently no skills available');
				return message.channel.send(new RichEmbed({
					color: colors.gray,
					title: `${message.member.displayName}'s available skills`,
					description: outputtext.join('\n'),
				}));
			}

			// User wants information about a skill
			else if(args[0] === 'info') {
				const skillName = args.slice(1).join(' ');
				if (!message.client.skills.has(skillName)) {
					return message.channel.send(new RichEmbed({
						color: colors.red,
						title: 'Check your spelling?',
						description: `Could not find a skill named \`${skillName}\``,
					}));
				}
				const skill = message.client.skills.get(skillName);

				const embed = new RichEmbed({
					color: colors.gray,
					title: `${skillName} Information`,
				});
				const occ = message.client.occupations.get(skill.occupation);
				embed.addField('Occupation Requirement', occ.exp_levels[skill.min_level].name, true);
				const requiredSkills = '`' + skill.requirements.join('`, `') + '`';
				embed.addField('Skill Requirements', requiredSkills, true);
				embed.addField('Skill Description', skill.description, false);
				embed.addField('Activation', (skill.is_active) ? 'Active skill' : 'Passive skill', true);
				embed.addField('Stamina Comsumption', `${skill.stamina} SP`, true);
				embed.addField('Cooldown', `${skill.cooldown} seconds`, true);
				embed.addField('Combat Skill', skill.battle_skill, true);
				embed.addField('Usage Restrictions', (skill.occupation_locked) ? `Only usable by the ${occ.name} role` : 'None');

				return message.channel.send(embed);
			}

			// User gave erronous input
			else {
				return message.channel.send(new RichEmbed({
					color: colors.red,
					title: 'Incorrect command',
					description: 'The command needs to be in the form of one of the following:'
						+ `\n \`${prefix}skillpoints check <occupation name>\``
						+ `\n \`${prefix}skillpoints info <skill name>\``
						+ `\n \`${prefix}skillpoints buy <skill name>\``,
				}));
			}
		}
		catch(error) {
			console.log(`ERROR [command skillpoints] - args: [${args.join(', ')}] \n${error}`);
		}
	},
};