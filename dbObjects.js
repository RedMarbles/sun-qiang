// Loads databases and creates associations between the models

const DEFAULT_HEALTH = 100;
const DEFAULT_STAMINA = 10;
const DEFAULT_SLAPS = 5;

const Sequelize = require('sequelize');
const Discord = require('discord.js');

const { occupations: occupationsList } = require('./data/occupations.js');
const colors = require('./data/colors.js');

const { updateInfo } = require('./commands/info.js');

const sequelize = new Sequelize('SQdatabase', 'TribeOfOne', 's3cur3_password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only - path to the database
	storage: 'SQdatabase.sqlite',
});

const Users = sequelize.import('models/Users');
const Occupations = sequelize.import('models/Occupations');
const Skills = sequelize.import('models/Skills');

// // Using occupation.user should take us to the linked user element
// Occupations.belongsTo(Users, { foreign_key: 'user_id', as: 'user' });
// // Using skill.user should take us to the linked user element
// Skills.belongsTo(Users, { foreign_key: 'user_id', as: 'user' });
// // Using skill.occupation should take us to the linked occupation element
// Skills.belongsTo(Occupations, { foreign_key: 'occ_id', as: 'occupation' });

// A cache to store all database links in memory
const cache = new Discord.Collection();
/*
	cache =	{
		client: discord_client_object
		[{
			key: user_id,
			value: {
				user: user_database_entry,
				occupations: [{
					key: occupation_name,
					value: occupation_database_entry,
				}, ..., ],
				skills: [{
					key: skill_name,
					value: skill_database_entry,
				}, ..., ],
				buffs: {},
				last_info: handle to the last $info message
				last_message: the last message sent by the user
			},
		}, ..., ],
		function init(),
		function newUser(id),
		function addStats(id, statsDiff),
		function getStats(id),
		function getOccupation(id, occName),
		function setOccupation(id, occName, occNew),
		function addOccupationExperience(message, occName, expGain),
		function getSkillNames(id),
		function getSkill(id, skillName),
		function addSkill(id, occName, skillName, channel),
		function removeSkill(id, skillName),
		function incrementSkillCount(id, skillName),
		function defaultSkill(member, channel),
		function getRole(member),
		function reset(),
	}
*/

// Load up the databases and save all data into the cache
cache.init = async function() {
	try {
		// Load the databases (each is an array)
		const storedUsers = await Users.findAll();
		const storedOccs = await Occupations.findAll();
		const storedSkills = await Skills.findAll();

		// Create one entry in the cache for each user
		storedUsers.forEach(user => {
			// Find all the occupation entries for this user
			const matchingOccs = [];
			storedOccs.forEach(occ => {
				if (occ.user_id === user.user_id) matchingOccs.push(occ);
			});
			const occupations_ = new Discord.Collection();
			matchingOccs.forEach(occ => occupations_.set(occ.occ_name, occ));

			// Find all the skill entries for this user
			const matchingSkills = [];
			storedSkills.forEach(skill => {
				if (skill.user_id === user.user_id) matchingSkills.push(skill);
			});
			const skills_ = new Discord.Collection();
			matchingSkills.forEach(skill => skills_.set(skill.skill_name, skill));

			// Add the user along with a dictionary containing all his occupations and skills
			this.set(user.user_id, {
				user: user,
				occupations: occupations_,
				skills: skills_,
				buffs: {},
				last_info: null,
				last_message: null,
			});
		});

		console.log(`Loaded ${this.size} users into the cache.`);
		return true;
	}
	catch(error) {
		return console.log(`ERROR [cache.init] - ${error}`);
	}
};

// Add a new user to the cache and database
cache.newUser = async function(id) {
	try {
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
				skill_points: 0,
			});
			occupations_.set(occ.name, newOcc);
		}

		// Add values to cache
		this.set(id, {
			user: user,
			occupations: occupations_,
			skills: new Discord.Collection(),
			buffs: {},
			last_info: null,
			last_message: null,
		});
		console.log(`New user added to cache: ${cache.client.users.get(id).tag}`);
		return this.get(id);
	}
	catch(error) {
		return console.log(`Error [cache.newUser] - \n${error}`);
	}
};

// Change the stats of the user
// * id - (SNOWFLAKE) the user id
// * statsDiff - (DICT) a map of the changes to be made to each stat
cache.addStats = async function(id, statsDiff) {
	try {
		const element = this.get(id) || await this.newUser(id);
		const user = element.user;
		for (const stat_name in statsDiff) {
			if (user.hasOwnProperty(stat_name)) {
				console.error(`ERROR [cache.addStats] - Attempted to access the stat named ${stat_name}`
				+ `\n Username: ${cache.client.users.get(id).username}`);
				console.log('User data: ${user}');
			}
			user[stat_name] += statsDiff[stat_name];
		}
		if (user.health > user.health_max) user.health = user.health_max;
		if (user.stamina > user.stamina_max) user.stamina = user.stamina_max;
		await user.save();
		updateInfo(id, this);
	}
	catch(error) {
		return console.error(`ERROR [cache.addStats] - (id = ${id}, statsDiff = ${statsDiff} \n${error}`);
	}
};

