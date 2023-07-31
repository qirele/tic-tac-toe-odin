const Gameboard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const placeMarker = (row, col, marker) => {
    board[row][col] = marker;
  };

  const getBoard = () => board;

  return {
    placeMarker,
    getBoard,
  };
})();

// factory
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  const placeMarker = (row, col) => Gameboard.placeMarker(row, col, marker);
  return { getName, getMarker, placeMarker };
};

const Gameflow = (player1, player2) => {
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

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    Gameboard.placeMarker(row, column, activePlayer.marker);
    switchPlayerTurn();
  };

  return {
    getActivePlayer,
    playRound,
  };
};

const DisplayController = (() => {
  const boardDiv = document.querySelector(".board");
  const game = Gameflow(Player("bruh", "x"), Player("dawg", "o"));

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
  };

  const handleClick = (e) => {
    game.playRound(e.target.dataset.row, e.target.dataset.col);
    updateScreen();
  };
  boardDiv.addEventListener("click", handleClick);

  updateScreen();
})();
