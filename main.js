const gameStateMessage = document.getElementById('game-state-message');
const player1Pieces = document.getElementById('player-1-pieces');
const player2Pieces = document.getElementById('player-2-pieces');
const board = document.getElementById('board');
const squares = [...document.querySelectorAll('#board > div.red')];
const resetGameButton = document.getElementById('reset-game-button');

board.addEventListener('click', handleBoardClick);
resetGameButton.addEventListener('click', handleResetGameButtonClick);


class Pawn {
  constructor(color, boardPosition) {
    this.color = color;
    this.boardPosition = boardPosition;
    this.isKing = false;
  }

  render() {
    const id = `${this.boardPosition[0]}${this.boardPosition[1]}`;
    const square = document.getElementById(id);
    square.style.backgroundImage = `url('./assets/${this.color}${this.isKing ? 'back' : 'front'}.png')`;
    square.style.backgroundPosition = 'center';
    square.style.backgroundSize = '90%';
    square.style.backgroundRepeat = 'no-repeat';
    if (
      (currentPlayer === 0 && this.color === 'red') ||
      (currentPlayer === 1 && this.color === 'black')
    ) square.classList.add('chooseable');
  }
}


let currentPlayer, winner, currentBoard, legalMoves, chosenPawn;
const players = [[], []]; // Arrays to fill with Pawn objects on init()


function init() {
  players[0] = [];
  players[1] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
        const boardPosition = [i, j];
        if (i < 3) players[0].push(new Pawn('red', boardPosition));
        if (i > 4) players[1].push(new Pawn('black', boardPosition));
      }
    }
  }
  currentBoard = [
    [players[0][0], 0, players[0][1], 0, players[0][2], 0, players[0][3], 0],
    [0, players[0][4], 0, players[0][5], 0, players[0][6], 0, players[0][7]],
    [players[0][8], 0, players[0][9], 0, players[0][10], 0, players[0][11], 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, players[1][0], 0, players[1][1], 0, players[1][2], 0, players[1][3]],
    [players[1][4], 0, players[1][5], 0, players[1][6], 0, players[1][7], 0],
    [0, players[1][8], 0, players[1][9], 0, players[1][10], 0, players[1][11]]
  ];
  currentPlayer = 0;
  winner = null;
  chosenPawn = null;
  legalMoves = null;
  render();
}

function render() {
  resetSquareCSS();
  renderTextElements();
  renderPawns();
}

function resetSquareCSS() {
  squares.forEach(square => {
    square.style.background = 'none';
    square.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    square.classList.remove(
      'chooseable', 
      'legal-regular-move', 
      'legal-jump-move'
    );
  });
  if (legalMoves) {
    legalMoves.regularMoves.forEach(move => {
      const id = `${move[0]}${move[1]}`;
      document.getElementById(id).classList.add(
        'legal-regular-move',
        'chooseable'
      );
    });
    legalMoves.jumpMoves.forEach(move => {
      const id = `${move[0]}${move[1]}`;
      document.getElementById(id).classList.add(
        'legal-jump-move',
        'chooseable'
      );
    });
  }
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
  if (!event.target.classList.contains('chooseable')) return;
  squares.forEach(square => square.classList.remove(
    'legal-regular-move',
    'legal-jump-move'
  ));
  // Split digits of id into array of two digits (board coordinates)
  const coordinates = (event.target.id.split('').map(n => parseInt(n)));

  if (!chosenPawn) {
    legalMoves = checkForMoves(coordinates[0], coordinates[1]);
    if (legalMoves.regularMoves.length === 0 && legalMoves.jumpMoves.length === 0) return;
    chosenPawn = currentBoard[coordinates[0]][coordinates[1]];
  } else {
    if (
      (chosenPawn.boardPosition[0] !== coordinates[0]) &&
      (chosenPawn.boardPosition[1] !== coordinates[1])
    ) {
      currentBoard[chosenPawn.boardPosition[0]][chosenPawn.boardPosition[1]] = 0;
      chosenPawn.boardPosition = coordinates;
      if (
        (chosenPawn.color === 'red' && coordinates[0] === 7) ||
        (chosenPawn.color === 'black' && coordinates[0] === 0) 
      ) chosenPawn.isKing = true;
      currentBoard[coordinates[0]][coordinates[1]] = chosenPawn;
      currentPlayer = (currentPlayer + 1) % 2;
    }
    chosenPawn = null;
    legalMoves = null;
  }
  render();
}

function checkForMoves(row, column) {
  let possibleMoves;
  const pawn = currentBoard[row][column];
  if (pawn.isKing) {
    possibleMoves = [
      [row + 1, column + 1],
      [row + 1, column - 1],
      [row - 1, column + 1],
      [row - 1, column - 1],
    ];
  } else if (pawn.color === 'red') {
    possibleMoves = [
      [row + 1, column + 1],
      [row + 1, column - 1],
    ];
  } else if (pawn.color === 'black') {
    possibleMoves = [
      [row - 1, column + 1],
      [row - 1, column - 1],
    ];
  }
  const filteredMoves = possibleMoves.filter(move => {
    // return (move[0] > -1 && move[0] < 8) && (move[1] > -1 && move[1] < 8)
    return currentBoard[move[0]][move[1]] !== undefined;
  });
  const regularMoves = checkForRegularMoves(filteredMoves);
  const jumpMoves = checkForJumpMoves(pawn, filteredMoves);

  /*===== DEBUG =====*/
  console.log('regularMoves: ', regularMoves);
  console.log('jumpMoves: ', jumpMoves);
  /*=================*/

  return { regularMoves, jumpMoves };
}

function checkForRegularMoves(possibleMoves) {
  return possibleMoves.filter(move => currentBoard[move[0]][move[1]] === 0);
}

function checkForJumpMoves(pawn, possibleMoves) {
  return possibleMoves.map(move => {
    const adjacentPawn = currentBoard[move[0]][move[1]];
    if (
      !(adjacentPawn instanceof Pawn) ||
      adjacentPawn.color === pawn.color
    ) return null;
    if (       // check up-left
      (move[0] > pawn.boardPosition[0] && move[1] < pawn.boardPosition[1]) &&
      currentBoard[move[0] + 1][move[1] - 1] === 0
    ) return [move[0] + 1, move[1] - 1];
    else if (  // check up-right
      (move[0] > pawn.boardPosition[0] && move[1] > pawn.boardPosition[1]) &&
      currentBoard[move[0] + 1][move[1] + 1] === 0
    ) return [move[0] + 1, move[1] + 1];
    else if (  // check down-left
      (move[0] < pawn.boardPosition[0] && move[1] < pawn.boardPosition[1]) &&
      currentBoard[move[0] - 1][move[1] - 1] === 0
    ) return [move[0] - 1, move[1] - 1];
    else if (  // check down-right
      (move[0] < pawn.boardPosition[0] && move[1] > pawn.boardPosition[1]) &&
      currentBoard[move[0] - 1][move[1] + 1] === 0
    ) return [move[0] - 1, move[1] + 1];
  }).filter(move => move !== null);
}

function handleResetGameButtonClick(event) {
  init();
}


init();
