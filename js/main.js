var c = document.getElementById("arkanoidCanva");
var ctx = c.getContext("2d");

var radius = 10;
var x = c.width / 2;
var y = c.height - radius;

var dx = 2;
var dy = -2;

var paddlex = c.width / 2;
var paddley = c.height - 10;
var paddleW = 70;
var paddleH = 20;

var rightMove = false;
var leftMove = false;

var brickRows = 3;
var brickColumns = 6;
var brickWidth = 60;
var brickHeight = 20;
var brickPadding = 12;
var brickOfSetTop = 30;
var brickOfSetLeft = 80;

var score = 0;
var lives = 3;

var gameStarted = false;
//Estructura para guardar los bloques
var briks = [];
for (let i = 0; i < brickColumns; i++) {
  briks[i] = [];
  for (let j = 0; j < brickRows; j++) {
    briks[i][j] = { x: 0, y: 0, drawBrik: true };
  }
}
document.addEventListener("keydown", keyDownHandler, false); //type e, quien maneja el e
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

document.getElementById("startButton").addEventListener("click", function () {
  if (!gameStarted) {
    gameStarted = true;
    draw(); // Iniciar el juego al hacer clic en el botón
  }
});

//Cuando se presiona la tecla
function keyDownHandler(e) {
  if (e.keyCode == 37) {
    leftMove = true;
  } else {
    if (e.keyCode == 39) {
      rightMove = true;
    }
  }
}

//Cuando se libera la tecla
function keyUpHandler(e) {
  if (e.keyCode == 37) {
    leftMove = false;
  } else {
    if (e.keyCode == 39) {
      rightMove = false;
    }
  }
}

function mouseMoveHandler(e) {
  var mouseRelativeX = e.clientX - c.offsetLeft; //identifica donde esta el mouse en vertical
  if (mouseRelativeX > 0 && mouseRelativeX < c.width) {
    paddlex = mouseRelativeX - paddleW / 2;
  }
}

//Circulo
function dragBall() {
  ctx.beginPath();
  //punto en x, y, tamaño, punto de inicio y fin
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#991d5d";
  ctx.fill();
  ctx.closePath();
}

//rectangulo
function drawPaddle() {
  var cornerRadius = 10; // redondeado
  ctx.beginPath();
  ctx.moveTo(paddlex + cornerRadius, paddley);
  ctx.lineTo(paddlex + paddleW - cornerRadius, paddley);
  ctx.arcTo(
    paddlex + paddleW,
    paddley,
    paddlex + paddleW,
    paddley + cornerRadius,
    cornerRadius
  );
  ctx.lineTo(paddlex + paddleW, paddley + paddleH - cornerRadius);
  ctx.arcTo(
    paddlex + paddleW,
    paddley + paddleH,
    paddlex + paddleW - cornerRadius,
    paddley + paddleH,
    cornerRadius
  );
  ctx.lineTo(paddlex + cornerRadius, paddley + paddleH);
  ctx.arcTo(
    paddlex,
    paddley + paddleH,
    paddlex,
    paddley + paddleH - cornerRadius,
    cornerRadius
  );
  ctx.lineTo(paddlex, paddley + cornerRadius);
  ctx.arcTo(paddlex, paddley, paddlex + cornerRadius, paddley, cornerRadius);
  ctx.fillStyle = "#ff82b9";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let i = 0; i < brickColumns; i++) {
    for (let j = 0; j < brickRows; j++) {
      if (briks[i][j].drawBrik) {
        var bx = i * (brickWidth + brickPadding) + brickOfSetLeft;
        var by = j * (brickHeight + brickPadding) + brickOfSetTop;
        //Actualizamos las coordenadas
        briks[i][j].x = bx;
        briks[i][j].y = by;

        ctx.rect(bx, by, brickWidth, brickHeight);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function detectHits() {
  for (let i = 0; i < brickColumns; i++) {
    for (let j = 0; j < brickRows; j++) {
      var brick = briks[i][j];
      if (briks[i][j].drawBrik) {
        if (
          x > brick.x &&
          x < brick.x + brickWidth &&
          y > brick.y &&
          y < brick.y + brickHeight
        ) {
          //
          dy = -dy;
          brick.drawBrik = false;
          score++;
          if (score == brickColumns * brickRows) {
            alert("Congratulations YOU ARE BEST");
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#300000";
  ctx.fillText("Score: " + score, 20, 20); //str, cx, cy
}

function drawLives() {
  ctx.font = "19px Arial";
  ctx.fillStyle = "#300000";
  ctx.fillText("Lives: " + lives, c.width - 88, 20); //str, cx, cy
}

//Aqui se realizan todas las funciones
function draw() {
  ctx.clearRect(0, 0, c.width, c.height); //barrido de lo que hay en el canvas
  drawPaddle();
  dragBall();
  drawBricks();
  detectHits();
  drawScore();
  drawLives();
  //los if son para el rebote, que no salga del borde
  if (x + dx > c.width - radius || x + dx < radius) {
    dx = -dx;
  }

  if (y + dy < radius) {
    dy = -dy;
  } else {
    if (y + dy > c.height - radius) {
      //si es mayor a la tabla
      if (x > paddlex && x < paddlex + paddleW) {
        dy = -dy;
      } else {
        lives--;
        if (lives <= 0) {
          gameOver();
          lives = 0;
          return;
        } else {
          x = c.width / 2;
          y = c.height - radius;
          dx = 2;
          dy = -2;
          paddlex = c.width / 2;
        }
      }
    }
  }

  if (leftMove && paddlex > 0) {
    paddlex -= 8;
  }
  if (rightMove && paddlex < c.width - paddleW) {
    paddlex += 8;
  }
  //velocidad de movimiento px
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

function gameOver() {
  document.getElementById("arkanoidGameOver").style.display = "block";

  // Restablecer variables del juego
  gameStarted = false;
  score = 0;
  lives = 3;

  // Restablecer posición inicial de la bola y la paleta
  x = c.width / 2;
  y = c.height - radius;
  paddlex = c.width / 2;

  // Restablecer la matriz de bloques
  briks = [];
  for (let i = 0; i < brickColumns; i++) {
    briks[i] = [];
    for (let j = 0; j < brickRows; j++) {
      briks[i][j] = { x: 0, y: 0, drawBrik: true };
    }
  }

  setTimeout(function () {
    document.getElementById("arkanoidGameOver").style.display = "none";
  }, 2000);
}
// setInterval(draw, 10); //Se dibuja una y otra vez en el mismo sitio
// draw();
