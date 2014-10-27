//see live version at www.wormsetc.com/games/wormy2.html
// load objects
var images = {};
loadHero("head2");
loadHero("mid2");
loadHero("tail2");
loadAsset("apple");
loadAsset("bird");
loadBKG("bkg");
function loadHero (name) {
	images[name] = new Image();
	images[name].onload = function() {
		resourceLoaded();
	};
	images[name].src = "img/" + name + ".png";
	images[name].directionX = 1;
	images[name].directionY = 1;
	images[name].currentX = 1.8;
	images[name].currentY = 0;
	images[name].clock =function () {
		this.animate();
		this.updateCharPos();  
	};
// make worm squirm
	images[name].animate = function () {
	  if (this.directionX === 1) {
		this.currentX += this.incX;
		if (this.currentX > this.maxX) {
			this.directionX = -1;			
		}
	  } else {
	  this.currentX -= this.incX;
		if (this.currentX < -this.maxX) {
			this.directionX = 1;
		}
	  }
	  
	  if (this.directionY === 1) {
		this.currentY += this.incY;
		if (this.currentY > this.maxY) {
			this.directionY = -1;			
		}
	  } else {
	  this.currentY -= this.incY;
		if (this.currentY < -this.maxY) {
			this.directionY = 1;
		}
	  }
	};
	
//updates locations of hero
	images[name].updateCharPos = function () {
		heroX = runX + offsetX + birdX; // birdX&(Y) allow bird to carry worm
		heroY = jumpY + offsetY + birdY; 
	};
  }
// Load all non main characters
function loadAsset (name) {
	images[name] = new Image();
	images[name].onload = function() {
		resourceLoaded();
	};
	images[name].src = "img/" + name + ".png";
	images[name].friend = true;
	images[name].moving = 0;
	// runs all functions with setInterval
	images[name].clock = function () {
		this.respawnOrMove();
		this.collisionDetect();
		this.special();
	};
	images[name].special = function () {}; // hook for special functions
	images[name].speed = 13;
	images[name].spawnSpot = -500;
	images[name].currentY = 70;
	images[name].currentX = -150;
	images[name].respawnClock = 0;
	images[name].respawnTime = 2000;
	images[name].takingWorm = 0;
	images[name].collisionDetect = function () {
		if(Math.abs(heroX-this.currentX) < 40 && Math.abs((this.currentY-40)-heroY) < 50) {
		this.collisionEvent();
		}
	}
	images[name].collisionEvent = function () {
		
		if (this.friend) {
			scorePoints();
			chewing = 1;
			this.currentX = this.spawnSpot;
			this.moving = 0;
		} else { // maybe should use two load functions one for friends and one for foes
			this.takingWorm = 1;
			this.directionY = -1.2;
			
		}
	}
	images[name].respawnOrMove = function () {
		if (this.moving === 1) {
			this.move();
			
		} else if (this.respawnClock > this.respawnTime) {
			this.respawnClock = 0;
			this.moving = 1;
			this.respawnTime = getRandomArbitrary(3, 12)*1000;
			this.currentY = getRandomArbitrary(70, 240); 
			this.speed = getRandomArbitrary(8, 20);
		} else {
		this.respawnClock += behaviorUpdateSpeed;
		}
	};
	// below function is overwritten for bird
	images[name].move = function () {
		this.currentX += this.speed;
		if (this.currentX > gameWidth) {
			this.currentX = this.spawnSpot;
			this.moving = 0;
		}
  	};
  	
  	images[name].takeWorm = function () {
  		if (this.currentY > this.spawnSpot+30) {
	  		birdX += this.speed/3*this.directionX;	
  			birdY += this.speed*this.directionY;
  		} else {
  			this.takingWorm = 0;
  			birdX = 0;
  			birdY = 0;
  		}
  	}
}
// load background
function loadBKG (name) {
	images[name] = new Image();
	images[name].onload = function() {
		resourceLoaded();
	};
	images[name].src = "img/" + name + ".png";
}

