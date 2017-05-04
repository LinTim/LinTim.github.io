
////////////////////////////////////////////////////////////
////////// number chooser
////////////////////////////////////////////////////////////
function choose_number(id) {
// Choose number by click
  if (id.number == null) {
    id.number = 1;
    id.innerHTML = id.number;
  }
  else if (id.number < 9) {
    id.number += 1;
    id.innerHTML = id.number;
  }
  else {
    id.innerHTML = null;
    id.number = null;
  }
}

////////////////////////////////////////////////////////////
////////// Sudoku Solver's class
////////////////////////////////////////////////////////////
function sudoku_solver() {
  this.where_it_from_stats = false;
  this.idle_times_limit = 3;

  this.arr = [];
}

sudoku_solver.prototype.add_array = function() {
// Add the problem's numbers to array
  for (var row = 1; row <= 9; row++) {
    var arr_temp = [];
    for (var column = 1; column <= 9; column++) {
      arr_temp.push(document.getElementById(row+""+column).number);
    }
    this.arr.push(arr_temp);
  }
}

sudoku_solver.prototype.full_space = function() {
// Add boolean "true" for 1~9 to every space grid.
  for (var row = 0; row < 9; row++) {
    for (var column = 0; column < 9; column++) {
      if (this.arr[row][column] == null) {this.arr[row][column] = [true, true, true, true, true, true, true, true, true];}
    }
  }
}

sudoku_solver.prototype.solve_it = function() {
// Replace "true" by "false" if the number repeats on row, column, and the block.
  var idle_times = 0;
  var arr_temp = [];
  while (true) {
    for (var i = 0; i < 9; i++) {arr_temp[i] = this.arr[i].slice();}
    // Solve row
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        if (typeof(this.arr[row][column]) == "object") {
          for (var k = 0; k < 9; k++) {
            if (typeof(this.arr[row][k]) != "object") {this.arr[row][column][this.arr[row][k]-1] = false;}
          }
          // only one true in grid
          if (this.arr[row][column].slice().sort()[7] != true) {this.arr[row][column] = this.arr[row][column].indexOf(true) + 1; this.where_it_from("row1", row, column); return;}
          // the only one true in row
          for (var k = 0; k < 9; k++) {
            if (this.arr[row][column][k] != true) {continue;}
            var eight_false = 0;
            for (var i = 0; i < 9; i++) {
              if (typeof(this.arr[row][i]) == "object") {
              if (i == column) {continue;}
                if (this.arr[row][i][k] == true) {break;}
                eight_false++;
              }
              else {eight_false++;}
            }
            if (eight_false == 8) {this.arr[row][column] = k + 1; this.where_it_from("row2", row, column); return;}
          }
        }
      }
    }
    // Solve column
    for (var column = 0; column < 9; column++) {
      for (var row = 0; row < 9; row++) {
        if (typeof(this.arr[row][column]) == "object") {
          for (var k = 0; k < 9; k++) {
            if (typeof(this.arr[k][column]) != "object") {this.arr[row][column][this.arr[k][column]-1] = false;}
          }
          // only one true in grid
          if (this.arr[row][column].slice().sort()[7] != true) {this.arr[row][column] = this.arr[row][column].indexOf(true) + 1; this.where_it_from("column1", row, column); return;}
          // the only one true in column
          for (var k = 0; k < 9; k++) {
            if (this.arr[row][column][k] != true) {continue;}
            var eight_false = 0;
            for (var i = 0; i < 9; i++) {
              if (typeof(this.arr[i][column]) == "object") {
              if (i == row) {continue;}
                if (this.arr[i][column][k] == true) {break;}
                eight_false++;
              }
              else {eight_false++;}
            }
            if (eight_false == 8) {this.arr[row][column] = k + 1; this.where_it_from("column2", row, column); return;}
          }
        }
      }
    }
    // Solve block
    for (var block_row = 0; block_row < 3; block_row++) {
      for (var block_column = 0; block_column < 3; block_column++) {
        // in block
        for (var row = 0; row < 3; row++) {
          for (var column = 0; column < 3; column++) {
            if (typeof(this.arr[row+block_row*3][column+block_column*3]) == "object") {
              for (var i = 0; i < 3; i++) {
                if (i == row) {continue;}
                for (var k = 0; k < 3; k++) {
                  if (k == column) {continue;}
                  if (typeof(this.arr[i+block_row*3][k+block_column*3]) != "object") {this.arr[row+block_row*3][column+block_column*3][this.arr[i+block_row*3][k+block_column*3]-1] = false;}
                }
              }
              // only one true in grid
              if (this.arr[row+block_row*3][column+block_column*3].slice().sort()[7] != true) {this.arr[row+block_row*3][column+block_column*3] = this.arr[row+block_row*3][column+block_column*3].indexOf(true) + 1; this.where_it_from("block1", row+block_row*3, column+block_column*3); return;}
              // the only one true in block
              for (var j = 0; j < 9; j++) {
                if (this.arr[row+block_row*3][column+block_column*3][j] != true) {continue;}
                var eight_false = 0;
                for (var i = 0; i < 3; i++) {
                  var continue_it = false;
                  var break_it = false;
                  for (var k = 0; k < 3; k++) {
                    if (typeof(this.arr[i+block_row*3][k+block_column*3]) == "object") {
                    if (i == row && k == column) {continue_it = true; continue;}
                      if (this.arr[i+block_row*3][k+block_column*3][j] == true) {break_it = true; break;}
                      eight_false++;
                    }
                    else {eight_false++;}
                  }
                  if (break_it == true) {break;}
                  if (continue_it == true) {continue;}
                  if (eight_false == 8) {this.arr[row+block_row*3][column+block_column*3] = j + 1; this.where_it_from("block2", row+block_row*3, column+block_column*3); return;}
                }
              }
            }
          }
        }
      }
    }

    if (arr_temp.toString() == this.arr.toString()) {idle_times++;}
    if (idle_times > this.idle_times_limit) {return true;}
  }
}

