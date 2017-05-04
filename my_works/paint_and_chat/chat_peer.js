
// 設置變數
var my_seed_doc = document.getElementById("my_seed");
var else_seed_doc = document.getElementById("else_seed");
var chat_box_doc = document.getElementById("chat_box");
var connect_doc = document.getElementById("connect");
var msg_doc = document.getElementById("msg");

// 雙方的名子(只對本機有影響)
var my_name = "你";
var else_name = "某地的誰";

// 儲存對方種子的變數
var connectedPeer = null;


// Chat class
function ready_to_chat() {
  connect_doc.disabled = false;
  else_seed_doc.disabled = false;
  else_seed_doc.value = null;
  this.clean_msg();
};

// Connect to a peer
ready_to_chat.prototype.connect_to_a_peer = function() {
  if (else_seed_doc.value == "") {else_seed_doc.placeholder = "請輸入「他的種子碼」！！！"; return;}
  var c = peer.connect(else_seed_doc.value);
  c.on('open', function() {
    chat_box_doc.innerHTML += "<small>你現在在跟" + c.peer + "連線</small>";
    connect_doc.value = "連接成功！";
    connect_doc.disabled = true;
    else_seed_doc.disabled = true;
  });

  c.on('error', function(err) { alert(err); });

  connectedPeer = c;
};

// Be connected
ready_to_chat.prototype.connect = function(c) {
  if (connectedPeer === null) {
    connectedPeer = peer.connect(c.peer);
    chat_box_doc.innerHTML += "<small>你現在在跟" + c.peer + "連線</small>";
    connect_doc.value = "連接成功！";
    connect_doc.disabled = true;
    else_seed_doc.value = c.peer;
    else_seed_doc.disabled = true;
  };

  if (connectedPeer.peer == c.peer) {
    c.on('data', function(data) {
      if (data[0] == true) {
        if (data[1] == 1) {ctx_else.strokeStyle = data[4]; ctx_else.lineWidth = data[5]; be_painted.mouse_move({clientX: data[2], clientY: data[3]})}
        else if (data[1] == 0) {ctx_else.strokeStyle = data[4]; ctx_else.lineWidth = data[5]; be_painted.mouse_down({clientX: data[2], clientY: data[3]})}
        else if (data[1] == 2) {ready_to_paint.prototype.mix_paint_area(else_paint_area, ctx_else)}
        else if (data[1] == 3) {be_painted.clean_canvas(mix_area)}
      }
      else {
        chat_box_doc.innerHTML += '<br><span>' + else_name + ': ' + data + '</span>';
        ready_to_chat.prototype.auto_scroll_down();
      }
    });
  }
};

// Send message
ready_to_chat.prototype.send_msg = function() {
  if (msg_doc.value == "" || msg_doc.value == "\n") {msg_doc.value = null; return;}
  if (connectedPeer == null) {
    this.your_msg_in_chat_box(msg_doc.value);
    this.your_msg_in_chat_box("哇賽！你單機也可以聊天？","迷之音");
  }
  else {
    connectedPeer.send(msg_doc.value);
    this.your_msg_in_chat_box(msg_doc.value);
  }
};

ready_to_chat.prototype.your_msg_in_chat_box = function(msg, name) {
  var name = name || my_name;
  chat_box_doc.innerHTML += '<br><span>' + name + ': ' + msg + '</span>';
  this.clean_msg();
  this.auto_scroll_down();
};

// Use 'Enter' to quick send message
ready_to_chat.prototype.enter_to_send = function(event, if_down) {
  var x = event.which || event.keyCode;
  if (x == 13) {
    var if_down = if_down || false;
    if (if_down) {this.send_msg();}
    else {this.clean_msg();}
  }
};

// Auto scroll down
ready_to_chat.prototype.auto_scroll_down = function() {
  chat_box_doc.scrollTop += 400;
};

// Clean sended message
ready_to_chat.prototype.clean_msg = function() {
  msg_doc.value = '';
};

// Clean message box
ready_to_chat.prototype.clean_chat_box = function() {
  chat_box_doc.innerHTML = '';
};

// Send online picture
ready_to_chat.prototype.send_pic = function() {
  msg_doc.value += "<img src='在此貼上圖片網址' width='100' height='100'>";
};

// Send paint data
ready_to_chat.prototype.send_paint_data = function(data) {
  connectedPeer.send(data);
};


// 連接p2p伺服器
var peer = new Peer({

  key: 'l5x0z92jxqdxi529',

  // debug:3,

  // logFunction: function() {
  //   var copy = Array.prototype.slice.call(arguments).join(' ');
  //   console.log(copy);
  // }
});

// Creat a chat object
var chat_now = new ready_to_chat();

// Show this peer's ID.
peer.on('open', function(id) {
  my_seed_doc.innerHTML = id;
});

// Await connections from other
peer.on('connection', chat_now.connect);

peer.on('error', function(err) {
  console.log(err);
});
