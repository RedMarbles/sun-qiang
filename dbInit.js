// Used only to initialize and sync the databases

const Sequelize = require('sequelize');

const sequelize = new Sequelize('SQdatabase', 'TribeOfOne', 's3cur3_password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAlias: false,
	// SQLite only - path to the database
	storage: 'SQdatabase.sqlite',
});

sequelize.import('models/Users');
sequelize.import('models/Occupations');

// Boolean, becomes true if either '--force' or '-f' was used in the arguments when running this command
const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(() => {
	// Set initial values if necessary
	if (force) console.log('Database reset.');
	console.log('Database synced.');
	sequelize.close();
}).catch(console.error);