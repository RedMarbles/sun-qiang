// A model of the Users database
/*
 * Users:
 * - user_id - (PK) (STRING)
 * - health - (INT) how much health is remaining
 * - health_max - (INT) the maximum health for the character
 * / slaps - (INT) number of slaps remaining for the day
 * - stamina - (INT) stamina points, used to execute active skills
 * - stamina_max - (INT) the maximum stamina for the character
 * + soul_depth - (FLOAT) the soul depth of the character
 * + soul_depth_max - (FLOAT) the maximum soul depth  of the character
 * + curr_gold - (INT) the amount of wealth of the character - gold
 * + curr_low - (INT) the amount of wealth of the character - low tier spirit stones
 * + curr_med - (INT) the amount of wealth of the character - mid tier spitit stones
 * + curr_high - (INT) the amount of weapth of the character - high tier spirit stones
 */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		health: {
			type: DataTypes.INTEGER,
			defaultValue: 100,
			allowNull: false,
		},
		health_max: {
			type: DataTypes.INTEGER,
			defaultValue: 100,
			allowNull: false,
		},
		stamina: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
		stamina_max: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
		soul_depth: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: false,
		},
		soul_depth_max: {
			type: DataTypes.FLOAT,
			defaultValue: 0.1,
			allowNull: false,
		},
		curr_gold: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		curr_low: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		curr_med: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		curr_high: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		// enable the createdAt and updatedAt timestamps?
		timestamps: true,
	});
};