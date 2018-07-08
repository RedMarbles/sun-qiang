// A model of the Users database
/*
 * Users:
 * - user_id - (PK) (STRING)
 * - health - (INT) how much health is remaining
 * - health_max - (INT) the maximum health for the character
 * - slaps - (INT) number of slaps remaining for the day
 * - stamina - (INT) stamina points, used to execute active skills
 * - stamina_max - (INT) the maximum stamina for the character
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
		slaps: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
		stamina: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
	}, {
		// enable the createdAt and updatedAt timestamps?
		timestamps: true,
	});
};