module.exports = {
	name: 'reset',
	description: 'Resets the health and slap counts for all users on the server',
	args: false,
	guildOnly: true,
	cooldown: 180,
	async execute(message, args, cache) {
		await cache.reset();
		message.channel.send('All stats reset.');
	}
};