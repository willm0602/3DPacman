"use strict";

import Game from "./Game.mjs";

function main() {
  var game = new Game();
  game.render();
}

window.onload = main;
