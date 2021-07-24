
var $ = id => document.getElementById(id);

var onload_function = function () {
  // hard
  $("input_array").value = "009130000000704100100508070340000000000250003726009001000000050680000400050003017"

  // // expert
  // $("input_array").value = "000406000700200090000053004013000049000000000004500002370060010500000000020000700";

  // // only trail and error
  // $("input_array").value = "8..........36.....67549.28..5...7.......457.....1...3...1....68..85...1..9....4.."
};

////////////////////////////////////////////////////////////
////////// number setter
////////////////////////////////////////////////////////////
function set_number(element, num) {
  element.innerHTML = element.number = num;
}

////////////////////////////////////////////////////////////
////////// Sudoku Solver's class
////////////////////////////////////////////////////////////
function sudoku_solver() {
  this.where_it_from_stats = false;
  this.idle_times_limit = 1;

  this._arr = [];
};

sudoku_solver.prototype.init = function () {
  this.is_idle = false;
  this.isChanged = true;

  this._arr.length = 0;
  this._last_result_pos = [];
  if (this._last_result) { this._last_result.style.backgroundColor = ""; }
};

sudoku_solver.prototype._sum = function (a, b) {
  return a + b;
};

sudoku_solver.prototype.add_array = function () {
  // Add the problem's numbers to array
  for (var row = 1; row <= 9; row++) {
    var arr_temp = [];
    for (var column = 1; column <= 9; column++) {
      arr_temp.push($(row + "" + column).number);
    }
    this._arr.push(arr_temp);
  }
};

sudoku_solver.prototype.full_space = function () {
  // Add boolean "true" for 1~9 to every space grid.
  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      if (!this._arr[row][column]) { this._arr[row][column] = [true, true, true, true, true, true, true, true, true]; }
    }
  }
};

sudoku_solver.prototype.solve_it = function () {
  // if solved then return
  if (this.check_answer(true)) { return true; }
  // Replace "true" by "false" if the number repeats on row, column, and the block.
  var idle_times = 0;
  var old_arr;
  while (true) {
    // ===== Level 1 =====
    // save the old arr to compare if changed
    var old_arr = this._arr.toString();
    // Solve row
    for (var row = 0; row < 9; row++) {
      var theRow = this._arr[row];
      for (var column = 0; column < 9; column++) {
        var theGrid = theRow[column];
        if (typeof (theGrid) === "number") { continue; }
        // update the grid
        for (var k = 0; k < 9; k++) {
          if (typeof (theRow[k]) === "number") { theGrid[theRow[k] - 1] = false; }
        }
        // only one true in grid
        if (theGrid.reduce(this._sum) === 1) { theRow[column] = theGrid.indexOf(true) + 1; this.where_it_from("row grid", row, column); return; }
        // the only one true in row
        for (var k = 0; k < 9; k++) {
          if (!theGrid[k]) { continue; }
          var is_two_more_true = false;
          for (var i = 0; i < 9; i++) {
            if (column === i) { continue; }
            if (typeof (theRow[i]) === "object" && theRow[i][k]) { is_two_more_true = true; break; }
          }
          if (!is_two_more_true) { theRow[column] = k + 1; this.where_it_from("row", row, column); return; }
        }
      }
    }
    // Solve column
    for (var column = 0; column < 9; column++) {
      for (var row = 0; row < 9; row++) {
        var theRow = this._arr[row];
        var theGrid = theRow[column];
        if (typeof (theGrid) === "number") { continue; }
        // update the grid
        for (var k = 0; k < 9; k++) {
          if (typeof (this._arr[k][column]) === "number") { theGrid[this._arr[k][column] - 1] = false; }
        }
        // only one true in grid
        if (theGrid.reduce(this._sum) === 1) { theRow[column] = theGrid.indexOf(true) + 1; this.where_it_from("column grid", row, column); return; }
        // the only one true in column
        for (var k = 0; k < 9; k++) {
          if (!theGrid[k]) { continue; }
          var is_two_more_true = false;
          for (var i = 0; i < 9; i++) {
            if (row === i) { continue; }
            if (typeof (this._arr[i][column]) === "object" && this._arr[i][column][k]) { is_two_more_true = true; break; }
          }
          if (!is_two_more_true) { theRow[column] = k + 1; this.where_it_from("column", row, column); return; }
        }
      }
    }
    // Solve block
    for (var block_row = 0; block_row < 9; block_row += 3) {
      for (var block_column = 0; block_column < 9; block_column += 3) {
        // to an array
        var temp = [];
        for (var row = 0; row < 3; row++) {
          var theRow = this._arr[row + block_row];
          for (var column = 0; column < 3; column++) {
            temp.push(theRow[column + block_column]);
          }
        }
        // in block
        for (var i = 0; i < 9; i++) {
          var theGrid = temp[i];
          if (typeof (theGrid) === "number") { continue; }
          // update the grid
          for (var index = 0; index < 9; index++) {
            if (typeof (temp[index]) === "number") { theGrid[temp[index] - 1] = false; }
          }
          // only one true in grid
          if (theGrid.reduce(this._sum) === 1) { this._arr[Math.floor(i / 3) + block_row][i % 3 + block_column] = theGrid.indexOf(true) + 1; this.where_it_from("block grid", Math.floor(i / 3) + block_row, i % 3 + block_column); return; }
          // the only one true in block
          for (var k = 0; k < 9; k++) {
            if (!theGrid[k]) { continue; }
            var is_two_more_true = false;
            for (var index = 0; index < 9; index++) {
              if (i === index) { continue; }
              if (typeof (temp[index]) === "object" && temp[index][k]) { is_two_more_true = true; break; }
            }
            if (!is_two_more_true) { this._arr[Math.floor(i / 3) + block_row][i % 3 + block_column] = k + 1; this.where_it_from("block", Math.floor(i / 3) + block_row, i % 3 + block_column); return; }
          }
        }
      }
    }

    // ===== Level 2 =====
    // Solve row
    for (var row = 0; row < 9; row++) {
      var theRow = this._arr[row];
      var temp = [];
      var countList = [];
      for (var column = 0; column < 9; column++) {
        var theGrid = theRow[column];
        if (typeof (theGrid) === "object") {
          countList[column] = [];
          theGrid.forEach((c, i) => {
            if (c) { countList[column][i] = true; }
          });
        }
      }
      countList.forEach((col, i) => {
        if (!col) { return; }
        for (var j = i + 1; j < 9; j++) {
          if (!countList[j]) { continue; }
          for (var k = 0; k < 9; k++) {
            (col[k] === countList[j][k])
          }
        }
      });
    }

    // todo: check if this is necessary
    if (old_arr === this._arr.toString()) { idle_times++; console.log("idletimes", idle_times); }
    if (idle_times >= this.idle_times_limit) { this.is_idle = true; return true; }
  }
};