// Retrieve the user stats for an id
// * id - (SNOWFLAKE) the user id
cache.getStats = async function(id) {
	try {
		const element = this.get(id) || await this.newUser(id);
		return element.user;
	}
	catch (error) {
		return console.error(`ERROR [cache.getStats] - Could not access user stats (id=${id})`);
	}
};

// Retrieve the occupation of the user
// * id - (SNOWFLAKE) the user id
// * occName - (STRING) the name of the occupation
cache.getOccupation = async function(id, occName) {
	try {
		const element = this.get(id) || await this.newUser(id);
		return element.occupations.get(occName);
	}
	catch(error) {
		return console.error(`ERROR [cache.getOccupation] - Could not access user occupation (id=${id}, occ=${occName})`);
	}
};

// Save the occupation of the user
// * id - (SNOWFLAKE) the user id
// * occName - (STRING) the name of the occupation
// * occNew - (DICT) a set of values to update in the occupation
cache.setOccupation = async function(id, occName, occNew) {
	try {
		const element = this.get(id) || await this.newUser(id);
		const occ = element.occupations.get(occName);
		for (const field in occNew) {
			if (!occ[field]) return console.error(`ERROR [cache.setOccupation] - Attempted to access field ${field}`);
			occ[field] = occNew[field];
		}
		await occ.save();
		updateInfo(id, this);
	}
	catch(error) {
		return console.error(`ERROR [cache.setOccupation] - (id=${id}, occName=${occName}, occNew=${occNew} \n${error}`);
	}
};

// Adds experience to the occupation
// * message - (MESSAGE) the message object sent by the user
// * occName - (STRING) the name of the occupation
// * expGain - (INT) the amount of exp to add
cache.addOccupationExperience = async function(message, occName, expGain) {
	try{
		const element = this.get(message.member.id) || await this.newUser(message.member.id);
		const occupationCache = element.occupations.get(occName);
		const occupationInfo = message.client.occupations.get(occName);
		if (!occupationCache || !occupationInfo) {
			throw `Could not find occupation ${occName}!`;
		}

		// Add exp until it reaches the level cap
		const expMax = occupationInfo.exp_levels[occupationCache.level].exp;
		occupationCache.experience = Math.min(occupationCache.experience + expGain, expMax);

		// Check if the requirements are met to level up
		if ((occupationCache.experience >= expMax) && (occupationInfo.canLevelUp(message, this))) {
			occupationCache.level += 1;
			occupationCache.skill_points += 1;

			return message.channel.send(new Discord.RichEmbed({
				color: colors.blue,
				title: ':notes: TA TA TA TAAAAA :musical_note:',
				description: `**${message.member.displayName}** broke past their bottleneck and became a **${occupationInfo.exp_levels[occupationCache.level].name}**!`
					+ `\n You have gained 1 skill point for learning a new ${occName} skill!`,
			}));
		}
		await occupationCache.save();
		updateInfo(message.member.id, this);
		return true;
	}
	catch(error) {
		return console.error(`ERROR [cache.addOccupationExperience] - (message=#, occName=${occName}, expGain=${expGain}) \n${error}`);
	}
};

// Retrieve the names of all skills of a user from the cache
// * id - (SNOWFLAKE) the user id
cache.getSkillNames = async function(id) {
	try {
		const element = this.get(id) || await this.newUser(id);
		return [...element.skills.keys()];
	}
	catch(error) {
		return console.error(`ERROR [cache.getSkillNames] - (id=${id}) \n${error}`);
	}
};

// Retrieve a speficied skill from a user
// * id - (SNOWFLAKE) the user id
// * skillName - (STRING) the name of the skill to retrieve
cache.getSkill = async function(id, skillName) {
	try {
		const element = this.get(id) || await this.newUser(id);
		return element.skills.get(skillName);
	}
	catch(error) {
		return console.error(`ERROR [cache.getSkill] - (id=${id}, skillName=${skillName}) \n${error}`);
	}
};

