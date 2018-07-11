# sun-qiang
A Discord bot that provides a battle arena for cultivators

## Commands:

* help - Prints information about the available commands
* info - Prints informaiton about the current stats of the user/target as well as combat multiplier information
* faceslap - Execute an attack on a targeted person
* reset - Resets the health and ammunition of everyone on the server

## Version 1 - Battle:
Battle currently takes place in the form of a simple slap attack.  
Each attack does a base damage of 10 HP, while each person starts with 100 HP as the base.  
However, each person is only allowed 5 slaps.   

On the other hand, there are 11 occupations currently available, and each occupation has certain combat multipliers against other occupations that give them increased offense or defense.  
These occupations are based on some of the occupations from Library of Heaven's Path:  

* Apothecary
* Physician
* Beast Tamer
* Formation Master
* Soul Oracle
* Celestial Designer
* Poison Master
* Painter
* Demonic Tunist
* Blacksmith
* Tea Master


## Version 2 - Cultivation:

Each player is able to gain experience separately in each of the 11 different roles. 
Each role has a set of skills under it, and each skill can have various effects. One such effect is gaining exp from usage. Obtained exp is collected into the exp pool of the occupation or cultivation realm, and once a threshold is reached or conditions are met, they level up and go to the next level of the realm or occupation. Each time they level up, they are given a skill point and given the choice to unlock a new skill from that occupation's skill tree.

Work Progress:
+ Added in a skill and occupation framework, so that using skills can raise exp of an occupation
+ Consume stamina on skill use
+ Regenerate stamina over time
+ Info command now shows skill and occupation information instead of attribute matchups
+ Info message -> dm + auto-update

Work to do:
* Interface class for sending messages
* Implement skill cooldown
* Set up separate cultivation and master teacher occupations and isolate them from the rest of the elements.
* Item framework
* Stats framework - Base stats + passive skill stats + equipment stats + active skill/consumable stats - Strength, Soul Depth, Endurance
* Battle framework
* Marketplace framework for selling items to sink, as well as trading items between users (sell to market for 1/5th of base price, sell to user for 3/5th of base price, buy from user for 5/5th of base price)