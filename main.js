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
  let moveNumber = 0;

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
        return `Winner is ${activePlayer.marker} row=${i}`;
      }

      // three in a column
      arr = [board[0][i], board[1][i], board[2][i]];
      if (arr[0] === arr[1] && arr[1] == arr[2]) {
        if (arr[0] === "") continue;
        if (activePlayer.marker !== arr[0]) { switchPlayerTurn() }
        return `Winner is ${activePlayer.marker} col=${i}`;
      }
    }

    // three in diagonal
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === "") return "";
      if (activePlayer.marker !== board[0][0]) { switchPlayerTurn() }
      return `Winner is ${activePlayer.marker} ${[[0, 0], [1, 1], [2, 2]]}`;
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === "") return "";
      if (activePlayer.marker !== board[0][2]) { switchPlayerTurn() }
      return `Winner is ${activePlayer.marker} ${[[0, 2], [1, 1], [2, 0]]}`;
    }

    if (moveNumber === 9) return "tie";

    return "";
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    moveNumber++;
    Gameboard.placeMarker(row, column, activePlayer.marker);

    console.log(checkWinner());

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
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (!row || !col) return;
    if (Gameboard.getBoard()[row][col] !== "") return;

    game.playRound(row, col);
    updateScreen();
  };

  boardDiv.addEventListener("click", handleClick);

  updateScreen();
})();