// Creates a random backstory for the user's convenience

const { RichEmbed } = require('discord.js');
const colors = require('../data/colors.js');

const backstory_data = [
	{
		tag: 'origins',
		intro: 'You grew up happily in a ',
		options: [
			'quiet farming village,',
			'prosperous merchant town,',
			'university dedicated to the arcane arts,',
			'close knit band of travelling performers,',
			'colony of nomadic mushroom herders,',
			'surprisingly cosy network of caves,',
		],
	},
	{
		tag: 'big bad',
		intro: 'until one day ',
		options: [
			'a marauding band of goblins',
			'an ancient powerful dragon',
			'a corrupt local noble and his cronies',
			'a vengeful demi-god that your people mistakenly robbed',
			'a grumpy turtle the size of an island',
			'a sentient cutlery set possessed by an eldritch evil',
		],
	},
	{
		tag: 'evil action',
		intro: '',
		options: [
			'stole an irreplacable heirloom from',
			'brutally murdered',
			'insulted the honor of',
			'destroyed the livelihood of',
			'kidnapped and never returned',
			'mildly inconvenienced',
		],
	},
	{
		tag: 'victim',
		intro: 'your ',
		options: [
			'father.',
			'entire family.',
			'entire community.',
			'childhood mentor.',
			'closest friend.',
			'pet hamster, Nostradamus.',
		],
	},
	{
		tag: 'journey',
		intro: 'Now you ',
		options: [
			'wander the countryside',
			'fight injustice whenever you find it',
			'train your mind and body',
			'meditate for twenty hours a day',
			'are getting some much needed \'me time\'',
			'try to join any band of adventurers that will take you, good or evil,',
		],
	},
	{
		tag: 'goal',
		intro: 'until you can ',
		options: [
			'avenge your loved ones.',
			'prove yourself to all those who doubted you.',
			'finally be at peace with your tragic past.',
			'forge a new name and a new legend for yourself.',
			'learn to let bygones be bygones.',
			'become powerful enough that you can start giving other people tragic backstories.',
		],
	},
];

module.exports = {
	name: 'backstory',
	description: 'Create a tragic backstory for your character. Created with the help of https://imgur.com/gallery/XJcnZ2v .',
	args: false,
	usage: '',
	aliases: ['tragic', 'story'],
	guildOnly: false,
	cooldown: 10,
	execute(message, args, cache) {
		try {
			const result = [];
			backstory_data.forEach(element => {
				const optionSelect = Math.floor(Math.random() * element.options.length);
				result.push(`${element.intro}${element.options[optionSelect]}`);
			});
			return message.channel.send(new RichEmbed({
				color: colors.orange,
				title: 'Tragic Backstory Time!',
				description: result.join(' '),
			}));
		}
		catch(error) {
			return console.log(`ERROR [commands backstory.execute] \n${error}`);
		}
	},
};