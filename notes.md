# Sun Qiang Documentation

[Starve's Glossary](https://www.starvearchive.com/library-of-heavens-path/library-of-heavens-path-glossary/)

## Commands

* backstory - a joke command that generates a backstory using a set formula. Can be expanded upon later to create a full story.
* faceslap - test command only for now, attacks a mentioned player dealing damage to them. Uses 'slaps' as ammunition. //TODO - change to using stamina when made into a skill
* help - the help for commands
* info - mention a player to get their stats and occupation progression
* reset - admin only - resets all database for now
* role - changes the role of the player between one of the 11 occupations
* skill - use a specified skill
* skillpoints - check and buy skills with skillpoints

* inventory - manage the player inventory //TODO
* request - interact with another player //TODO



## Basics

Use the `$help` command for information about the commands available to you. If you want to know how to use a specific command, you can use the `$help <command_name>` command.
You can use the `$info` command to get information about your own stats. 



## Occupations

There are 2 main occupations (that are always active) and 11 supporting occupations (of which only one can be active at a time). You can switch between the 11 supporting occupations using the `$role` command.

The two main occupations are:

* Cultivation
* Master Teacher - Can produce cultivation manuals

The 11 supporting occupations are:

* Apothecary - Can create consumable potions and farm herbs
* Physician - Can provide healing for themselves or others (for money)
* Beast Tamer - Provides pet-type items that assist in battle or other ways
* Formation Master - Defensive class, can provide buffs for others
* Soul Oracle - Can create enlightenment stones, which can raise maximum soul depth
* Celestial Designer - Crafts consumable items for battle
* Poison Master - Offensive class, attacks cause status effects like paralysis and poison
* Painter - Creates passive item paintings that boost soul depth recovery rate, but also has great soul depth consumption
* Demonic Tunist - Offensive class, attacks hurt enemy's soul and hp
* Blacksmith - Can specialize in weapon or armor crafting
* Tea Master



## Skills

Each occupation gives you a unique set of skills to use. Skills can be used by using the `$skill <skill_name>` command. Each skill consumes stamina or SP when used, and also has a cooldown which stops them from being used consecutively. Stamina will refill automatically over time, and you just need to wait for the specified cooldown time before you can use the skill again.  

In order to check the stats of any skill, you can use the command `$skillpoints info <skill_name>`, where you can check things like the cooldown time and the description of the skill.



## Levelling up

When you have attained sufficient experience in any field, as well as have obtained other specific requirements depending on the class, you will increase your rank in that specific occupation. Each increase in rank will also give you one skill point for that occupation, which you can use to unlock a new skill from that occupation's skill tree.
Use the `$skillpoints` or `$sp` command to use your skillpoints.

* `$skillpoints check <occupation_name>` - Lists all the skills that you can unlock from the specified occupation skill tree.
* `$skillpoints info <skill_name>` - Lists information about the specified skill, such as the stamina and soul depth consumption, cooldowns, and description of the effects.
* `$skillpoints buy <skill_name>` - Unlocks the specified skill by consuming a skill point, so that you can use the skill.



## Currency

There are four kinds of currency - gold, low-tier spirit stones, middle-tier spirit stones, and high-tier spirit stones. 

* Gold is normally earned through actions up to Fighter 8-dan or 2-star Master Teacher. 
* Low-Tier Spirit Stones are earned between 2-star Master Teacher to 4-star Master Teacher (Transcendent Mortal )
* Mid-Tier Spirit Stones are earned between 4-star Master Teacher to 6-star Master Teacher
* High-Tier Spirit Stones are earned between 6-star Master Teacher to 9-star Master Teacher



## Items

Items can either be obtained either by performing a relevant skill, or by buying them from someone else who has that item. There is no NPC shop from where items can be bought. 

Once an item is obtained, there are several things you can do with it:  

* Sell the item to the auction-house for 20% of its base price.
* Put the item for sale to other players in the auction-house for 60% of its base price.
* Consume the item directly.
* Consume the item through a skill that requires that type of item.
* Equip the item if it's a weapon or armor.

Note that when buying from other players, the buyer has to pay 100% of the base price of the item, while the seller only obtains 60% of the price. The remaining 40% of the price is taken by the auction-house.

Items may either be of several types. The most common of these types are raw materials for crafting, weapons and armor for battle, consumables that grant specific one-time effects or short term buffs/debuffs, and cultivation manuals that proide long-term passive bonuses to certain skills.


## Stats

* Health - The amount of damage you can take before you are incapacitated. Updates at a base rate of 1 HP / minute.
* Stamina - The amount of energy you have. Skills consume stamina to use. Updates at 5 SP / minute.
* Soul Depth - The strength of mind or amount of concentration you have. Certain skills need soul depth to use. Updates at 0.1 / minute.
