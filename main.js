const gameStateMessage = document.getElementById('game-state-message');
const player1Pieces = document.getElementById('player-1-pieces');
const player2Pieces = document.getElementById('player-2-pieces');
const board = document.getElementById('board');
const squares = [...document.querySelectorAll('#board > div.red')];
const resetGameButton = document.getElementById('reset-game-button');
const newGameButton = document.getElementById('new-game-button');

board.addEventListener('click', handleBoardClick);
resetGameButton.addEventListener('click', handleResetGameButtonClick);
newGameButton.addEventListener('click', handleNewGameButtonClick);


class Pawn {
  constructor(color, boardPosition) {
    this.color = color;
    this.boardPosition = boardPosition;
    this.isKing = false;
  }

  render() {
    const id = `${this.boardPosition[0]}${this.boardPosition[1]}`;
    const square = document.getElementById(id);
    square.innerHTML = `<img src='./assets/${this.color}${this.isKing ? 'back' : 'front'}.png'/>`;
  }
}


const players = [[], []]; // Arrays to fill with Pawn objects on init()


let currentPlayer, winner, currentBoard, chosenPawn;


function init() {
  // Place red pawns on red squares of bottom three rows
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      const boardPosition = [i, j];
      players[0].push(new Pawn('red', boardPosition));
    }
  }
  // Place black pawns on red squares of top three rows
  for (let i = 7; i > 4; i--) {
    for (let j = 0; j < 4; j++) {
      const boardPosition = [i, j];
      players[1].push(new Pawn('black', boardPosition));
    }
  }
  currentBoard = [
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1]
  ];
  currentPlayer = players[0];
  winner = null;
  chosenPawn = null;
  render();
}

function render() {
  player1Pieces.textContent = players[0].length;
  player2Pieces.textContent = players[1].length;
  squares.forEach(square => square.innerHTML = '');
  for (player of players) {
    for (pawn of player) {
      pawn.render();
    }
  }
}

function handleBoardClick(event) {

}

function handleResetGameButtonClick(event) {

}

function handleNewGameButtonClick(event) {

}


init();
