/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadexp(){

  var container, canvas, context;
  var WIDTH, HEIGHT;

  var branches, mouseX, mouseY;
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

    branches = new Array();

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

    branches.push(new Branch(mouseX, mouseY, 1000));
  }

  function loop()
  {
    context.beginPath();
    context.strokeStyle = color[parseInt(Math.random()*100)%100];

    for (var i = 0; i < branches.length; i++)
    {
      var branch = branches[i];
      branch.life ++;

      context.moveTo(branch.x, branch.y);

      branch.rw += Math.random() - .5;
      branch.x += Math.tan((parseInt(Math.random()*10)%2==0?-1:1)*branch.rw) * branch.speed;
      branch.y += Math.tan((parseInt(Math.random()*10)%2==0?-1:1)*branch.rw) * branch.speed;

      context.lineTo(branch.x, branch.y);

      if (branch.life > branch.max_life || branch.x < 0 || branch.y < 0 || branch.x > WIDTH || branch.y > HEIGHT)
        branches.splice(i,1);

      if (Math.random() > 0.95 && branches.length < 1000)
      {
        branches.push(new Branch(branch.x, branch.y, branch.max_life / 10));
      }
    }

    context.stroke();
    context.closePath();

    context.fillStyle = "rgba(32, 32, 32, 0.05)";
    context.fillRect (0, 0, WIDTH, HEIGHT);
  }

  var Branch = function(x, y, max_life)
  {
    this.life = 0;
    this.max_life = max_life;
    this.speed = Math.random() + 1;
    this.x = x;
    this.y = y;
    this.rw = Math.random() * 360;
  }


}
