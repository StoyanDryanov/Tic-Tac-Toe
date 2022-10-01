"use strict";

const Player = (mark) => {
  this.mark = mark;

  const getMark = () => {
    return mark;
  };

  return { getMark };
};

let Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const setTile = (index, mark) => {
    board[index] = mark;
  };

  const getTile = (index) => {
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setTile, getTile, reset };
})();

let gameDisplay = (() => {
  let tiles = document.querySelectorAll(".tile");
  let message = document.querySelector(".message");
  let restartButton = document.querySelector(".restart");

  tiles.forEach((tile) =>
    tile.addEventListener("click", (e) => {
      if (Game.isOver() || e.target.textContent !== "") return;
      Game.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  const updateGameboard = () => {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].textContent = Gameboard.getTile(i);
    }
  };

  restartButton.addEventListener("click", () => {
    Gameboard.reset();
    Game.restart();
    updateGameboard();
    setMessage('Player X\'s turn');
  });

  const setWinnerMessage = (winner) => {
    message.textContent = winner;
  };

  const setMessage = (messages) => {
    message.textContent = messages;
  };

  return { setWinnerMessage, setMessage };
})();

let Game = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let gameOver = false;

  const playRound = (indexTile) => {
    if (gameOver) return;

    Gameboard.setTile(indexTile, getCurrPlayerMark());
    if (checkWinner(indexTile)) {
      gameDisplay.setWinnerMessage(`Player ${getCurrPlayerMark()} has won!`);
      gameOver = true;
      return;
    }

    if (round === 9) {
      gameOver = true;
      gameDisplay.setWinnerMessage("It's a tie!");
    }
    round++;
    if (gameOver) return;
    gameDisplay.setMessage(`Player ${getCurrPlayerMark()}'s turn`);
  };

  const getCurrPlayerMark = () => {
    return round % 2 === 0 ? playerO.getMark() : playerX.getMark();
  };

  const checkWinner = (indexTile) => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCombinations
      .filter((comb) => comb.includes(indexTile))
      .some((comb) =>
        comb.every((i) => Gameboard.getTile(i) === getCurrPlayerMark())
      );
  };

  const isOver = () => {
    return gameOver;
  };

  const restart = () => {
    gameOver = false;
    round = 1;
  };

  return { playRound, isOver, restart };
})();
