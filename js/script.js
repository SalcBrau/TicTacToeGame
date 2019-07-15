var $cells = $("canvas"),
  $this,
  $playarea = $("#playarea"),
  $selection = $("#selection"),
  $welcome = $("#welcome"),
  $game = $("#game"),
  $score = $("#score"),
  $cell,
  $p2 = $("#p2"),
  $p1 = $("#p1"),
  $p2Sc = $("#second"),
  $p1Sc = $("#first"),
  $cell = $("#1"),
  $sections = $(".sect"),
  $message = $("#message"),
  $section,
  cell,
  turn,
  player1,
  player2,
  correspondingCells = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ],
  combinations,
  touchedArr,
  won,
  multi,
  touched = 0,
  firstX,
  score,
  j,
  comp,
  compMoves,
  availableSlots;

$cells.click(makeMove);

function makeMove() {
  $this = $(this);
  if (!touchedArr[this.id - 1] && !won && (multi || (!multi && !turn))) {
    cell = this.getContext("2d");
    triggerCell($this, cell, this.id, 0);
  }
}

function drawX(cell) {
  cell.moveTo(50, 25);
  cell.lineTo(250, 125);
  cell.stroke();
  cell.moveTo(50, 125);
  cell.lineTo(250, 25);
  cell.stroke();
}

function drawO(cell) {
  cell.beginPath();
  cell.ellipse(150, 75, 100, 57, 0, 0, 2 * Math.PI);
  cell.stroke();
}

function updateArrays(player, num) {
  switch (num) {
    case "1":
      combinations = [0, 3, 6];
      break;
    case "2":
      combinations = [0, 4];
      break;
    case "3":
      combinations = [0, 5, 7];
      break;
    case "4":
      combinations = [1, 3];
      break;
    case "5":
      combinations = [1, 4, 6, 7];
      break;
    case "6":
      combinations = [1, 5];
      break;
    case "7":
      combinations = [2, 3, 7];
      break;
    case "8":
      combinations = [2, 4];
      break;
    default:
      combinations = [2, 5, 6];
      break;
  }
  if (player) {
    combinations.forEach(function(curr) {
      player2[curr]++;
      won = player2.indexOf(3) + 1;
    });
  } else {
    combinations.forEach(function(curr) {
      player1[curr]++;
      won = player1.indexOf(3) + 1;
    });
  }

  if (won) {
    correspondingCells[won - 1].forEach(function(curr) {
      cell = $("#" + curr).get(0).getContext("2d");
      cell.strokeStyle = "green";
      if (player) {
        if (firstX) drawO(cell);
        else drawX(cell);
      } else {
        if (firstX) drawX(cell);
        else drawO(cell);
      }
    });
    score[player]++;
    if (player) {
      $p2Sc.text(score[player]);
      if (multi) alertResults("Player two won. Congratulations! :)", false);
      else alertResults("Sorry! You lost! :(", false);
    } else {
      $p1Sc.text(score[player]);
      if (multi) alertResults("Player one won. Congratulations! :)", false);
      else alertResults("Congratulations! You won! :)", false);
    }
  }
}

$(document).ready(function() {
  $cells.each(function() {
    cell = this.getContext("2d");
    cell.lineWidth = 15;
    cell.strokeStyle = "#632da1";
  });
});

$("#one, #two").click(function() {
  makeInvisible($welcome);
  if (this.id === "one") {
    multi = false;
    $message.text("Would you like to be O or X?");
  } else {
    multi = true;
    $message.text("Player 1: Would you like to be O or X?");
  }
  makeVisible($selection);
});

$("#back").click(function() {
  makeInvisible($selection);
  makeVisible($welcome);
});

$("#zero, #x").click(function() {
  makeInvisible($selection);
  makeVisible($playarea);
  makeVisible($score);
  if (this.id === "x") {
    firstX = true;
  } else {
    firstX = false;
  }
  window.setTimeout(function() {
    $game.animate({ backgroundColor: "#000000" }, 1500);
    newGame(true);
  }, 1500);
});

function makeVisible(obj) {
  obj.css({ visibility: "visible" });
  window.setTimeout(function() {
    obj.fadeTo(1500, 1);
  }, 1500);
}

function makeInvisible(obj) {
  obj.fadeTo(1500, 0);
  window.setTimeout(function() {
    obj.css({ visibility: "hidden" });
  }, 1500);
}

$("#reset").click(function() {
  makeInvisible($playarea);
  makeInvisible($score);
  makeVisible($welcome);
  $game.animate({ backgroundColor: "#cec8d4" }, 1500);
  window.setTimeout(function() {
    clearBoard();
  }, 750);
  window.setTimeout(function() {
    $p1Sc.text("0");
    $p2Sc.text("0");
  }, 1500);
});

