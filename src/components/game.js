import React, { Component } from 'react';
import Cell from './cell'
import './style.css'

class Game extends Component {

  constructor() {
    super()
  }

  randomBetween(min, max){
    return Math.floor(Math.random() * max) + min
  }

  componentWillMount() {
    // generate cell object based on the letter on the map
    // this means that cell state (like monster hit points) are stored here

    var cells = this.state.cellObjs;
    for(var c=0; c<this.props.gameMap.length; c++){
      var cellValue = this.props.gameMap[c];
      var coords = this.coordsFromIdx(c)
      switch(cellValue){
        case("F"):
          // empty cell
          var cellObj = {
            type: "empty",
            x: coords.x,
            y: coords.y
          }

          cells.push(cellObj);
          break;

        case("E"):
          // wall
          var cellObj = {
            type: "wall",
            x: coords.x,
            y: coords.y
          }

          cells.push(cellObj);
          break;

        case("P"):
          // player cell
          var cellObj = {
            type: "player",
            x: coords.x,
            y: coords.y
          }

          cells.push(cellObj);
          break;

        case("M"):

          // pick a level
          var level = this.randomBetween(1, 3)
          var cellObj = {
            type: "monster",
            x: coords.x,
            y: coords.y,
            level: level,
            hp: 10 * level
          }

          cells.push(cellObj);
          break;

        case("B"):
          var level = 5;
          var cellObj = {
            type: "boss",
            x: coords.x,
            y: coords.y,
            level: level,
            hp: 10 * level
          }

          cells.push(cellObj);
          break;

        case("W"):

          var cellObj = {
            type: "weapon",
            x: coords.x,
            y: coords.y,
          }

          cells.push(cellObj);
          break;

        case("H"):

          var cellObj = {
            type: "health",
            x: coords.x,
            y: coords.y,
          }

          cells.push(cellObj);
          break;
      } // end switch
    } // end loop

    this.setState({cellObjs: cells})

  }

  componentDidMount() {
    // attach key handler
    document.onkeydown = this.keyHandle;
  }

  getCell(x, y) {
    // fetches cellObj given the x,y coordinates

    var i = this.idxFromCoords(x,y)
    return this.state.cellObjs[i]
  }

  clearCell(x, y) {
    // cell at x,y is removed and replaced with an emptyCell Object

    var state = this.state;
    var idx = this.idxFromCoords(x, y)
    state.cellObjs[idx] = {
      type: "empty",
      x: x,
      y: y
    };   // replace the player's loc with an empty array

    this.setState(state);

  }

  gainXp(xp) {
    var state = this.state;
    state.player.xp += xp;
    state.player.level = Math.floor(state.player.xp / 100) + 1
    this.setState(state);
  }

  changeHealth(health) {
    var state = this.state;
    state.player.health += health;
    this.setState(state);
  }

  damageClasses() {
    return [4, 6, 8, 10, 12, 20] // the standard D&D dice values
  }

  upgradeWeapon() {
    var damages = this.damageClasses()
    var state = this.state;
    var currentDamage = state.player.weapon;

    var idx = damages.indexOf(currentDamage)
    if(currentDamage < damages[damages.length - 1]){
      state.player.weapon = damages[idx + 1]
    }

  }

  keyHandle(e) {

    var keyCode = e.keyCode;
    if([37, 38, 39, 40].indexOf(keyCode) > -1) {
      e.preventDefault();
    }
    var game = this;

    // left arrow 	37
    // up arrow 	38
    // right arrow 	39
    // down arrow 	40

    function _findCell(keyCode){
      // determines which direction player wants to interact in and returns the
      // cell in that direction.
      var playerX = game.state.player.loc.x;
      var playerY = game.state.player.loc.y
      switch(keyCode){

        case(37):
          //left arrow
          // x can't be 0
          if(playerX > 0){var cell = game.getCell(playerX - 1 , playerY)}
          break;

        case(38):
          //up arrow
          if(playerY>0){var cell = game.getCell(playerX, playerY - 1)}
          break;
        case(39):
          // right arrow
          if(playerX<Math.sqrt(game.props.gameMap.length) -1 ){
            var cell = game.getCell(playerX + 1, playerY)
          }
          break;
        case(40):
          // down arrow
          if(playerY <Math.sqrt(game.props.gameMap.length) - 1){
            var cell = game.getCell(playerX, playerY + 1)
          }
          break;
      }
      if(cell !== undefined){return cell;}
    }

    function interact(cell){
      // calls the appropriate function to interact with the cell

      switch(cell.type){

        case("empty"):
          moveTo(cell);
          break;
        case("wall"):
          bumpintoWall();
          break;
        case("monster"):
          fight(cell);
          break;
        case("boss"):
          fight(cell);
          break;
        case("weapon"):
          pickupWeapon(cell);
          moveTo(cell)
          break;
        case("health"):
          pickupHealth(cell);
          moveTo(cell)
          break;
      }

    }

    function moveTo(emptyCell){
      // change player state to location of emptyCell
      // emptyCell(cellObj)

      var cellObjs = game.state.cellObjs;
      var oldX = game.state.player.loc.x;
      var oldY = game.state.player.loc.y;
      var playerIdx = game.idxFromCoords(oldX, oldY);
      var player = cellObjs[playerIdx];  //pull the player out of the array

      game.clearCell(oldX, oldY)

      var newX = emptyCell.x;
      var newY = emptyCell.y
      var newIdx = game.idxFromCoords(newX, newY);  //insert player into new spot
      cellObjs[newIdx] = player;

      var state = game.state;
      state.player.loc.x = newX;
      state.player.loc.y = newY
      game.setState(state)
    }

    function bumpintoWall(){
      console.log("ouch!")
    }

    function fight(badGuy){
      // player rolls to do damage to bad guy
        // if bad guy is out of hp, clear from map
      // bad guy rolls to do damage to player
        // is player is out of hp, game over

        function _playerAttack(badGuy){

          var state = game.state;
          // player does damage to the bad guy.
          // returns true if the bad guy is dead.

          // deal damage to bad guy
          var playerDamage = game.randomBetween(1, game.state.player.weapon + game.state.player.level)
          badGuy.hp -= playerDamage;
          if (badGuy.hp <= 0) {

            // player wins!
            console.log("monster vanquished!");
            game.clearCell(badGuy.x, badGuy.y);
            if(badGuy.type == "boss") {game.gameOver(true)}
            // gain xp
            game.gainXp(badGuy.level * 10);
            return true
          } else {
            // put monster back in cellObjs
            var badGuyIdx = game.idxFromCoords(badGuy.x, badGuy.y)
            state.cellObjs[badGuyIdx] = badGuy;
            game.setState(state)
            return false
          }
        }

        function _badGuyAttack(){

            var badGuyWeapon = game.damageClasses()[badGuy.level];
            var badGuyDamage = game.randomBetween(1, badGuyWeapon);
            // state.player.health -= badGuyDamage;
            game.changeHealth(-badGuyDamage)
            if (game.state.player.health <= 0) {
              game.gameOver(false)
              console.log("game over!")
            }
        }

      var result = _playerAttack(badGuy);
      if(!result){_badGuyAttack();}
    }

    function pickupWeapon(weaponCell){
      console.log("hey there's a weapon!")

      game.upgradeWeapon();
      game.clearCell(weaponCell);

    }

    function pickupHealth(healthCell){
      // pick up the health pack.
      // add to heealth
      // clear cell
      // move to cell
      game.changeHealth(10)
      game.clearCell(healthCell.x, healthCell.y)
    }

    var cellObj = _findCell(keyCode)
    if(cellObj !== null){interact(cellObj);}

  }