// waits till all resources are loaded 
var totalResources = 6;
var totalLoaded = 0;
//set frame rate
var fps = 30;
var score = 0;
var updateFrequency = setInterval(updateTime, 1000/fps);
// sets x boundry edge
var gameWidth = 1000;
var gameHeight = 700;
var bkgX = -1;
// sets eyes
var eyeMax = 20;
var eyeCurrent = eyeMax;
var behaviorUpdateSpeed = 50;
var blinkFreq = 4000;
var openTime = 0;
var blinking = 0;
//sets mouth
var mouthMinW = 15;
var mouthMinH = 3;
var mouthMaxH = 15;
var mouthW = mouthMinW;
var mouthH = mouthMinH;
var chewFreq = 10500;
var chewing = 0;
var chews = 0;
// jumpBase number indicates resting number. inverse relation to height.
var jumpBase = 12;
var jumpCurrent = jumpBase;
var jumpInc = 1;
var jumping = 0;
var jumpY = 0;
var jumpDirection = 1;
//sets movement variables for hero
var leftBarrier = 0;
var rightBarrier = 700;
var heroSpeed = 0;
var heroMaxSpeed = 20;
var heroAcceleration = 4;
var heroAcelDir = 1;
var runX = 0;
var heroX = 0;
var heroY = 0;
var offsetX = 300;
var offsetY = 200;
//sets sqirm speed and limits
images.mid2.incX = .4;
images.mid2.maxX = 1.8;
images.mid2.incY =.05;
images.mid2.maxY = 1.5;

images.head2.incX = .4; 
images.head2.maxX = 1.8;
images.head2.incY = .06; 
images.head2.maxY = 1.5;

images.tail2.incX = .4;
images.tail2.maxX = 1.8;
images.tail2.incY = .08;
images.tail2.maxY = 1.5;
//Set variables and clocks for individual objects ie. ...bird : friend = 0
images.bird.friend = 0;
var birdX = 0;
var birdY = 0;

//sets number of loaded resources so game starts after loading all
function resourceLoaded () {
	totalLoaded +=1;
	if (totalResources === totalLoaded) {
		setInterval(redraw, 1000/fps);
	}

}
//runs functions at setInterval of fps
function updateTime () { 
	//for each (clock in images) {
	//	clock();
	//}
	
	images.head2.clock();
	images.tail2.clock();
	images.mid2.clock();
	images.apple.clock();
	images.bird.clock();
	
	openTime += behaviorUpdateSpeed;
	if (chewing === 1) {
		chew();
	} 
	if (openTime > blinkFreq) {
		blinking = 1;	
	}
	if (blinking === 1) {
		blink();
	}
	if (jumping === 1) {
		jump();
	}
	if (heroSpeed !== 0) {
		heroMove();
	}
	
}

// Key listeners

window.addEventListener('keydown', function (e) {
	if (e.keyCode == 38) {
		jumping = 1;
	}
	if (e.keyCode == 37) {
		heroAcelDir = -1;
		heroAccelerate();
	
	}
	if (e.keyCode == 39) {
		heroAcelDir = 1;
		heroAccelerate();
	}
}, true);

function blink () {
	eyeCurrent -=6;
	if (eyeCurrent <= 1) {
		eyeCurrent = eyeMax;
		openTime = 0;
		blinking = 0;
		} 
	blinkFreq = getRandomArbitrary(1, 9)*1000;
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
 	chewing = 0;
 	chews = 0;
 	}
 }
