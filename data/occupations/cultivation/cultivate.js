const { RichEmbed } = require('discord.js');
const colors = require('../../colors');

module.exports = {
	name: 'cultivate',
	description: 'Ponder upon the immortal mysteries as you guide your spiritual energy within your body, hoping to transform it, slowly but surely, into an immortal body.',
	// The occupation to which this belongs
	occupation: 'Cultivation',
	// Minimum level at which this can be acquired
	min_level: 0,
	// Other skills that must be obtained before this skill can be unlocked
	requirements: [],
	// (unused) Whether the spell is active or passive
	is_active: 'active',
	// The amount of stamina points needed to use this skill
	stamina: 2,
	// The amount of soul depth needed to use this skill
	soul_depth: 0.1,
	// The amount of time before this skill can be used again (seconds)
	cooldown: 5,
	// Whether the skill can only be used when the user is currently in this occupation
	occupation_locked: false,
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
			const distractions = [
				'picture of a cheesecake',
				'lolcatz video',
				'screenshot of Chris Hemsworth\'s ass',
				'LoHP chapter'
			];
			const distraction = distractions[Math.floor(Math.random() * distractions.length)];
			return message.channel.send(new RichEmbed({
				color: colors.darkred,
				title: `${message.member.displayName} is cultivating`,
				description: `You ponder the mysteries of life, the universe and everything, but are quickly distracted by thoughts of that ${distraction} you saw last night.`,
			}).addField('Cultivation EXP', `${cache.get(message.member.id).occupations.get('Cultivation').experience} (+0 EXP)`, true)
				.addField('Stamina', `${user.stamina}/${user.stamina_max} SP ( -${this.stamina} SP )`, true));
		}

		// Success condition
		const successLines = [
			'You gain enlightenment of the answer to life, the universe and everything (it\'s somewhere between 41 and 43 by your best estimates), and progress in your cultivation thanks to that.',
			'The smell of that freshly baked pizza wafting in through the window drives you through your LSD-fuelled trance and opens your mind to a whole new world, giving you a boost to your cultivation.',
			'You fall asleep while meditating, but Keanu Reeves suddenly passes by. He takes a linking to you, so he enters the matrix and changes the source code of the bot to increase your cultivation',
			'You begin to dream of today morning, when you saw a shirtless Sun Qiang bathing in the courtyard, and you come to understand the enlightenment and glory of the fat buddha.',
			'As you sit and meditate, you drive your zhenqi through your meridians as you accumulate more spiritual energy from the surroundings.',
			'As you sit and meditate, you drive your zhenqi through your meridians as you accumulate more spiritual energy from the surroundings.',
			'As you sit and meditate, you drive your zhenqi through your meridians as you accumulate more spiritual energy from the surroundings.',
		];
		const successLine = successLines[Math.floor(Math.random() * successLines.length)];
		await cache.addOccupationExperience(message, 'Cultivation', expGain);
		return message.channel.send(new RichEmbed({
			color: colors.green,
			title: `${message.member.displayName} is cultivating`,
			description: successLine,
		}).addField('Cultivation EXP', `${cache.get(message.member.id).occupations.get('Cultivation').experience} (+${expGain} EXP)`, true)
			.addField('Stamina', `${user.stamina}/${user.stamina_max} SP ( -${this.stamina} SP )`, true));
	},
};