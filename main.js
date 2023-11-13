const gameStateMessage = document.getElementById('game-state-message');
const player1Pieces = document.getElementById('player-1-pieces');
const player2Pieces = document.getElementById('player-2-pieces');
const board = document.getElementById('board');
const resetGameButton = document.getElementById('reset-game-button');
const newGameButton = document.getElementById('new-game-button');

board.addEventListener('click', handleBoardClick);
resetGameButton.addEventListener('click', handleResetGameButtonClick);
newGameButton.addEventListener('click', handleNewGameButtonClick);


let currentPlayer, winner, currentBoard, chosenPawn;


function init() {
  render();
}

function render() {

}

function handleBoardClick(event) {

}

function handleResetGameButtonClick(event) {

}

function handleNewGameButtonClick(event) {

}


init();
