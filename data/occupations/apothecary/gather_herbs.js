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
	// (unused) Whether the spell is active or passive
	is_active: 'active',
	// The amount of stamina points needed to use this skill
	stamina: 2,
	// The amount of time before this skill can be used again (seconds)
	cooldown: 5,
	// Whether the skill can only be used when the user is currently in this occupation
	occupation_locked: true,
	// (unused) Whether this skill can be used in battle
	battle_skill: false,
	// Actual execution of the skill
	async execute(message, args, cache) {
		// Default success rate of the skill
		const SUCCESS_RATE = 0.8;
		const skill_check = Math.random();

		const DEFAULT_EXP = 1;
		const expGain = DEFAULT_EXP * 1;

		const user = await cache.getStats(message.author.id);

		// Failure condition
		if (skill_check > SUCCESS_RATE) {
			return message.channel.send(new RichEmbed({
				color: colors.darkred,
				title: `${message.member.displayName} is gathering herbs`,
				description: 'You fumbled around in the woods for an hour but didn\'t find anything other than embarassment.',
			}).addField(`${this.occupation} EXP`, `${cache.get(message.member.id).occupations.get(this.occupation).experience} (+0 EXP)`, true)
				.addField('Stamina', `${user.stamina}/${user.stamina_max} SP ( -${this.stamina} SP )`, true));
		}

		// Success condition
		await cache.addOccupationExperience(message, 'Apothecary', expGain);
		return message.channel.send(new RichEmbed({
			color: colors.green,
			title: `${message.member.displayName} is gathering herbs`,
			description: 'After searching around in the woods for a while, you finally find a valuable herb!',
		}).addField(`${this.occupation} EXP`, `${cache.get(message.member.id).occupations.get(this.occupation).experience} (+${expGain} EXP)`, true)
			.addField('Stamina', `${user.stamina}/${user.stamina_max} SP ( -${this.stamina} SP )`, true));
	},
};