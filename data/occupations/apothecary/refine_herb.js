const { RichEmbed } = require('discord.js');
const colors = require('../../colors');

module.exports = {
	name: 'refine_herb',
	description: 'Refine a herb from your inventory using your spiritual energy to remove impurities and increase its quality.',
	// The occupation to which this belongs
	occupation: 'Apothecary',
	// (unused) Minimum level at which this can be acquired
	min_level: 1,
	// (unused) Other skills that must be obtained before this skill can be unlocked
	requirements: [],
	// (unused) Whether the spell is active or passive
	is_active: 'active',
	// The amount of stamina points needed to use this skill
	stamina: 5,
	// The amount of time before this skill can be used again (seconds)
	cooldown: 60,
	// Whether the skill can only be used when the user is currently in this occupation
	occupation_locked: true,
	// (unused) Whether this skill can be used in battle
	battle_skill: false,
	// Actual execution of the skill
	async execute(message, args, cache) {
		// TODO
		message.channel.send(new RichEmbed({
			color: colors.yellow,
			title: 'Skill: refine_herb',
			description: 'You try to refine a herb, but nothing happens, because Tribe hasn\'t coded this in yet.',
		}));

		// Failure condition
		// TODO

		// Success condition
		// TODO
	},
};