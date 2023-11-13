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
    square.style.background = `no-repeat center/90% url('./assets/${this.color}${this.isKing ? 'back' : 'front'}.png')`;
    if (
      (currentPlayer === 0 && this.color === 'red') ||
      (currentPlayer === 1 && this.color === 'black')
    ) square.classList.add('chooseable');
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
    [players[1][0], players[1][1], players[1][2], players[1][3]],
    [players[1][4], players[1][5], players[1][6], players[1][7]],
    [players[1][8], players[1][9], players[1][10], players[1][11]],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [players[0][0], players[0][1], players[0][2], players[0][3]],
    [players[0][4], players[0][5], players[0][6], players[0][7]],
    [players[0][8], players[0][9], players[0][10], players[0][11]],
  ];
  currentPlayer = 0;
  winner = null;
  chosenPawn = null;
  render();
}

function render() {
  clearSquareCSS();
  renderTextElements();
  renderPawns();
}

function clearSquareCSS() {
  squares.forEach(square => {
    square.innerHTML = '';
    square.classList.remove('chooseable');
  });
}

function renderTextElements() {
  gameStateMessage.innerHTML = chosenPawn ?
    'Choose a square to move your pawn.' :
    `<span style='font-weight: 600'>Player ${currentPlayer + 1}</span>, select a piece to move.`;
  player1Pieces.textContent = players[0].length;
  player2Pieces.textContent = players[1].length;
}

function renderPawns() {
  for (player of players) {
    for (pawn of player) {
      pawn.render();
    }
  }
}

function handleBoardClick(event) {
  console.log(event.target);
}

function checkForMoves(square) {

}

function handleResetGameButtonClick(event) {

}

function handleNewGameButtonClick(event) {

}


init();