function newGame(first) {
  player1 = [0, 0, 0, 0, 0, 0, 0, 0];
  player2 = [0, 0, 0, 0, 0, 0, 0, 0];
  touchedArr = [false, false, false, false, false, false, false, false, false];
  turn = getRandomNumber(1, 0);
  touched = 0;
  if (turn) {
    $p2.css({ color: "#b473ff" });
    $p1.css({ color: "#644d7d" });
  } else {
    $p1.css({ color: "#b473ff" });
    $p2.css({ color: "#644d7d" });
  }
  if (first) {
    score = [0, 0];
    $cells.each(function() {
      cell = this.getContext("2d");
      cell.lineWidth = 15;
      cell.strokeStyle = "#632da1";
    });
  } else {
    clearBoard();
  }
  won = false;
  if (!multi && turn) {
    computerMove();
  }
}

function alertResults(message, first) {
  $.confirm({
    title: message,
    content: "Click button to start next game.",
    theme: "my-theme",
    buttons: {
      nextMatch: {
        text: "Next Match",
        action: function() {
          window.setTimeout(function() {
            newGame(first);
          }, 500);
        }
      }
    }
  });
}

function clearBoard() {
  $cells.unbind("click");
  j = 1;
  $sections.each(function() {
    $section = $(this);
    $section.html("");
    $section.html(
      "<canvas id='" +
        j++ +
        "'></canvas><canvas id='" +
        j++ +
        "'></canvas><canvas id='" +
        j++ +
        "'></canvas>"
    );
  });
  $cells = $("canvas");
  $cells.each(function() {
    $this = $(this);
    if (this.id === "2" || this.id === "5" || this.id === "8") {
      $this.css({ "margin-left": "3.7px" });
      $this.css({ "margin-right": "3.7px" });
    } else if (this.id === "1" || this.id === "4" || this.id === "7") {
      $this.css({ "margin-left": "-1.5px" });
    } else {
      $this.css({ "margin-right": "-1.5px" });
    }
  });
  $cells.click(makeMove);
  $cells.each(function() {
    cell = this.getContext("2d");
    cell.lineWidth = 15;
    cell.strokeStyle = "#632da1";
    if ($(this).hasClass("touched")) $(this).toggleClass("touched");
  });
}

function computerMove() {
  comp = null;
  if (player2.indexOf(2) !== -1) {
    compMoves = getCorrespondingIndexes(player2.indexOf(2));
    compMoves.forEach(function(ndx) {
      if (touchedArr[ndx] === false) {
        comp = ndx;
      }
    });
    if (comp === null) {
      player2[player2.indexOf(2)] = 0;
      computerMove();
      comp = null;
    }
  } else if (player1.indexOf(2) !== -1) {
    compMoves = getCorrespondingIndexes(player1.indexOf(2));
    compMoves.forEach(function(ndx) {
      if (touchedArr[ndx] === false) {
        comp = ndx;
        player1[player1.indexOf(2)] = 0;
      }
    });
    if (comp === null) {
      player1[player1.indexOf(2)] = 0;
      computerMove();
      comp = null;
    }
  } else if (!touchedArr[4]) {
    comp = 4;
  } else {
    compMoves = [];

    touchedArr.forEach(function(val, ndx) {
      if (val === false) compMoves.push(ndx);
    });
    comp = compMoves[getRandomNumber(compMoves.length - 1, 0)];
  }

  if (comp !== null) {
    $cell = $("#" + (comp + 1));
    cell = $cell.get(0).getContext("2d");
    if (!won) {
      triggerCell($cell, cell, "" + (comp + 1), 1500);
    }
  }
}

function triggerCell(canvas, cell, id, timer) {
  window.setTimeout(function() {
    updateArrays(Number.parseInt(turn), id);
    if (turn) {
      if (firstX) drawO(cell);
      else drawX(cell);
      turn = 0;
      $p1.css({ color: "#b473ff" });
      $p2.css({ color: "#644d7d" });
    } else {
      if (firstX) drawX(cell);
      else drawO(cell);
      turn = 1;
      $p2.css({ color: "#b473ff" });
      $p1.css({ color: "#644d7d" });
    }
    if (!canvas.hasClass("touched")) {
      canvas.toggleClass("touched");
      touchedArr[Number.parseInt(id) - 1] = true;
    }
    touched++;
    if (!won) {
      if (touched === 9) {
        alertResults("The game was a draw!", false);
      } else if (!multi && turn) {
        computerMove();
      }
    }
  }, timer);
}

function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCorrespondingIndexes(num) {
  switch (num) {
    case 0:
      availableSlots = [0, 1, 2];
      break;
    case 1:
      availableSlots = [3, 4, 5];
      break;
    case 2:
      availableSlots = [6, 7, 8];
      break;
    case 3:
      availableSlots = [0, 3, 6];
      break;
    case 4:
      availableSlots = [1, 4, 7];
      break;
    case 5:
      availableSlots = [2, 5, 8];
      break;
    case 6:
      availableSlots = [0, 4, 8];
      break;
    default:
      availableSlots = [2, 4, 6];
      break;
  }
  return availableSlots;
}

