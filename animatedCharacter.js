//see live version at www.wormsetc.com/games/wormy.html

var images = {};
loadImage("head");
loadImage("mid");
loadImage("tail");
function loadImage (name) {
	images[name] = new Image();
	images[name].onload = function() {
		resourceLoaded();
	}
	images[name].src = "img/" + name + ".png";
	images[name].direction = 1;
	images[name].current = 0;
	images[name].move = function () {
	  if (this.direction === 1) {
		this.current += this.inc;
		console.log(this.current);
		if (this.current > this.max) {
			this.direction = -1;			
		}
	  } else {
	  this.current -= this.inc;
		if (this.current < -this.max) {
			this.direction = 1;
		}
	  }
	}; 
  }
  
var totalResources = 3;
var totalLoaded = 0;
var fps = 30;

var eyeMax = 50;
var eyeCurrent = eyeMax;
var updateEyeTime = setInterval(updateOpenTime, 1000/fps);
var blinkUpdateTime = 50;
var blinkFreq = 4000;
var openTime = 0;
var random = 4000;

images.mid.inc =.2;
images.mid.max = 4;

images.head.inc = .1; 
images.head.max = 8;

images.tail.inc = .3;
images.tail.max = 10;



function updateOpenTime () { 
	images.head.move();
	images.tail.move();
	images.mid.move();
	openTime += blinkUpdateTime;
	if (openTime > blinkFreq) {
		blink();
	
		blinkFreq = random;
		console.log(blinkFreq);
		
	}
}

function blink () {
	eyeCurrent -=12;
	if (eyeCurrent <= 1) {
		eyeCurrent = eyeMax;
		openTime = 0;
		} 
}


function resourceLoaded () {
	totalLoaded +=1;
	if (totalResources === totalLoaded) {
		setInterval(redraw, 1000/fps);
	}

}





//start drawing
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var charX = 1;
var charY = 1;
function redraw () {
	var x = charX;
	var y = charY;
	
	myCanvas.width = myCanvas.width;
	drawEllipse(280+x, 300+y, 600, 30);
	ctx.drawImage(images["mid"], x+images.mid.current, y);
	ctx.drawImage(images["tail"], x+images.tail.current, y);
	ctx.drawImage(images["head"], x+images.head.current, y);
	drawEllipse(83 + x + images.head.current, 102 + y, 30, eyeCurrent); //left
	drawEllipse(112 + x + images.head.current, 95 + y, 30, eyeCurrent); //right
}
function drawEllipse(centerX, centerY, width, height) {
	
  ctx.beginPath();
  
  ctx.moveTo(centerX, centerY - height/2);
  
  ctx.bezierCurveTo(
    centerX + width/2, centerY - height/2,
    centerX + width/2, centerY + height/2,
    centerX, centerY + height/2);

  ctx.bezierCurveTo(
    centerX - width/2, centerY + height/2,
    centerX - width/2, centerY - height/2,
    centerX, centerY - height/2);
 
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();	
}
