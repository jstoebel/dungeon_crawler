import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Game from './components/game'
import './index.css';

import {gameMap} from 'map'

ReactDOM.render(
  <Game gameMap={gameMap}/>,
  document.getElementById('root')
);