  coordsFromIdx(i) {
    // returns x,y coordinates based on an index

    var width = Math.sqrt(this.props.gameMap.length);
    var x = i % width;
    var y = Math.floor(i / width);
    return({x:x, y:y})
  }

  idxFromCoords(x,y) {
    // returns an index from x,y cordinates

    var gridSide = Math.sqrt(this.props.gameMap.length)
    return (y *  gridSide) + x

  }

  distance(x1, y1, x2, y2) {
    // returns the distance from cell1 to cell2
    var xs = Math.pow(x2 - x1, 2)
    var ys = Math.pow(y2 - y1, 2)
    return Math.sqrt(xs + ys)
  }

  getInitialState() {
    // get player's initial loc
    var game = this;
    function getPlayerLoc(gameMap){

      for(var i=0; i<gameMap.length; i++){
        var char = gameMap[i];
        if(char == "P"){return game.coordsFromIdx(i)}
      }
    }

    var playerLoc = getPlayerLoc(this.props.gameMap);

    return {
      cellObjs: [],  // an array of objects representing a cell
      player: {
        loc: {x:playerLoc.x, y:playerLoc.y},
        hp: 50,
        level: 1,
        weapon: 4,
        xp: 0,
        health: 100
      }
    }

  }

  gameOver(win) {
    // the game is over
    // win(bool) if the player won the game

    var state = this.state;
    state.gameWon = win;

    // player should disappear if they lost
    if(!win){
      this.clearCell(this.state.player.loc.x, this.state.player.loc.y)
    }
    this.setState(state)

  }

  eachCell(cellObj, i, arr) {
    // contructs a cell based on its value.
    //cell is shown if both x and y are within 5 from playerX

      var xDistance = Math.abs(this.state.player.loc.x - cellObj.x)
      var yDistance = Math.abs(this.state.player.loc.y - cellObj.y)

      var inside = (xDistance < 5 && yDistance < 5) || cellObj.type == "player"

      return (
        <Cell
          type={cellObj.type}
          x={cellObj.x}
          y={cellObj.y}
          blackOut={!inside}
          key={i}
          id={i}
          ref={i} />)
  }

  renderGame() {

    return (
      <div className="game">
        <ul className="list-inline dashboard text-center">
          <li>Health: {this.state.player.health}</li>
          <li>Attack: {this.state.player.weapon}</li>
          <li>Level: {this.state.player.level}</li>
          <li>XP: {this.state.player.xp}</li>
        </ul>
        {this.state.cellObjs.map(this.eachCell)}
      </div>
    )
  }

  renderGameOver() {
    return (
      <div className="game">
        <ul className="list-inline dashboard text-center">
          <li>Health: {this.state.player.health}</li>
          <li>Attack: {this.state.player.weapon}</li>
          <li>Level: {this.state.player.level}</li>
          <li>XP: {this.state.player.xp}</li>
        </ul>
        <div className="text-center dashboard"> {this.state.gameWon ? "You win!" : "You lost!" }</div>
        {this.state.cellObjs.map(this.eachCell)}
      </div>
    )
  }

  render() {

    if(this.state.gameWon === undefined){
      return this.renderGame()
    } else {
      return this.renderGameOver()
    }
  }
}

export default Game;
