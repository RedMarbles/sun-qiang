const { RichEmbed } = require('discord.js');
const colors = require('../../colors');

module.exports = {
	name: 'paint',
	description: 'Splash some colors upon a blank canvas and hope to create a masterpiece',
	// The occupation to which this belongs
	occupation: 'Painter',
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
			const failureMessages = [
				'You paint a magnificent Picasso. Unfortunately, nobody can understand the artistic worth of your random scribbles.',
				'You experiment with post-modern cubism. But it\'s not like anyone will ever understand. Embarassed, you throw the canvas into the trash, never to be seen again.',
				'You paint a child\'s scribble of a house and mountain using squares and rectangles. It\'s not really very profound, and you\'re not proud to call this your work.',
				'In the middle of your attempt at painting the Mona Lisa, a cat comes in and throws up a hairball. Admittedly, the hairball looks better than the random scribbles on your canvas. You trash the canvas in shame.'
			];
			const failureMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
			return message.channel.send(new RichEmbed({
				color: colors.darkred,
				title: `${message.member.displayName} is painting`,
				description: failureMessage,
			}).addField(`${this.occupation} EXP`, `${cache.get(message.member.id).occupations.get(this.occupation).experience} (+0 EXP)`, true)
				.addField('Stamina', `${user.stamina}/${user.stamina_max} SP ( -${this.stamina} SP )`, true)
				.addField('Soul Depth', `${user.soul_depth.toFixed(1)}/${user.soul_depth_max.toFixed(1)} ( -${this.soul_depth} )`, true));
		}

		// Success condition
		const successLines = [
			'You paint a beautiful scene of a deer looking in at the contents of a warm log cabin through the window in the middle of a snowy field.',
			'You create a scenery of a gigantic forest burning to the ground in the middle of a blazing forest fire, while little sprouts have already pushed their way up in the regions that have already been ravaged by the flames.',
			'The paint upon your canvas mysteriously merges together to create a stunning array of colors you\'ve never seen before. There are no distinct shapes, but the colors alone are gorgeous. ',
			'You create a nude painting based on your fantasies of Sun Qiang. You\'re not sure if you want to sell this or save it in your stockpile, for posterity.',
			'A grassy field upon which a single crane stands, lone and majestic, as it looks off into the sunset, appears as you put your brush to the canvas.',
		];
		const successLine = successLines[Math.floor(Math.random() * successLines.length)];
		await cache.addOccupationExperience(message, 'Cultivation', expGain);
		return message.channel.send(new RichEmbed({
			color: colors.green,
			title: `${message.member.displayName} is painting`,
			description: successLine,
		}).addField(`${this.occupation} EXP`, `${cache.get(message.member.id).occupations.get(this.occupation).experience} (+${expGain} EXP)`, true)
			.addField('Stamina', `${user.stamina}/${user.stamina_max} SP ( -${this.stamina} SP )`, true)
			.addField('Soul Depth', `${user.soul_depth.toFixed(1)}/${user.soul_depth_max.toFixed(1)} ( -${this.soul_depth} )`, true));
	},
};