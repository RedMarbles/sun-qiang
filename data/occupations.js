module.exports = {
	occupations: [
		{ name: 'Apothecary', alias: ['A', 'Pill Master'] },
		{ name: 'Physician', alias: ['Ph', 'Doctor'] },
		{ name: 'Beast Tamer', alias: [ 'BT', 'BM', 'Beast Master', 'Beast', 'Tamer'] },
		{ name: 'Formation Master', alias: ['FM', 'Formation'] },
		{ name: 'Soul Oracle', alias: ['SO', 'Soul'] },
		{ name: 'Celestial Designer', alias: ['CD', 'Celestial', 'Designer'] },
		{ name: 'Poison Master', alias: ['PM', 'Poison'] },
		{ name: 'Painter', alias: ['Pa', 'Paint'] },
		{ name: 'Demonic Tunist', alias: ['DT', 'Demonic', 'Tunist'] },
		{ name: 'Blacksmith', alias: ['B', 'Black', 'Smith'] },
		{ name: 'Tea Master', alias: ['TM', 'Tea', 'T'] },
	],
	attributes: [
		// Nobody can harm a Tea Master except another Tea Master, or a Poison Master
		{ user: 'Apothecary', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Physician', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Beast Tamer', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Formation Master', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Soul Oracle', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Celestial Designer', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Poison Master', target: 'Tea Master', multiplier: 0.5 },
		{ user: 'Painter', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Demonic Tunist', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Blacksmith', target: 'Tea Master', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Tea Master', multiplier: 3.0 },
		// Tea Masters cannot harm others
		{ user: 'Tea Master', target: 'Apothecary', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Physician', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Beast Tamer', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Formation Master', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Soul Oracle', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Celestial Designer', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Poison Master', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Painter', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Demonic Tunist', multiplier: 0.0 },
		{ user: 'Tea Master', target: 'Blacksmith', multiplier: 0.0 },
		// Soul Oracles take reduced damage from all except Soul Oracles and Demonic Tunists
		{ user: 'Apothecary', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Physician', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Beast Tamer', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Formation Master', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Soul Oracle', multiplier: 2.5 },
		{ user: 'Celestial Designer', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Poison Master', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Painter', target: 'Soul Oracle', multiplier: 0.7 },
		{ user: 'Demonic Tunist', target: 'Soul Oracle', multiplier: 1.5 },
		{ user: 'Blacksmith', target: 'Soul Oracle', multiplier: 0.7 },
		// Soul Oracles deal reduced damage to all occupations (except other Soul Oracles)
		{ user: 'Soul Oracle', target: 'Apothecary', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Physician', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Beast Tamer', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Formation Master', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Celestial Designer', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Poison Master', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Painter', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Demonic Tunist', multiplier: 0.7 },
		{ user: 'Soul Oracle', target: 'Blacksmith', multiplier: 0.7 },
		// Apothecaries heal Physicians and do reduced damage to Poison Masters
		{ user: 'Apothecary', target: 'Physician', multiplier: -0.7 },
		{ user: 'Apothecary', target: 'Poison Master', multiplier: 0.7 },
		// Physicians heal Apothecaries and do reduced damage to Beast Tamers
		{ user: 'Physician', target: 'Apothecary', multiplier: -0.7 },
		{ user: 'Physician', target: 'Beast Tamer', multiplier: 0.5 },
		// Beast Tamers do normal damage to everyone (except Soul Oracles and Tea Masters)
		// Formation Masters do reduced damage to other Formation Masters, but are effective against Blacksmiths
		{ user: 'Formation Master', target: 'Formation Master', multiplier: 0.5 },
		{ user: 'Formation Master', target: 'Blacksmith', multiplier: 1.5 },
		// Celestial Designers do extra damage against Blacksmiths
		{ user: 'Celestial Designer', target: 'Blacksmith', multiplier: 1.5 },
		// Poison Masters deal reduced damage to Apothecaries and Physicians and Celestial Designers, but increased damage to Beast Tamers and other Poison Masters
		{ user: 'Poison Master', target: 'Apothecary', multiplier: 0.5 },
		{ user: 'Poison Master', target: 'Physician', multiplier: 0.5 },
		{ user: 'Poison Master', target: 'Celestial Designer', multiplier: 0.7 },
		{ user: 'Poison Master', target: 'Beast Tamer', multiplier: 1.5 },
		{ user: 'Poison Master', target: 'Poison Master', multiplier: 2.0 },
		// Painters are lethal to Formation Masters
		{ user: 'Painter', target: 'Formation Master', multiplier: 3.0 },
		// The Demonic Tunist isn't good or bad against anything (except against Soul Oracles)
		// Blacksmiths deal extra damage to Celestial Designers
		{ user: 'Blacksmith', target: 'Celestial Designer', multiplier: 1.5 },
	],
};