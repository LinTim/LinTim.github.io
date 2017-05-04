



ready_to_paint.prototype.insert_pic = function() {

  if (document.getElementById('input') != null) {return;}

  var input = document.createElement('input');
  input.type = 'text';
  input.id = 'input';
  input.style.position = 'absolute';
  input.style.bottom = '9%';
  input.style.left = '28%'; 
  document.body.appendChild(input);
  
  document.getElementById('input').onkeypress = function(event) {
   	var x = event.which || event.keyCode ; 
   	if (x == 13) {
    	var image = document.createElement('img');
    	image.src = document.getElementById('input').value;
    	image.id = 'image';
    	document.body.removeChild(document.getElementById('input'));
    	var img = document.getElementById("image");
      ctx_my.drawImage(image,10,10);
   	} 

  }
  
};


ready_to_paint.prototype.insert_text = function() {

  if (document.getElementById('canvas_text') != null) {return;}

  var canvas_text = document.createElement("canvas");
  canvas_text.width = '200';
  canvas_text.height = '50';
  canvas_text.id = 'canvas_text';
  canvas_text.draggable = 'true';
  canvas_text.style.width = 72.5*20/128 + '%';
  canvas_text.style.height = 83*5/72 + '%';

  canvas_text.ondragstart = function(event) {
    event.dataTransfer.setData("text", event.target.id);

    canvas_text.addEventListener('mousemove', this.mouse_move, false);
  }

  my_paint_area.ondragover = function(event) {
    var a = my_paint_area.getBoundingClientRect()
    paint_now.x = document.getElementById('canvas_text').style.left = event.clientX;
    paint_now.y = document.getElementById('canvas_text').style.top = event.clientY;
  };

  document.body.appendChild(canvas_text);

  var ctx_text = canvas_text.getContext('2d');

  if (document.getElementById('input2') != null) {return;}

  var input2 = document.createElement('input');
  input2.type = 'text';
  input2.id = 'input2';
  input2.style.position = 'absolute';
  input2.style.bottom = '2%';
  input2.style.left = '28%'; 
  document.body.appendChild(input2);

  document.getElementById('input2').onkeypress = function(event) {
    var x = event.which || event.keyCode ; 
    if (x == 13) {
      document.body.removeChild(input2);
      ctx_text.font = "30px Arial";
      ctx_text.fillText(input2.value,10,50);
    }
  }

};


ready_to_paint.prototype.insert_figure = function() {

  if (document.getElementById('canvas_figure') != null) {return;}

  var canvas_figure = document.createElement("canvas");
  canvas_figure.width = '200';
  canvas_figure.height = '200';
  canvas_figure.id = 'canvas_figure';
  canvas_figure.draggable = 'true';
  canvas_figure.style.width = 72.5*20/128 + '%';
  canvas_figure.style.height = 83*20/72 + '%';

  canvas_figure.ondragstart = function(event) {
    event.dataTransfer.setData("text", event.target.id);

    canvas_figure.addEventListener('mousemove', this.mouse_move, false);
  }

  my_paint_area.ondragover = function(event) {
    var a = my_paint_area.getBoundingClientRect()
    paint_now.x = document.getElementById('canvas_figure').style.left = event.clientX;
    paint_now.y = document.getElementById('canvas_figure').style.top = event.clientY;
  };

  document.body.appendChild(canvas_figure);

  var ctx_figure = canvas_figure.getContext('2d');


  var block = document.createElement('div');
  block.id = 'block';
  block.style.background = 'black';
  block.style.position = 'absolute';
  block.style.bottom = '2%';
  block.style.left = '22%';
  block.style.width = '25%';
  block.style.height = '5%';
  document.body.appendChild(block);

  var rectangle = document.createElement('input');
  rectangle.type = 'button';
  rectangle.id = 'buttonrect';
  rectangle.value = '長方形';
  rectangle.style.width = '20%';
  rectangle.style.height = '100%'; 
  document.getElementById('block').appendChild(rectangle);
  
  document.getElementById('buttonrect').onclick = function() {
    close_all();
    ctx_figure.beginPath();
    ctx_figure.rect(1,1,150,100);
    ctx_figure.stroke();
  }


  var circle = document.createElement('input');
  circle.type = 'button';
  circle.id = 'buttoncir';
  circle.value = '圓形';
  circle.style.width = '20%';
  circle.style.height = '100%'; 
  document.getElementById('block').appendChild(circle);
  
  document.getElementById('buttoncir').onclick = function() {
    close_all();
    ctx_figure.beginPath();
    ctx_figure.arc(51,51,50,0,2*Math.PI);
    ctx_figure.stroke();
  }

  var arrow = document.createElement('input');
  arrow.type = 'button';
  arrow.id = 'buttonarr';
  arrow.value = '箭頭';
  arrow.style.width = '20%';
  arrow.style.height = '100%'; 
  document.getElementById('block').appendChild(arrow);
  
  document.getElementById('buttonarr').onclick = function() {
    close_all();
    ctx_figure.beginPath();
    ctx_figure.moveTo(0,100);
    ctx_figure.lineTo(200,100);
    ctx_figure.lineTo(175,75);
    ctx_figure.arcTo(200,100,175,125,35);
    ctx_figure.lineTo(200,100);
    ctx_figure.stroke();
    ctx_figure.fill();
  }
  var triangle = document.createElement('input');
  triangle.type = 'button';
  triangle.id = 'buttontra';
  triangle.value = '三角形';
  triangle.style.width = '20%';
  triangle.style.height = '100%'; 
  document.getElementById('block').appendChild(triangle);
  
  document.getElementById('buttontra').onclick = function() {
    close_all();
    ctx_figure.beginPath();
   	ctx_figure.moveTo(0,200);
  	ctx_figure.lineTo(100,27);
  	ctx_figure.lineTo(200,200);
  	ctx_figure.closePath();
  	ctx_figure.stroke();
  }
	var star = document.createElement('input');
  star.type = 'button';
  star.id = 'buttonsta';
  star.value = '星型';
  star.style.width = '20%';
  star.style.height = '100%'; 
  document.getElementById('block').appendChild(star);
  
  document.getElementById('buttonsta').onclick = function() {
    close_all();
	
    ctx_figure.beginPath();

    var length = 30; 
    // length of the star's arm
    // move into the middle of the canvas, just to make room
    ctx_figure.translate(50, 50);

    // initial offset rotation so our star is straight
    ctx_figure.rotate((Math.PI * 1 / 10));

    // make a point, 5 times
    for (var i = 5; i--;) {
      // draw line up
      ctx_figure.lineTo(0, length);
      // move origin to current same location as pen
      ctx_figure.translate(0, length);
      // rotate the drawing board
      ctx_figure.rotate((Math.PI * 2 / 10));
      // draw line down
      ctx_figure.lineTo(0, -length);
      // again, move origin to pen...
      ctx_figure.translate(0, -length);
      // ...and rotate, ready for next arm
      ctx_figure.rotate(-(Math.PI * 6 / 10));
    }
    // last line to connect things up
  	ctx_figure.lineTo(0, length);
  	ctx_figure.closePath();
    // stroke the path, you could also .fill()
  	ctx_figure.stroke();

    ctx_figure.rotate(Math.PI * 19 / 10);
    ctx_figure.translate(-50, -50);

  }

  function close_all () {
    document.body.removeChild(document.getElementById('block'));
  }
};

