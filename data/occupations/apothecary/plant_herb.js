const { RichEmbed } = require('discord.js');
const colors = require('../../colors');

module.exports = {
	name: 'plant_herb',
	description: 'Plant a refined herb from your inventory and feed it your energy. After half an hour, it will bloom and return multiple times the planted yield',
	// The occupation to which this belongs
	occupation: 'Apothecary',
	// Minimum level at which this can be acquired
	min_level: 2,
	// Other skills that must be obtained before this skill can be unlocked
	requirements: ['refine_herb'],
	// (unused) Whether the spell is active or passive
	is_active: true,
	// The amount of stamina points needed to use this skill
	stamina: 15,
	// (unused) The amount of time before this skill can be used again (seconds)
	cooldown: 1800,
	// Whether the skill can only be used when the user is currently in this occupation
	occupation_locked: true,
	// (unused) Whether this skill can only be used in battle
	battle_skill: false,
	// Actual execution of the skill
	async execute(message, args, cache) {
		// TODO
		message.channel.send(new RichEmbed({
			color: colors.yellow,
			title: 'Skill: plant_herb',
			description: 'You try to plant a herb, but nothing happens, because Tribe hasn\'t coded this in yet.',
		}));

		// Failure condition
		// TODO

		// Success condition
		// TODO
	},
};