// Add a skill to a user
// * id - (SNOWFLAKE) the user id
// * occName - (STRING) the name of the occupation to fetch the skill from
// * skillName - (STRING) the name of the skill to add
// * channel - (CHANNEL) the discord channel on which to publish the new skill message
cache.addSkill = async function(id, occName, skillName, channel) {
	try {
		const element = this.get(id) || await this.newUser(id);

		// Check if the skill is already in the skills of this user
		const existingSkills = [...element.skills.keys()];
		if (existingSkills.includes(skillName)) {
			return console.error(`ERROR [cache.addSkill] - Attempted to add skill ${skillName} to user ${id} although user already has skill`);
		}

		// Create new skill and add to database
		const newSkill = await Skills.create({
			user_id: id,
			occ_id: this.getOccupation(id, occName).id,
			skill_name: skillName,
			occ_name: occName,
			uses: 0,
		});
		element.skills.set(skillName, newSkill);

		// console.log(`DEBUG [cache.addSkill] - User ${id} has learnt skill ${skillName}`);
		const user_member = channel.members.find(m => m.id === id);
		channel.send(new Discord.RichEmbed({
			color: colors.blue,
			title: 'New skill learnt!',
			description: `**${user_member.displayName}** has learnt the ${occName} skill \`${skillName}\`!`,
		}));

		updateInfo(id, this);
		return newSkill;
	}
	catch(error) {
		return console.error(`ERROR [cache.addSkill] - Unknown error (id=${id}, occName=${occName}, skillName=${skillName}) \n${error}`);
	}
};

// Remove a specified skill from the user's skill list
// * id - (SNOWFLAKE) the user id
// * skillName - (STRING) the name of the skill to remove
cache.removeSkill = async function(id, skillName) {
	try {
		const element = this.get(id);
		if (!element) return console.error(`ERROR [cache.removeSkill] - User does not exist - (id=${id}, skillName=${skillName})`);
		const existingSkills = [...element.skills.keys()];
		if (!existingSkills.includes(skillName)) return console.error(`ERROR [cache.removeSkill] - User does not have this skill - (id=${id}, skillName=${skillName})`);

		// Remove the skill from the database
		await Skills.destroy({ where: { user_id: id, skill_name: skillName } });
		// Remove the skill from the cache
		element.skills.delete(skillName);

		return console.log(`Skill ${skillName} removed from user ${id}`);
	}
	catch(error) {
		return console.error(`ERROR [cache.removeSkill] - Unknown error - (id=${id}, skillName=${skillName}) \n${error}`);
	}
};

// Increase the usage counter of a skill by 1
cache.incrementSkillCount = async function(id, skillName) {
	try {
		const element = this.get(id);
		if (!element) return console.error(`ERROR [cache.incrementSkillCount] - User does not exist - (id=${id}, skillName=${skillName})`);
		const existingSkills = [...element.skills.keys()];
		if (!existingSkills.includes(skillName)) return console.error(`ERROR [cache.incrementSkillCount - User does not have this skill - (id=${id}, skillName=${skillName})`);

		const skill = element.skills.get(skillName);
		skill.uses += 1;
		return skill.save();
	}
	catch(error) {
		return console.error(`ERROR [cache.incrementSkillCount] - Unknown error - (id=${id}, skillName=${skillName}) \n${error}`);
	}
};

// Automatically add the default skill of the current occupation to the user
// * member - (GUILDMEMBER) the user's guild member object
// * channel - (CHANNEL) the channel where the message should be published
cache.defaultSkill = async function(member, channel) {
	try {
		const roleName = this.getRole(member).name;
		const defaultSkillName = member.client.occupations.get(roleName).default_skill;
		const existingSkills = await this.getSkillNames(member.id);
		if (existingSkills.includes(defaultSkillName)) return true;

		const newSkill = this.addSkill(member.id, roleName, defaultSkillName, channel);
		updateInfo(member.id, this);
		return newSkill;
	}
	catch(error) {
		return console.error(`ERROR [cache.defaultSkill] - (member: ${member.displayName}, role: ${roleName}) \n${error}`);
	}
};

// Helper function to extract the role of a member
cache.getRole = function(member) {
	return member.roles.find(r => occupationsList.map(occ => occ.name).includes(r.name));
};

// Resets all stats and gains for everyone across the server
cache.reset = async function() {
	try {
		const promises = [];
		this.forEach((element, id) => {
			const user = element.user;
			user.health = DEFAULT_HEALTH;
			user.health_max = DEFAULT_HEALTH;
			user.slaps = DEFAULT_SLAPS;
			user.stamina = DEFAULT_STAMINA;
			user.stamina_max = DEFAULT_STAMINA;
			promises.push(user.save());

			// Iterate through and reset each occupation
			element.occupations.forEach((occ, occName) => {
				occ.experience = 0;
				occ.level = 0;
				promises.push(occ.save());
			});

			// Remove all skills
			element.skills.forEach((skill, skillName) => {
				promises.push(this.removeSkill(id, skillName));
			});
		});
		await Promise.all(promises);
		console.log('All values reset.');
	}
	catch(error) {console.error('ERROR [cache.reset]'); console.error(error);}
};

module.exports = { cache, Users, Occupations, Skills };