// in order to simulate physics jumpCurrent starts at the highest number 
// and decreases as the jump goes up. The number is squared and then added to the y axis
function jump () {
// check to see if going up or down	
	if (jumpDirection === 1) {
		jumpCurrent -= jumpInc;
		if (jumpCurrent <= 0) {
			jumpDirection = -1;
		}
// going down		
	} else {
		jumpCurrent += jumpInc;
		if (jumpCurrent >= jumpBase) {
			jumpCurrent = jumpBase;
			jumping = 0;
			jumpDirection = 1;
		}
	}
// square the result for physics
jumpY = jumpCurrent*jumpCurrent -  jumpBase*jumpBase;	

}			
function heroAccelerate () {
	if (Math.abs(heroSpeed) < heroMaxSpeed) {
		if (heroSpeed < heroAcceleration*2) {
			heroSpeed +=heroAcceleration*3*heroAcelDir;
		} else {
			heroSpeed += heroAcceleration*heroAcelDir;
		}
	}
}
//character hunting was prevented by using the 3way 1,-1,0 conditional to set speed to 0 if >-1<1
// runX variable is added to heroX
function heroMove () {
	runX += heroSpeed;
	if (heroX > rightBarrier || heroX < leftBarrier) {
		heroSpeed = heroSpeed/2;
		if (heroX > rightBarrier+600 || heroX < leftBarrier-600) {
			runX = 0;
			heroX = 0;
		}
	} 
//decelerate
	if (heroSpeed > 1) {
		heroSpeed -= heroAcceleration/3;
	} else if (heroSpeed < -1) {
		heroSpeed += heroAcceleration/3;
//prevent hunting
	} else { 
		heroSpeed = 0;
	}
}
function scorePoints () {
	score += 250;
	document.getElementById("score").innerHTML = "Score: " + score;
}
images.bird.directionY = 1;
images.bird.directionX = 1;
images.bird.move = function () {
		this.currentY += this.speed*this.directionY;
		this.currentX += this.speed/3*this.directionX;
		if (this.takingWorm === 1) {
				this.takeWorm();
			}
		if (this.currentY > gameHeight*.5) {  // makes bird go up
			this.directionY = -1;
		}
		if (this.currentY < this.spawnSpot) { //prevent bird from flying to moon
			this.moving = 0;
			this.directionY = 1;
		}
		
};
images.bird.respawnOrMove = function () {
		var rand; // random number to determine bird direction
		if (this.moving === 1) {
			this.move();
			// if moving == 0 the respawn clock runs. when time is up moving is set to 1 and the cycle parameters are set for next cycle
		} else if (this.respawnClock > this.respawnTime) {
			this.respawnClock = 0;
			this.moving = 1;
			this.respawnTime = getRandomArbitrary(3, 12)*1000;
			this.currentX = getRandomArbitrary(leftBarrier, rightBarrier); 
			rand = getRandomArbitrary(1, 10);
			if (rand < 6) {
				this.directionX = -1;
			} else { 
				this.directionX = 1;
			}
			this.speed = getRandomArbitrary(8, 20);
			this.currentY = -200;
			if (this.currentX < leftBarrier+150) { //prevent bird from flying off screen edges
				this.directionX = 1;
				
			} else if (this.currentX > rightBarrier-150) {
			
				this.directionX = -1;
				
			}
		} else {
		this.respawnClock += behaviorUpdateSpeed;
		}
	};
	

// special functions for assets
// bird dive function - did not like this so decided to make bird travel vertically only
/*images.bird.dive = function () {
	if (this.currentY < heroY) {
		this.currentY += this.diveRate;
	} else {
		this.currentY -= this.diveRate;
	}
};
images.bird.movingLast = 0;
images.bird.diveLocation = 0;
images.bird.diving = 0;
images.bird.diveRate = .3;
images.bird.special = function () {
	if (this.moving != this.movingLast) {
		this.currentY = getRandomArbitrary(0, 60);
		this.diveLocation = getRandomArbitrary(10, 500);
		this.diveRate = getRandomArbitrary(2, 7);
		this.diving = 0;
		this.movingLast = this.moving;
	}
	if (this.currentX > this.diveLocation) {
		this.dive();
	}
};
*/		
//start drawing
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var x = 300;
var y = 200;
function redraw () {
	
	myCanvas.width = myCanvas.width;
	ctx.drawImage(images["bkg"], bkgX, -300);
	// drawEllipse(images.apple.currentX + 30, 340, 50+images.apple.currentY/2, 20); // apple shadow
	drawEllipse(120+heroX, 140+offsetY, 240+heroY/3, 20);// worm shadow
	ctx.drawImage(images["tail2"], heroX+images.tail2.currentX, heroY+images.tail2.currentY);
	ctx.drawImage(images["mid2"], heroX-images.mid2.currentX, images.mid2.currentY+heroY);
	ctx.drawImage(images["head2"], heroX+images.head2.currentX, heroY+images.head2.currentY);
	drawEllipse(heroX+40+images.head2.currentX, heroY+62, 10, eyeCurrent); //left eye
	drawEllipse(heroX+60+images.head2.currentX, heroY+62, 10, eyeCurrent); //right eye
	drawEllipse(heroX+50+images.head2.currentX, heroY+82+images.head2.currentY, mouthW, mouthH); //mouth
	ctx.drawImage(images["apple"], images.apple.currentX, images.apple.currentY);
	ctx.drawImage(images["bird"], images.bird.currentX, images.bird.currentY);
	
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
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
