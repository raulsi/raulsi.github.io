/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadexp(){

  var container, canvas, context;
  var WIDTH, HEIGHT;

  var circuits, mouseX, mouseY;
  init();
  setInterval(loop, 75);
  setTimeout(onWindowMouseDown,1);
  setTimeout(onWindowMouseDown,1);
  setInterval(onWindowMouseDown,500);
  var color = ['#088da5','#519b57','#ccff00','#222b61','#522575','#e55ea2','#97e3ad','#66556a','#fd1205','#6fd88d']
  function init()
  {
    container = document.getElementById('container');

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    var canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    container.appendChild(canvas);

    context = canvas.getContext("2d");
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect (0, 0, WIDTH, HEIGHT);

    circuits = new Array();

    window.addEventListener('mousedown', onWindowMouseDown, false);
  }

  function onWindowMouseDown(e)
  {
    if (!e)
      var e = window.event;

    if(e!=undefined){
      mouseX = e.clientX;
      mouseY = e.clientY;
    }else{
        mouseX = (parseInt(Math.random()*10)%2==0?-1:1)*(window.innerWidth/100)*(Math.random()*100);
        mouseY = (parseInt(Math.random()*10)%2==0?-1:1)*(window.innerHeight/100)*(Math.random()*100);
    }

    circuits.push(new Circuit(mouseX, mouseY, 1000));
  }

  function loop()
  {
    context.beginPath();
    context.strokeStyle = color[parseInt(Math.random()*100)%100];

    for (var i = 0; i < circuits.length; i++)
    {
      var circuit = circuits[i];
      circuit.life ++;

      context.moveTo(circuit.x, circuit.y);

      circuit.rw += Math.random() - .5;
      circuit.x += Math.tan((parseInt(Math.random()*10)%2==0?-1:1)*circuit.rw) * circuit.speed;
      circuit.y += Math.tan((parseInt(Math.random()*10)%2==0?-1:1)*circuit.rw) * circuit.speed;

      context.lineTo(circuit.x, circuit.y);

      if (circuit.life > circuit.max_life || circuit.x < 0 || circuit.y < 0 || circuit.x > WIDTH || circuit.y > HEIGHT)
        circuits.splice(i,1);

      if (Math.random() > 0.95 && circuits.length < 1000)
      {
        circuits.push(new Circuit(circuit.x, circuit.y, circuit.max_life / 10));
      }
    }

    context.stroke();
    context.closePath();

    context.fillStyle = "rgba(32, 32, 32, 0.05)";
    context.fillRect (0, 0, WIDTH, HEIGHT);
  }

  var Circuit = function(x, y, max_life)
  {
    this.life = 0;
    this.max_life = max_life;
    this.speed = Math.random() + 1;
    this.x = x;
    this.y = y;
    this.rw = Math.random() * 360;
  }


}
