//see live version at www.wormsetc.com/games/wormy2.html
/// By: Matthew Wilson
/// Feel free to use this code with your own images
/// This is my first programing project larger than a few lines, 
/// If you see something that could have been done better, please feel to teach me a better way
/// I am trying to learn best practices as I go
///
var images = {};
loadObject("head2");
loadObject("mid2"); 
loadObject("tail2");
loadObject("apple");
loadObject("tomato");
loadObject("carrot");
loadObject("bird");
loadObject("hawk");
loadObject("bkg");
function loadObject (name) {
	images[name] = new Image();
	images[name].onload = function() {
		resourceLoaded();
	};
	images[name].src = "img/" + name + ".png";
	switch (name) {
	  case "head2":
	  case "mid2":
	  case "tail2":
	  	loadHero(name);
	  	break;
	  case "apple":
	  case "tomato":
	  case "carrot":
	  	loadCommon(name);			// load atributes shared by several
	  	loadFood(name);
	  	break; 
	  case "bird":
	  	loadCommon(name);
	  	loadBird(name);
	  	break;
	  case "hawk":
	  	loadCommon(name);
	  	loadHawk(name);
	  	break;
	}
}
function loadHero (name) {
	images[name].directionX = 1;
	images[name].directionY = 1;
	images[name].currentX = 1.8;
	images[name].currentY = 0;
	images[name].clock =function () {
		this.animate();
		this.updateCharPos();  
	};
	images[name].animate = function () {		// make worm squirm
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
	images[name].updateCharPos = function () {	// adds values to worm x & y from all movement functions
		heroX = runX + offsetX + birdX; 	// birdX&(Y) allow bird to carry worm
		heroY = jumpY + offsetY + birdY; 
	};
}
function loadCommon (name) { 
	images[name].moving = 0;
	images[name].clock = function () {
		this.respawnOrMove();
		this.collisionDetect();
	};
	images[name].speed = 13;
	images[name].currentY = 70;
	images[name].currentX = -250;
	images[name].respawnClock = 0;
	images[name].respawnTime = 2000;
	images[name].collisionDetect = function () {
		if(Math.abs(heroX-this.currentX) < 90 && Math.abs((this.currentY-40)-heroY) < 90) {
		this.collisionEvent();
		}
	}
};
function loadFood (name) {
	//images[name].takingWorm = 0;
	images[name].collisionEvent = function () {
			scorePoints();
			chewing = 1;
			this.currentX = spawnSpotX;
			this.moving = 0;
	}
	images[name].respawnOrMove = function () {
		if (this.moving === 1) {
			this.move();
			
		} else if (this.respawnClock > this.respawnTime) {
			this.respawnClock = 0;
			this.moving = 1;
			this.respawnTime = getRandomArbitrary(3, 12)*1000;
			this.currentY = getRandomArbitrary(70, 300); 
			this.speed = getRandomArbitrary(8, 30);
		} else {
		this.respawnClock += behaviorUpdateSpeed;
		}
	};
	images[name].move = function () {
		this.currentX += this.speed;
		if (this.currentX > gameWidth) {
			this.currentX = spawnSpotX;
			this.moving = 0;
		}
  	};
}

function loadBird (name) {
	images[name].directionY = 1;
	images[name].directionX = 1;
	images[name].takingWorm = 0;
	images[name].move = function () {
		this.currentY += this.speed*this.directionY;
		this.currentX += this.speed/3*this.directionX;
		if (this.takingWorm === 1) {
				this.takeWorm();
			}
		if (this.currentY > gameHeight*.38) {  				// changes bird direction 
			this.directionY = -1;
		}
		if (this.currentY < spawnSpotY) {			 	//prevent bird from flying to moon
			this.moving = 0;
			this.directionY = 1;
		}
		
	};
	images[name].respawnOrMove = function () {
		var rand; 							// random number to determine bird direction
		if (this.moving === 1) {
			this.move();						// if moving == 0 the respawn clock runs. when time is up moving is set to 1 
		} else if (this.respawnClock > this.respawnTime) {		// and the cycle parameters are set for next cycle
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
			this.speed = getRandomArbitrary(8, 16);
			this.currentY = -200;
			if (this.currentX < leftBarrier+150) { 			//prevent bird from flying off screen edges
				this.directionX = 1;
				
			} else if (this.currentX > rightBarrier-150) {
			
				this.directionX = -1;
				
			}
		} else {
		this.respawnClock += behaviorUpdateSpeed;
		}
	};
	images[name].collisionEvent = function () {
		if (invincible === 0) {
			this.takingWorm = 1;
			this.directionY = -1.2;
			wormEaten();
		}
	}
  	images[name].takeWorm = function () {
  		if (this.currentY > spawnSpotY+80) {
	  		birdX += this.speed/3*this.directionX;	
  			birdY += this.speed*this.directionY;
  			heroSpeed = 0;						// prevent worm movenent
  			jumpY = 0;
  			
  		} else {
  			this.takingWorm = 0;
  			birdX = 0;						// respawn worm 
  			birdY = 0;
  		}
  	}
}
function loadHawk (name) {
	images[name].speed = 20;
	images[name].takingWorm = 0;
	images[name].move = function () {
		this.currentY += this.speed;
		if (this.takingWorm === 1) {
				this.takeWorm();
		}
		if (this.currentY > gameHeight+100) { 				// trigger respawn
			this.moving = 0;
			this.currentY = spawnSpotY;
		}
	};
	images[name].respawnOrMove = function () {
		if (this.moving === 1) {
			this.move();
		} else if (this.respawnClock > this.respawnTime) {
			this.respawnClock = 0;
			this.moving = 1;
			this.respawnTime = getRandomArbitrary(3, 12)*2000;
			if (getRandomArbitrary(1, 10) < 5) {
				this.currentX = leftBarrier+20;
			} else {
				this.currentX = rightBarrier-180;
			}
			this.currentY = spawnSpotY;
			
		} else {
		this.respawnClock += behaviorUpdateSpeed;
		}
	};
	images[name].collisionEvent = function () {
		if (invincible === 0) {
			this.takingWorm = 1;
			wormEaten();
		}
	}
  	images[name].takeWorm = function () {
  		if (this.currentY < gameHeight-80) {	
  			birdY += this.speed;
  			heroSpeed = 0;					// prevent worm movenent
  			jumpY = 0;
  			
  		} else {
  			this.takingWorm = 0;
  			birdX = 0;					// respawn worm 
  			birdY = 0;
  		}
  	}

}
	
// waits till all resources are loaded 
var totalResources = 9;
var totalLoaded = 0;
//set frame rate
var fps = 30;
var lives = 3;
var score = 0;
var updateFrequency = setInterval(updateTime, 1000/fps);
// variable to insure wormEaten trigered only once
takingWormLast = 0;
// sets x boundry edge
var gameWidth = 1000;
var gameHeight = 700;
var bkgX = -1;
var spawnSpotX = -500;
var spawnSpotY = -500;
// sets eyes
var eyeMax = 12;
var eyeCurrent = eyeMax;
var behaviorUpdateSpeed = 50;
var blinkFreq = 4000;
var openTime = 0;
var blinking = 0;
//sets mouth
var mouthMinW = 12;
var mouthMinH = 3;
var mouthMaxH = 12;
var mouthW = mouthMinW;
var mouthH = mouthMinH;
var chewFreq = 10500;
var chewing = 0;
var chews = 0;
// jumpBase number indicates resting number. inverse relation to height.
var jumpBase = 16;
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
var offsetY = 260;
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
var birdX = 0;
var birdY = 0;
//sets number of loaded resources so game starts after loading all
function resourceLoaded () {					
	totalLoaded +=1;
	if (totalResources === totalLoaded) {
		setInterval(redraw, 1000/fps);
		alert("Use the arrow keys to move around. Feed your worm vegitables and scraps, but watch out for birds!");
	}

}
function updateTime () { 						//runs functions at setInterval of fps
	/*
	for (i=0; i<assets.length; i++) {
		images.assets[i].clock();
	} 
	*/
	images.head2.clock();
	images.tail2.clock();
	images.mid2.clock(); 
	images.apple.clock();
	images.tomato.clock();
	images.carrot.clock();
	images.bird.clock();
	images.hawk.clock();
	
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
var invincible = 0;
function wormEaten () {
	if (invincible === 0) {
		livesMinus();
		invincible = 1;
		setTimeout(function(){invincible = 0;},3000);
	}
}
function livesMinus () {
	lives -= 1;
	document.getElementById("lives").innerHTML = "lives: " + lives;
	if (lives <= 0) {
		alert("You are dead. Refresh page to play again");
		offsetX = 9999;
		offsetY = 9999;
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
		heroSpeed = 0;
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
	ctx.drawImage(images["bkg"], bkgX, -300); 							//draw background
	drawEllipse(images.apple.currentX+30, 360, 20+images.apple.currentY/2, 20); 			// apple shadow
	drawEllipse(images.tomato.currentX+30, 360, 20+images.tomato.currentY/2, 20); 			//tomato shadow
	drawEllipse(images.carrot.currentX+30, 360, 20+images.carrot.currentY/2, 20); 			//carrot shadow
	drawEllipse(70+heroX, 100+offsetY, 120+heroY/3, 20);						// worm shadow
	if (images.bird.currentY > -200) {								// prevent shadow when bird is high
	drawEllipse(images.bird.currentX+50, 360, 50+images.bird.currentY/8, 20); }			//bird shadow
	if (images.hawk.currentY > -100 && images.hawk.currentY < gameHeight) {								
	drawEllipse(images.hawk.currentX+80, images.hawk.currentY+400, 50+images.hawk.currentY/8, 20); }//hawk shadow
	ctx.drawImage(images["tail2"], heroX+images.tail2.currentX, heroY+images.tail2.currentY); 	// worm tail
	ctx.drawImage(images["mid2"], heroX-images.mid2.currentX, images.mid2.currentY+heroY); 		// worm middle
	ctx.drawImage(images["head2"], heroX+images.head2.currentX, heroY+images.head2.currentY); 	//worm head
	drawEllipse(heroX+28+images.head2.currentX, heroY+42, 7, eyeCurrent); 				//worm left eye
	drawEllipse(heroX+42+images.head2.currentX, heroY+42, 7, eyeCurrent); 				//worm right eye
	drawEllipse(heroX+35+images.head2.currentX, heroY+58+images.head2.currentY, mouthW, mouthH);	//worm mouth
	ctx.drawImage(images["apple"], images.apple.currentX, images.apple.currentY);			//apple
	ctx.drawImage(images["carrot"], images.carrot.currentX, images.carrot.currentY);		//carrot
	ctx.drawImage(images["tomato"], images.tomato.currentX, images.tomato.currentY);		//tomato
	ctx.drawImage(images.hawk, images.hawk.currentX, images.hawk.currentY);				//hawk
	if(images.bird.directionX === -1) {								//bird flying left
		ctx.scale(-1, 1);
		ctx.drawImage(images["bird"], images.bird.currentX*-1 -128, images.bird.currentY);
	} else {											//bird flying right
		ctx.drawImage(images["bird"], images.bird.currentX, images.bird.currentY);
	}
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
