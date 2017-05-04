

// 設置畫布的變數
var my_paint_area = document.getElementById('my_paint_area');
var ctx_my = my_paint_area.getContext('2d');
var else_paint_area = document.getElementById('else_paint_area');
var ctx_else = else_paint_area.getContext('2d');  
var mix_area = document.getElementById('mix_area');
var ctx_mix = mix_area.getContext('2d');

// 設置筆刷顏色與大小的變數
var vred_doc = document.getElementById('vred');
var red_doc = document.getElementById('red');
var vgreen_doc = document.getElementById('vgreen');
var green_doc = document.getElementById('green');
var vblue_doc = document.getElementById('vblue');
var blue_doc = document.getElementById('blue');
var line_width_doc = document.getElementById('line_width');

// 設置一個計數器，避免單一"筆"資料過大導致延遲
var count_paint_times = 0;
var max_times = 200


// Paint class
function ready_to_paint () {
  // 初始化筆刷的顏色與大小
  vred_doc.value = red_doc.value = 0;
  vgreen_doc.value = green_doc.value = 0;
  vblue_doc.value = blue_doc.value = 0;
  line_width_doc.value = 1;

  this.r = null;
  this.g = null;
  this.b = null;

  this.x = 0;
  this.y = 0;
}

// Change color
ready_to_paint.prototype.color_bar = function() {
  this.r = vred_doc.value = red_doc.value;
  this.g = vgreen_doc.value = green_doc.value;
  this.b = vblue_doc.value = blue_doc.value;
  this.change_color(this.r,this.g,this.b);
};

ready_to_paint.prototype.color_number = function() {
  this.r = red_doc.value = vred_doc.value;
  this.g = green_doc.value = vgreen_doc.value;
  this.b = blue_doc.value = vblue_doc.value;
  this.change_color(this.r,this.g,this.b);
};

ready_to_paint.prototype.change_color = function(r,g,b) {
  ctx_my.strokeStyle = "rgb("+r+","+g+","+b+")" ; 
};

// Paint
ready_to_paint.prototype.mouse_move = function(event) {
  var a = my_paint_area.getBoundingClientRect()
  this.x = event.clientX*1280/a.width;
  this.y = event.clientY*720/a.height;

  ctx_my.lineTo(this.x, this.y);

  ctx_my.stroke();

  if (connectedPeer == null) {}
  else {chat_now.send_paint_data([true, 1, this.x, this.y, ctx_my.strokeStyle, ctx_my.lineWidth]);}

  ready_to_paint.prototype.reset_paintting_beginning_and_mix(my_paint_area, ctx_my);
};

ready_to_paint.prototype.mouse_down = function(event) {
  var a = my_paint_area.getBoundingClientRect()

  if (document.getElementById('canvas_figure') != null || document.getElementById('canvas_text') != null) {
    remove_target = document.getElementById('canvas_text') || document.getElementById('canvas_figure');
    ctx_my.drawImage(remove_target,this.x,this.y);
    document.body.removeChild(remove_target);
  }

  this.x = event.clientX*1280/a.width;
  this.y = event.clientY*720/a.height;

  ctx_my.beginPath();

  ctx_my.moveTo(this.x, this.y);

  if (connectedPeer == null) {}
  else {chat_now.send_paint_data([true, 0, this.x, this.y, ctx_my.strokeStyle, ctx_my.lineWidth]);}

  my_paint_area.addEventListener('mousemove', this.mouse_move, false);
};

ready_to_paint.prototype.mouse_up = function() {

  my_paint_area.removeEventListener('mousemove', this.mouse_move, false);

  this.mix_paint_area(my_paint_area, ctx_my)

  if (connectedPeer == null) {}
  else {chat_now.send_paint_data([true, 2]);}  
};

// 計數器(功能:重置下筆的初始點)
ready_to_paint.prototype.reset_paintting_beginning_and_mix = function(paint_area, ctx) {
  count_paint_times++;
  if (count_paint_times > max_times) {
    count_paint_times = 0;

    ctx.beginPath();

    ctx.moveTo(this.x, this.y);

    this.mix_paint_area(paint_area, ctx);
  }
}

// 整合畫布
ready_to_paint.prototype.mix_paint_area = function(paint_area, ctx) {
  ctx_mix.drawImage(paint_area,0,0);

  this.clean_canvas(paint_area, ctx);
}

// Download the canvas
ready_to_paint.prototype.download_pic = function(id) {
  document.getElementById(id).href = mix_area.toDataURL();
};

// Clean the canvas
ready_to_paint.prototype.clean_canvas = function(paint_area, ctx) {
  var ctx = ctx || ctx_mix;
  ctx.clearRect(0, 0, paint_area.width, paint_area.height);

  if (connectedPeer == null) {}
  else if (ctx != ctx_mix) {}
  else {chat_now.send_paint_data([true, 3]);}
};

// Creat a div to quest yes or no
ready_to_paint.prototype.question_y_or_n = function(what_quest, y_func) {
  var question_div_element = document.getElementById(what_quest)
  if (question_div_element != null) {return}

  var question_div = document.createElement("div");
  var div_text = document.createElement("div");
  var div_y_or_n = document.createElement("div");
  var input_button_y = document.createElement("input");
  var input_button_n = document.createElement("input");

  question_div.id = what_quest;
  question_div.className = "question_div";
  question_div.style.left = "30%";
  question_div.style.top = "30%";

  div_text.innerHTML = "<br>" + what_quest;

  input_button_y.setAttribute("type","button");
  input_button_y.setAttribute("value","Yes");
  input_button_y.setAttribute("onclick",y_func + "; ready_to_paint.prototype.n_func('"+what_quest+"');");

  input_button_n.setAttribute("type","button");
  input_button_n.setAttribute("value","No");
  input_button_n.setAttribute("onclick","ready_to_paint.prototype.n_func('"+what_quest+"');");

  document.body.appendChild(question_div);
  question_div.appendChild(div_text);

  question_div.appendChild(div_y_or_n);
  div_y_or_n.appendChild(input_button_y);
  div_y_or_n.appendChild(input_button_n);
} 

// Destroy the question's div
ready_to_paint.prototype.n_func = function(element_id) {
  var element_id = document.getElementById(element_id);
  document.body.removeChild(element_id);
}

// Change the line width
ready_to_paint.prototype.line_width = function() {
  ctx_my.lineWidth = line_width_doc.value;
};


// Be painted by other class
function be_painted_by_other () {}

be_painted_by_other.prototype.mouse_move = function(event) {
  this.x = event.clientX;
  this.y = event.clientY;

  ctx_else.lineTo(this.x, this.y);

  ctx_else.stroke();

  ready_to_paint.prototype.reset_paintting_beginning_and_mix(else_paint_area, ctx_else);
};

be_painted_by_other.prototype.mouse_down = function(event) {
  this.x = event.clientX;
  this.y = event.clientY;

  ctx_else.beginPath();

  ctx_else.moveTo(this.x, this.y);
};

be_painted_by_other.prototype.clean_canvas = function(paint_area) {
  ctx_mix.clearRect(0, 0, paint_area.width, paint_area.height);
};

// Create a paint object
var paint_now = new ready_to_paint();
// Create a be_painted_by_other object
var be_painted = new be_painted_by_other();
