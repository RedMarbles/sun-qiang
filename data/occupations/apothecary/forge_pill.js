const { RichEmbed } = require('discord.js');
const colors = require('../../colors');

module.exports = {
	name: 'forge_pill',
	description: 'Forge a pill using the ingredients available to you',
	// The occupation to which this belongs
	occupation: 'Apothecary',
	// Minimum level at which this can be acquired
	min_level: 1,
	// Other skills that must be obtained before this skill can be unlocked
	requirements: [],
	// (unused) Whether the spell is active or passive
	is_active: true,
	// The amount of stamina points needed to use this skill
	stamina: 10,
	// (unused) The amount of time before this skill can be used again (seconds)
	cooldown: 60,
	// Whether the skill can only be used when the user is currently in this occupation
	occupation_locked: true,
	// (unused) Whether this skill can only be used in battle
	battle_skill: false,
	// Actual execution of the skill
	async execute(message, args, cache) {
		// TODO
		message.channel.send(new RichEmbed({
			color: colors.yellow,
			title: 'Skill: forge_pill',
			description: 'You try to forge a pill, but nothing happens, because Tribe hasn\'t coded this in yet.',
		}));

		// Failure condition
		// TODO

		// Success condition
		// TODO
	},
};