sudoku_solver.prototype.write_answer = function() {
  // write the answer back
  for (var row = 1; row <= 9; row++) {
    for (var column = 1; column <= 9; column++) {
      if (typeof(this.arr[row-1][column-1]) != "object") {
        document.getElementById(row+""+column).innerHTML = document.getElementById(row+""+column).number = this.arr[row-1][column-1];
      }
    }
  }
}

sudoku_solver.prototype.where_it_from = function(fromwhere, row, column) {
  // show the grip number is from what method and where the grip now
  if (this.where_it_from_stats == true) {console.log("method:"+fromwhere+", row:"+(row+1)+", column:"+(column+1));}
}

sudoku_solver.prototype.check_answer = function() {
  // check the answer is right
  this.add_array();
  // check row
  for (var row = 0; row < 9; row++) {
    var product = 1;
    for (var column = 0; column < 9; column++) {
      product *= this.arr[row][column]
    }
    if (product != 362880) {alert("Something WRONG!"); return;}
  }
  // check column
  for (var column = 0; column < 9; column++) {
    var product = 1;
    for (var row = 0; row < 9; row++) {
      product *= this.arr[row][column]
    }
    if (product != 362880) {alert("Something WRONG!"); return;}
  }
  // check block
  for (var block_row = 0; block_row < 3; block_row++) {
    for (var block_column = 0; block_column < 3; block_column++) {
      var product = 1;
      for (var row = 0; row < 3; row++) {
        for (var column = 0; column < 3; column++) {
          product *= this.arr[row+block_row*3][column+block_column*3]
        }
      }
      if (product != 362880) {alert("Something WRONG!"); return;}
    }
  }
  // Great!
  alert("It's right!");
  return;
}

////////////////////////////////////////////////////////////
////////// main function
////////////////////////////////////////////////////////////
function run_solver(using_step) {
  // the using_step = true/false
  // if using_step is true, then it will solve step by step
  var solving = new sudoku_solver;
  solving.where_it_from_stats = true;
  solving.add_array();
  solving.full_space();
  do {var if_end = solving.solve_it();} while (using_step == false && if_end == null)
  solving.write_answer();
}

function check_answer () {
  // just check
  var checking = new sudoku_solver;
  checking.check_answer();
}

////////////////////////////////////////////////////////////
////////// input & output array
////////////////////////////////////////////////////////////
function input_array (id) {
  for (var i = 0; i < document.getElementById(id).value.split('').length; i++) {
    for (var j = 1; j <= 9; j++) {
      if (document.getElementById(id).value.split('')[i] == j) {
        document.getElementById(Math.ceil((i+1)/9)+''+(i%9+1)).innerHTML = document.getElementById(Math.ceil((i+1)/9)+''+(i%9+1)).number = parseInt(document.getElementById(id).value.split('')[i]);
        break;
      }
    }
    if (document.getElementById(id).value.split('')[i] < 1 || document.getElementById(id).value.split('')[i] > 9 || parseInt(document.getElementById(id).value.split('')[i]).toString() == "NaN") {
      document.getElementById(Math.ceil((i+1)/9)+''+(i%9+1)).innerHTML = document.getElementById(Math.ceil((i+1)/9)+''+(i%9+1)).number = null;
    }
  }
}

function output_array (id) {
  var arr_temp = ''
  for (var row = 1; row <=9 ; row++) {
    for (var column = 1; column <=9 ; column++) {
      if (document.getElementById(row+''+column).number != null) {
        arr_temp += document.getElementById(row+''+column).number
      }
      else {arr_temp += 0}
    }
  }
  document.getElementById(id).value = arr_temp
}