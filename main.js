/*===== CONFIGURATION =====*/

const console = document.getElementById('console');
const gameStateMessage = document.getElementById('game-state-message');
const player1Pieces = document.getElementById('player-1-pieces');
const player2Pieces = document.getElementById('player-2-pieces');
const board = document.getElementById('board');
const squares = [...document.querySelectorAll('#board > div.red')];
const resetGameButton = document.getElementById('reset-game-button');

board.addEventListener('click', handleBoardClick);
resetGameButton.addEventListener('click', handleResetGameButtonClick);

const selectSound = new Audio('./assets/sounds/select.wav');
const jumpSound = new Audio('./assets/sounds/jump.wav');
const winSound = new Audio('./assets/sounds/win.wav');


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


let currentPlayer, winner, currentBoard, legalMoves, chosenPawn, resetCheck;
const players = [];


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
  resetCheck = false;
  render();
}


/*===== RENDER FUNCTIONS =====*/

function render() {
  resetSquareCSS();
  renderTextElements();
  renderPawns();
  renderGameResetButton();
}

function resetSquareCSS() {
  squares.forEach(square => {
    square.style.background = 'none';
    square.style.backgroundColor = 'var(--board-red-square)';
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
      const id = `${move[0][0]}${move[0][1]}`;
      document.getElementById(id).classList.add(
        'legal-jump-move',
        'chooseable'
      );
    });
  }
}

