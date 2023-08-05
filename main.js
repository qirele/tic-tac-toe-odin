const Gameboard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const placeMarker = (row, col, marker) => {
    board[row][col] = marker;
  };
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = "";
      }
   }
  }
  const getBoard = () => board;

  return {
    placeMarker,
    getBoard,
    resetBoard
  };
})();

// factory
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const Gameflow = (player1, player2) => {
  let moveNumber = 0;
  let gameFinished = false;
  const getGameFinished = () => gameFinished;

  const players = [
    {
      name: player1.getName(),
      marker: player1.getMarker(),
    },
    {
      name: player2.getName(),
      marker: player2.getMarker(),
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    for (let i = 0; i < board.length; i++) {

      // three in a row
      let arr = [board[i][0], board[i][1], board[i][2]];
      if (arr[0] === arr[1] && arr[1] == arr[2]) {
        if (arr[0] === "") continue;
        if (activePlayer.marker !== arr[0]) { switchPlayerTurn() }
        gameFinished = true;
        return {
          winner: activePlayer,
          coords: [[i, 0], [i, 1], [i, 2]]
        }
      }

      // three in a column
      arr = [board[0][i], board[1][i], board[2][i]];
      if (arr[0] === arr[1] && arr[1] == arr[2]) {
        if (arr[0] === "") continue;
        if (activePlayer.marker !== arr[0]) { switchPlayerTurn() }
        gameFinished = true;
        return {
          winner: activePlayer,
          coords: [[0, i], [1][i], [2, i]]
        }
      }

    }

    // three in diagonal
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === "") return "";
      if (activePlayer.marker !== board[0][0]) { switchPlayerTurn() }
      gameFinished = true;
      return {
        winner: activePlayer,
        coords: [[0, 0], [1, 1], [2, 2]]
      }
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === "") return "";
      if (activePlayer.marker !== board[0][2]) { switchPlayerTurn() }
      gameFinished = true;
      return {
        winner: activePlayer,
        coords: [[0, 2], [1, 1], [2, 0]]
      }
    }

    if (moveNumber === 9) {
      gameFinished = true;
      return "tie";
    }

    return "";
  };

  const getActivePlayer = () => activePlayer;

  const restartGame = (player1Name, player2Name) => {
    moveNumber = 0;
    gameFinished = false;
    activePlayer = players[0];
    Gameboard.resetBoard();
    if (player1Name && player2Name) {
      players[0].name = player1Name;
      players[1].name = player2Name;
    }
  }

  const playRound = (row, column) => {
    moveNumber++;
    Gameboard.placeMarker(row, column, activePlayer.marker);
    switchPlayerTurn();
  };

  return {
    getActivePlayer,
    playRound,
    getGameFinished,
    checkWinner,
    restartGame,
  };
};

const DisplayController = (() => {
  const boardDiv = document.querySelector(".board");
  const statusPara = document.querySelector(".status p");
  const restartBtn = document.querySelector(".restart");
  const game = Gameflow(Player("jeff", "x"), Player("dud", "o"));

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = Gameboard.getBoard();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let p = document.createElement("p");
        p.className = "cell";
        p.textContent = board[i][j];
        p.setAttribute("data-row", i);
        p.setAttribute("data-col", j);
        boardDiv.appendChild(p);
      }
    }

    statusPara.textContent = `Current player: ${game.getActivePlayer().marker} (${game.getActivePlayer().name})`;

  };

  const handleRestartClick = (e) => {
    const player1Name = document.querySelector("#player1").value;
    const player2Name = document.querySelector("#player2").value;
    if (player1Name !== "" && player2Name !== "") {
      game.restartGame(player1Name, player2Name);
    } else {
      game.restartGame();
    }

    updateScreen();
  }


  const handleBoardClick = (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (!row || !col) return;
    if (Gameboard.getBoard()[row][col] !== "") return;
    if (game.getGameFinished()) return;

    game.playRound(row, col);
    updateScreen();

    const check = game.checkWinner();
    if (check === "tie") {
      statusPara.textContent = "Tie!";
      return;
    }
    if (check !== "") {
      statusPara.textContent = `Winner = ${check.winner.marker} (${check.winner.name})`;
      return;
    }

  };

  boardDiv.addEventListener("click", handleBoardClick);
  restartBtn.addEventListener("click", handleRestartClick);


  updateScreen();
})();
