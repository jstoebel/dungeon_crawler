import React from 'react';
import ReactDOM from 'react-dom';

import Game from './components/game'
import './style.css';

import gameMap from './map'

ReactDOM.render(
  <Game gameMap={gameMap} />,
  document.getElementById('root')
);
