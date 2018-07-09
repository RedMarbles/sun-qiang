// A relational model of the occupations available to each user
/*
 * Occupations:
 * - id - (PK) (DEFAULT)
 * - user_id - (RK) (STRING) the user associated with this element
 * - occ_name - (STRING) the name of the occupation
 * - experience - (INT) the amount of experience accumulated by the user
 * - level - (INT) the star level of each occupation
 * - skill_points - (INT) the number of skill points accumulated so far by the user
 */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('occupations', {
		user_id: DataTypes.STRING,
		occ_name: DataTypes.STRING,
		experience: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		skill_points: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};