function renderTextElements() {
  if (winner !== null) {
    gameStateMessage.innerHTML =
      `<span style='font-weight: 600; color: var(--pawn-${players[winner][0].color})'>Player ${winner + 1} wins!</span>`;
  } else {
    gameStateMessage.innerHTML = chosenPawn ?
      'Choose a square to move your pawn.' :
      `<span style='font-weight: 600; color: var(--pawn-${players[currentPlayer][0].color})'>Player ${currentPlayer + 1}</span>, select a piece to move.`;
    }
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

function renderGameResetButton() {
  resetGameButton.style.setProperty(
    '--button-background-color', 'var(--dark-brown)'
  );
  resetGameButton.style.setProperty(
    '--button-color', 'var(--light-tan)'
  );
  if (!resetCheck) {
    resetGameButton.innerText = 'RESET GAME';
    resetGameButton.style.setProperty(
      '--hover-background-color', 'var(--light-tan)'
    );
    resetGameButton.style.setProperty(
      '--hover-color', 'var(--dark-brown)'
    );
  } else {
    resetGameButton.innerText = 'YOU SURE? (click again)';
    resetGameButton.style.setProperty(
      '--hover-background-color', 'var(--pawn-red)'
    );
    resetGameButton.style.setProperty(
      '--hover-color', 'var(--light-tan)'
    );
  }
}


/*===== EVENT HANDLER FUNCTIONS =====*/

function handleBoardClick(event) {
  if (!event.target.classList.contains('chooseable')) return;

  // Split event.target's id into array of two digits (board coordinates)
  const coordinates = event.target.getAttribute('id')
                                  .split('')
                                  .map(coordinate => parseInt(coordinate));
  const targetPawn = currentBoard[coordinates[0]][coordinates[1]];
  if (!chosenPawn || (chosenPawn && targetPawn)) {
    legalMoves = checkForMoves(targetPawn, coordinates[0], coordinates[1]);
    chosenPawn = (
      legalMoves.regularMoves.length === 0 &&
      legalMoves.jumpMoves.length === 0
    ) ? null : currentBoard[coordinates[0]][coordinates[1]];
    if (chosenPawn) selectSound.play();
  } else {
    makeMove(coordinates);
  }

  checkForWinner();
  render();
}

function handleResetGameButtonClick() {
  if (!resetCheck) {
    resetCheck = true;
    renderGameResetButton();
    setTimeout(() => {
      resetCheck = false;
      renderGameResetButton();
    }, 3000);
  } else {
    init();
  }
}


/*===== GAME LOGIC =====*/

function checkForMoves(pawn, row, column) {
  let possibleMoves;
  if (pawn.isKing) {
    possibleMoves = [
      [row + 1, column + 1],
      [row + 1, column - 1],
      [row - 1, column + 1],
      [row - 1, column - 1]
    ];
  } else if (pawn.color === 'red') {
    possibleMoves = [
      [row + 1, column + 1],
      [row + 1, column - 1]
    ];
  } else if (pawn.color === 'black') {
    possibleMoves = [
      [row - 1, column + 1],
      [row - 1, column - 1]
    ];
  }
  const filteredMoves = possibleMoves.filter(move => {
    return (
      currentBoard[move[0]] !== undefined &&
      currentBoard[move[0]][move[1]] !== undefined
    )
  });
  const regularMoves = checkForRegularMoves(filteredMoves);
  const jumpMoves = checkForJumpMoves(pawn, filteredMoves);

  // check for possible double jumps
  jumpMoves.forEach(move => {
    const futurePawn = new Pawn(pawn.color, [move[0][0], move[0][1]]);
    const extraJumpMoves = checkForMoves(futurePawn, move[0][0], move[0][1]);
    if (extraJumpMoves.jumpMoves && extraJumpMoves.jumpMoves.length > 0) {
      extraJumpMoves.jumpMoves.forEach(extraMove => jumpMoves.push(extraMove));
    }
  });

  return { regularMoves, jumpMoves };
}

function checkForRegularMoves(possibleMoves) {
  return possibleMoves.filter(move => currentBoard[move[0]][move[1]] === 0);
}

function checkForJumpMoves(pawn, possibleMoves) {
  return possibleMoves.map(move => {
    const adjacentPawn = currentBoard[move[0]][move[1]];
    if (
      move[0] + 1 > 7 || move[0] - 1 < 0 ||
      move[1] + 1 > 7 || move[1] - 1 < 0 ||
      !(adjacentPawn instanceof Pawn) ||
      adjacentPawn.color === pawn.color
    ) return null;
    if (       // check up-left
      (move[0] > pawn.boardPosition[0] && move[1] < pawn.boardPosition[1]) &&
      currentBoard[move[0] + 1][move[1] - 1] === 0
    ) return [[move[0] + 1, move[1] - 1], adjacentPawn];
    else if (  // check up-right
      (move[0] > pawn.boardPosition[0] && move[1] > pawn.boardPosition[1]) &&
      currentBoard[move[0] + 1][move[1] + 1] === 0
    ) return [[move[0] + 1, move[1] + 1], adjacentPawn];
    else if (  // check down-left
      (move[0] < pawn.boardPosition[0] && move[1] < pawn.boardPosition[1]) &&
      currentBoard[move[0] - 1][move[1] - 1] === 0
    ) return [[move[0] - 1, move[1] - 1], adjacentPawn];
    else if (  // check down-right
      (move[0] < pawn.boardPosition[0] && move[1] > pawn.boardPosition[1]) &&
      currentBoard[move[0] - 1][move[1] + 1] === 0
    ) return [[move[0] - 1, move[1] + 1], adjacentPawn];
    // the above returns are [legal move, jumped pawn] arrays
    else return null;
  }).filter(move => move !== null);
}

function makeMove(coordinates) {
  if (currentBoard[coordinates[0]][coordinates[1]] === 0) {
    // Move chosen pawn to new chosen location...
    currentBoard[chosenPawn.boardPosition[0]][chosenPawn.boardPosition[1]] = 0;
    chosenPawn.boardPosition = coordinates;
    // ..."kinging" that pawn if applicable...
    if (
      (chosenPawn.color === 'red' && coordinates[0] === 7) ||
      (chosenPawn.color === 'black' && coordinates[0] === 0) 
    ) chosenPawn.isKing = true;
    currentBoard[coordinates[0]][coordinates[1]] = chosenPawn;
    // ...removing opponent's jumped pawn(s) if applicable...
    legalMoves.jumpMoves.forEach((move, index) => {
      if (move[0][0] === coordinates[0] && move[0][1] === coordinates[1]) {
        jumpSound.play();
        for (let i = 0; i <= index; i++) {
          const jumpedPawn = legalMoves.jumpMoves[i][1];
          currentBoard[jumpedPawn.boardPosition[0]][jumpedPawn.boardPosition[1]] = 0;
          players[(currentPlayer + 1) % 2].splice(players[(currentPlayer + 1) % 2].indexOf(jumpedPawn), 1);
        }
      }
    });
    // ...and advancing to next player's turn
    currentPlayer = (currentPlayer + 1) % 2;
  }
  chosenPawn = null;
  legalMoves = null;
}

function checkForWinner() {
  if (players[1].length === 0) winner = 0;
  if (players[0].length === 0) winner = 1;
  if (winner) winSound.play();
}


/*===============*/

init();
