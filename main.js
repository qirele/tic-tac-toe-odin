// gameboard object as a module pattern
const Gameboard = (() => {
  const board = [
    ["x", "o", ""],
    ["o", "x", "x"],
    ["x", "o", "o"],
  ];

  const placeMarker = (x, y, marker) => {
    board[x][y] = marker;
  };

  return {
    board,
    placeMarker,
  };
})();

// player object as a factory
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  const placeMarker = (x, y) => Gameboard.placeMarker(x, y, marker);
  return { getName, getMarker, placeMarker };
};


// module pattern
const displayController = (() => {
  const boardDiv = document.querySelector(".board");
  const showBoard = () => {
    for (let i = 0; i < Gameboard.board.length; i++) {
      for (let j = 0; j < Gameboard.board[i].length; j++) {
        let p = document.createElement("p");
        p.className = "cell";
        p.textContent = Gameboard.board[i][j];
        boardDiv.appendChild(p);
      }
    }
  };
  return { showBoard };
})();

displayController.showBoard();