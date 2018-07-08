// Loads databases and creates associations between the models

const DEFAULT_HEALTH = 100;
const DEFAULT_STAMINA = 10;
const DEFAULT_SLAPS = 5;

const Sequelize = require('sequelize');
const Discord = require('discord.js');

const { occupations: occupationsList } = require('./data/occupations.js');

const sequelize = new Sequelize('SQdatabase', 'TribeOfOne', 's3cur3_password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only - path to the database
	storage: 'SQdatabase.sqlite',
});

const Users = sequelize.import('models/Users');
const Occupations = sequelize.import('models/Occupations');

// A cache to store all database links in memory
const cache = new Discord.Collection();
/*
	cache =	[{
		key: user_id,
		value: {
			user: user_database_entry,
			occupations: [{
				key: occupation_name,
				value: occupation_database_entry,
			}, ..., ],
			buffs: {}
		},
	}, ..., ]
*/

// Load up the databases and save all data into the cache
cache.init = async function () {
	// Load the databases (each is an array)
	const storedUsers = await Users.findAll();
	const storedOccs = await Occupations.findAll();

	// Create one entry in the cache for each user
	storedUsers.forEach(user => {
		// Find all the occupation entries for this user
		const matchingOccs = [];
		storedOccs.forEach(occ => {
			if (occ.user_id === user.user_id) matchingOccs.push(occ);
		});

		const occupations_ = new Discord.Collection();
		matchingOccs.forEach(occ => occupations_.set(occ.occ_name, occ));

		// Add the user along a dictionary containing all his occupations
		this.set(user.user_id, {
			user: user,
			occupations: occupations_,
			buffs: {},
		});
	});

	console.log(`Loaded ${this.size} users into the cache.`);
};

// Add a new user to the cache and database
cache.newUser = async function (id) {
	const user = await Users.create({
		user_id: id,
		health: DEFAULT_HEALTH,
		health_max: DEFAULT_HEALTH,
		slaps: DEFAULT_SLAPS,
		stamina: DEFAULT_STAMINA,
		stamina_max: DEFAULT_STAMINA,
	});
	console.log('New user created');

	// Create professions for the new user
	const occupations_ = new Discord.Collection();
	for (const occ of occupationsList) {
		const newOcc = await Occupations.create({
			user_id: id,
			occ_name: occ.name,
			experience: 0,
			level: 0,
		});
		occupations_.set(occ.name, newOcc);
	}

	// Add values to cache
	this.set(id, {
		user: user,
		occupations: occupations_,
		buffs: {},
	});
	console.log('New user added to cache');
	return user;
};

// Change the stats of the user
// * id - (SNOWFLAKE) the user id
// * statsDiff - (DICT) a map of the changes to be made to each stat
cache.addStats = async function (id, statsDiff) {
	const user = (cache.get(id)) ? cache.get(id).user : await cache.newUser(id);
	console.log(`${user.user_id}  HP: ${user['health']}`);
	for (const stat_name in statsDiff) {
		if (!user[stat_name]) return console.error(`ERROR [cache.addStats] - Attempted to access the stat named ${stat_name}`);
		user[stat_name] += statsDiff[stat_name];
	}
	return user.save();
};

// Retrieve the user stats for an id
// * id - (SNOWFLAKE) the user id
cache.getStats = async function (id) {
	const user = (cache.get(id)) ? cache.get(id).user : await cache.newUser(id);
	if (user) return user;
	return console.error('ERROR [cache.getStats] - Could not access user stats');
};

// TODO
cache.getOccupation = function (id, occName) {};

// TODO
cache.setOccupation = function (id, occName, occ) {};

// TODO
cache.getSkills = function (id) {};

// TODO
cache.addSkill = function (id, occName, skillName) {};

// TODO
cache.removeSkill = function (id, occName, skillName) {};

// Resets all stats and gains for everyone across the server
cache.reset = async function () {
	try {
		const promises = [];
		cache.forEach((element, id) => {
			const user = element.user;
			user.health = DEFAULT_HEALTH;
			user.health_max = DEFAULT_HEALTH;
			user.slaps = DEFAULT_SLAPS;
			user.stamina = DEFAULT_STAMINA;
			user.stamina_max = DEFAULT_STAMINA;
			promises.push(user.save());

			const occs = element.occupations;
			// Iterate through and reset each occupation
			element.occupations.forEach((occ, occName) => {
				occ.experience = 0;
				occ.level = 0;
				promises.push(occ.save());
			});
		});
		await Promise.all(promises);
		console.log('All values reset.');
	}
	catch(error) {console.error('ERROR [cache.reset]'); console.error(error);}
};

module.exports = { cache, Users, Occupations };