// A relational model of the skills available to a user
/*
 * Skills:
 * - id - (PK) (DEFAULT)
 * - user_id - (RK) (STRING) the user associated with this element
 * - occ_id - (RK) (STRING) the name of the associated occupation
 * - skill_name - (STRING) the name of the skill
 * - occ_name - (STRING) the name of the associated occupation
 * - uses - (INT) the number of times the user has used this skill
 */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('skills', {
		user_id: DataTypes.STRING,
		occ_id: DataTypes.STRING,
		skill_name: DataTypes.STRING,
		occ_name: DataTypes.STRING,
		uses: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};