sudoku_solver.prototype.do_guess = function () {
  // trail and error
  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      this._arr[row][column];
    }
  }
  this._arr.forEach((row, i) => {
    row.forEach((col, j) => {
      typeof col === "object" && col.reduce(this._sum) === 2 && console.log("loc", i, j);
    });
  });
};

sudoku_solver.prototype.write_answer = function () {
  // write the answer back
  for (var row = 1; row <= 9; row++) {
    for (var column = 1; column <= 9; column++) {
      var content = this._arr[row - 1][column - 1];
      if (typeof (content) === "number") {
        var element = $(row + "" + column);
        if (element.number !== content) {
          // remember the last result to set color
          if (this._last_result_pos[0] === row && this._last_result_pos[1] === column) {
            if (this._last_result) { this._last_result.style.backgroundColor = ""; }
            this._last_result = element;

            element.style.backgroundColor = "#FFFF00";
          }

          set_number(element, content);
        }
      }
    }
  }
};

sudoku_solver.prototype.where_it_from = function (fromwhere, row, column) {
  // show the grip number is from what method and where the grip now
  if (this.where_it_from_stats === true) { console.log("method:" + fromwhere + ", row:" + (row + 1) + ", column:" + (column + 1)); }
  this._last_result_pos = [row + 1, column + 1];
};

sudoku_solver.prototype.check_answer = function (isSolving) {
  // check the answer is right
  isSolving || this.add_array();
  // check row
  for (var row = 0; row < 9; row++) {
    var product = 1;
    for (var column = 0; column < 9; column++) {
      if (typeof this._arr[row][column] === "object") { return 0; }
      product *= this._arr[row][column];
    }
    if (product !== 362880) { return; }
  }
  // check column
  for (var column = 0; column < 9; column++) {
    var product = 1;
    for (var row = 0; row < 9; row++) {
      product *= this._arr[row][column];
    }
    if (product !== 362880) { return; }
  }
  // check block
  for (var block_row = 0; block_row < 9; block_row += 3) {
    for (var block_column = 0; block_column < 9; block_column += 3) {
      var product = 1;
      for (var row = 0; row < 3; row++) {
        for (var column = 0; column < 3; column++) {
          product *= this._arr[row + block_row][column + block_column];
        }
      }
      if (product !== 362880) { return; }
    }
  }
  // Great!
  return true;
};

////////////////////////////////////////////////////////////
////////// main function
////////////////////////////////////////////////////////////
var solving = new sudoku_solver;
solving.init();
solving.where_it_from_stats = true;

function run_solver(using_step) {
  // the using_step = true/false
  // if using_step is true, then it will solve step by step
  if (solving.isChanged) {
    solving.add_array();
    solving.full_space();
    solving.isChanged = false;
  }
  do { var is_end = solving.solve_it(); } while (!using_step && !is_end)
  solving.write_answer();
  solving.is_idle && solving.do_guess(using_step);
  using_step || (solving.check_answer(true) ? alert("It's right!") : alert("Something's WRONG!"));
};

function check_answer() {
  // just check
  solving.check_answer() ? alert("It's right!") : alert("Something's WRONG!");
};

////////////////////////////////////////////////////////////
////////// number chooser
////////////////////////////////////////////////////////////
function choose_number(element) {
  // Choose number by click
  if (!element.number) {
    set_number(element, 1);
  }
  else if (element.number < 9) {
    set_number(element, element.number + 1);
  }
  else {
    set_number(element, null);
  }
  solving.init();
};

////////////////////////////////////////////////////////////
////////// input & output array
////////////////////////////////////////////////////////////
function input_array(id) {
  var numArray = $(id).value.split("");
  for (var i = 0, len = numArray.length; i < len; i++) {
    var theGrid = $(Math.ceil((i + 1) / 9) + "" + (i % 9 + 1));
    for (var j = 1; j <= 9; j++) {
      if (numArray[i] === String(j)) {
        set_number(theGrid, parseInt(numArray[i]));
        break;
      }
    }
    if (numArray[i] < 1 || numArray[i] > 9 || parseInt(numArray[i]).toString() === "NaN") {
      set_number(theGrid, null);
    }
  }
  solving.init();
};

function output_array(id) {
  var arr_temp = "";
  for (var row = 1; row <= 9; row++) {
    for (var column = 1; column <= 9; column++) {
      var theNum = $(row + "" + column).number;
      arr_temp += theNum ? theNum : 0;
    }
  }
  $(id).value = arr_temp;
};