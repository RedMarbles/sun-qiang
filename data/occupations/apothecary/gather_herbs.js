const { RichEmbed } = require('discord.js');
const colors = require('../../colors');

module.exports = {
	name: 'gather_herbs',
	description: 'Has a chance of giving you a little Apothecary experience, as well as gathering a herb',
	// The occupation to which this belongs
	occupation: 'Apothecary',
	// Minimum level at which this can be acquired
	min_level: 0,
	// Other skills that must be obtained before this skill can be unlocked
	requirements: [],
	// Whether the spell is active or passive
	is_active: false,
	// The amount of skill points needed to use this skill
	stamina: 2,
	// Whether the skill can only be used when the user is currently in this occupation
	occupation_locked: true,
	// Actual execution of the skill
	async execute(message, args, cache) {
		// Default success rate of the skill
		const SUCCESS_RATE = 0.8;
		const skill_check = Math.random();

		const DEFAULT_EXP = 1;

		await cache.incrementSkillCount(message.author.id, 'gather_herbs');

		// Failure condition
		if (skill_check > SUCCESS_RATE) {
			return message.channel.send(new RichEmbed({
				color: colors.darkred,
				title: `${message.member.displayName} is gathering herbs`,
				description: 'You fumbled around in the woods for an hour but didn\' find anything other than embarassment.',
			}).addField('Items Gained','N/A',true)
			.addField('Items Lost','N/A',true)
			.addField('EXP gained','0',true)
			.addField('Apothecary EXP',cache.get(message.member.id).occupations.get('Apothecary').experience,true));
		}

		// Success condition
		await cache.addOccupationExperience(message, 'Apothecary', DEFAULT_EXP);
		return message.channel.send(new RichEmbed({
			color: colors.green,
			title: `${message.member.displayName} is gathering herbs`,
			description: 'After searching around in the woods for a while, you finally find a valuable herb!',
		}).addField('Items Gained','N/A',true)
		.addField('Items Lost','N/A',true)
		.addField('EXP gained',`${DEFAULT_EXP}`,true)
		.addField('Apothecary EXP',cache.get(message.member.id).occupations.get('Apothecary').experience,true));

	},
};