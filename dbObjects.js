// Loads databases and creates associations between the models

const Sequelize = require('sequelize');

const sequelize = new Sequelize('SQdatabase', 'TribeOfOne', 's3cur3_password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only - path to the database
	storage: 'SQdatabase.sqlite',
});

const Users = sequelize.import('models/Users');

module.exports = { Users };