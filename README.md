# Dungeon Crawler
A React based Roguelike Dungeon Crawler Game with freecodecamp.com. [https://jstoebel-dungeon-crawler.herokuapp.com/](https://jstoebel-dungeon-crawler.herokuapp.com/)


The game accomplishes the following user stories:

 - I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.
 - All the items and enemies on the map are arranged at random.
 - I can move throughout a map, discovering items.
 - I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.
 - Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.
 - When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.
 - When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.
 - When I find and beat the boss, I win.
 - The game should be challenging, but theoretically winnable.

## Implementation notes

 - Each square on the map is a React component called `Cell`.
 - Each `Cell` has as its contents as its props. They are one of the following:
    - empty
    - player
    - a monster
    - a boss monster
    - a weapon upgrade
    - a health item
 - When the user presses any key, a single method is called that performs the following:
    - determine if the key was an arrow key (only valid keys in the game). Do nothing if not.
    - fetch the contents of the cell in the immediate direction the player wanted to move.
    - interact with that cell:

      - empty -> move to it
      - wall -> stay put
      - monster or boss -> fight
      - weapon -> upgrade weapon strength
      - health -> increase health (limit 100)

  - Additionally, there are several dedicated methods to handle the altering of state. For example `pickupHealth` increases the health of the player by 10. `upgradeWeapon` increases the strength of the players damage according to specific logic. In other words, dedicated functions are responsible for altering parts of the state. In the future I would like to refactor to have Redux assume this responsibility.
