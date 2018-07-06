module.exports = {
	occupations: [
		'Apothecary',
		'Physician',
		'Beast Tamer',
		'Formation Master',
		'Soul Oracle',
		'Celestial Designer',
		'Poison Master',
		'Painter',
		'Demonic Tunist',
		'Blacksmith',
		'Tea Master',
	],
	attributes: [
		// Apothecaries heal Physicans, and do reduced damage to Poison Masters
		{ user: 'Apothecary', target: 'Physician', mulitplier: -0.5 },
		{ user: 'Apothecary', target: 'Poison Master', mulitplier: 0.7 },
		// Soul Oracles take reduced damage from all professions except Poison Masters
		// Nobody can harm a Tea Master except another Tea Master, or a Poison Master
		{ user: 'Apothecary', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Physician', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Beast Tamer', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Formation Master', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Soul Oracle', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Celestial Designer', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Poison Master', target: 'Tea Master', mulitplier: 0.5 },
		{ user: 'Painter', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Demonic Tunist', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Blacksmith', target: 'Tea Master', mulitplier: 0.0 },
		{ user: 'Tea Master', target: 'Tea Master', mulitplier: 2.0 },
	],
};