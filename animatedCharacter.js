//see live version at www.wormsetc.com/games/wormy2.html

// added move function to image properties and added some common variables to the constructor

var images = {};
loadImage("head2");
loadImage("mid2");
loadImage("tail2");
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

var eyeMax = 20;
var eyeCurrent = eyeMax;
var updateEyeTime = setInterval(updateTime, 1000/fps);
var blinkUpdateTime = 50;
var blinkFreq = 4000;
var openTime = 0;
var random = 4000;

var mouthMinW = 15;
var mouthMinH = 3;
var mouthMaxH = 15;
var mouthW = mouthMinW;
var mouthH = mouthMinH;
var chewFreq = 10500;
var chewTime = 0;
var chews = 0;
// jumpBase number indicates resting number. inverse relation to height.
var jumpBase = 10;
var jumpCurrent = jumpBase;
var jumpInc = 1;
var jumping = 0;
jumpX = 0;
jumpDirection = 1;


images.mid2.inc =.18;
images.mid2.max = 3;

images.head2.inc = .1; 
images.head2.max = 4;

images.tail2.inc = .12;
images.tail2.max = 2;
	


function updateTime () { 
	images.head2.move();
	images.tail2.move();
	images.mid2.move();
	openTime += blinkUpdateTime;
	chewTime += blinkUpdateTime;
	if (chewTime > chewFreq) {
		chew();
	} 
	if (openTime > blinkFreq) {
		blink();	
	}
	if (jumping === 1) {
		jump();
	}
}

function blink () {
	eyeCurrent -=6;
	if (eyeCurrent <= 1) {
		eyeCurrent = eyeMax;
		jumping = 1;
		openTime = 0;
		} 
}
 function chew () {
 	if (chews <5) {
 		if (mouthH < mouthMaxH) {
 		mouthH ++;
 		}else {
 		mouthH = mouthMinH;
 		chews ++;
 		}
 	} else { 
 	chewTime = 0;
 	chews = 0;
 	}
 }
// in order to simulate physics jumpCurrent starts at the highest number 
// and decreases as the jump goes up. The number is squared and then added to the y axis
function jump () {
	jumpX = jumpCurrent*jumpCurrent -  jumpBase*jumpBase;
	if (jumpDirection === 1) {
		jumpCurrent -= jumpInc;
		console.log(jumpCurrent+ 'jumpCurUp');
		if (jumpCurrent <= 0) {
			jumpDirection = -1;
		}		
	} else {
		jumpCurrent += jumpInc;
		console.log(jumpCurrent + 'jumpCurDown');
		if (jumpCurrent >= jumpBase) {
			jumpCurrent = jumpBase;
			jumping = 0;
			jumpDirection = 1;
		}
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

var x = 300;
var y = 200;
function redraw () {
	
	myCanvas.width = myCanvas.width;
	drawEllipse(x+120+images.mid2.current, y+140, 270+jumpX/2, 20);
	ctx.drawImage(images["tail2"], x+images.tail2.current+images.mid2.current, y+jumpX);
	ctx.drawImage(images["mid2"], x+images.mid2.current, y+jumpX);
	ctx.drawImage(images["head2"], x+images.head2.current+images.mid2.current, y+jumpX);
	drawEllipse(x+40+images.head2.current+images.mid2.current, y+62+jumpX, 10, eyeCurrent); //left
	drawEllipse(x+60+images.head2.current+images.mid2.current, y+62+jumpX, 10, eyeCurrent); //right
	drawEllipse(x+50+images.head2.current+images.mid2.current, y+82+jumpX, mouthW, mouthH); //mouth
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
