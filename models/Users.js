// A model of the Users database
/*
 * Users:
 * - user_id - (PK) (STRING)
 * - health - (INT) how much health is remaining
 * - slaps - (INT) number of slaps remaining for the day
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
		}
	}, {
		// enable the createdAt and updatedAt timestamps?
		timestamps: true,
	});
};