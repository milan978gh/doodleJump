const grid = document.querySelector('.grid');
const doodler = document.createElement('div');
let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;


// create doodler
function createDoodler() {
  doodler.classList.add('doodler');
  grid.appendChild(doodler);
  doodlerLeftSpace = platforms[0].left;
  doodler.style.left = doodlerLeftSpace + 'px';
  doodler.style.bottom = doodlerBottomSpace + 'px';
}
// class platform
class Platform {
  constructor(newPlatBottom) {
    this.left = Math.random() * 315;
    this.bottom = newPlatBottom;
    this.visual = document.createElement('div');

    const visual = this.visual;
    visual.classList.add('platform');
    visual.style.left = this.left + 'px';
    visual.style.bottom = this.bottom + 'px';
    grid.appendChild(visual);
  }
}
// create platforms
function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platGap = 600 / platformCount;
    let newPlatBottom = 100 + i * platGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
  }
}
// move platforms
function movePlatforms() {
  if (doodlerBottomSpace > 200) {
    platforms.forEach(platform => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + 'px';

      if(platform.bottom<10){
        let firstPlatform=platforms[0].visual
        firstPlatform.classList.remove('platform')
        platforms.shift()
        let newPlatform=new Platform(600)
        platforms.push(newPlatform)
      }
    });
  }
}
// jump
function jump() {
  clearInterval(downTimerId);
  isJumping = true;
  upTimerId = setInterval(function() {
    doodlerBottomSpace += 20;
    doodler.style.bottom = doodlerBottomSpace + 'px';
    if (doodlerBottomSpace > (startPoint + 200)) {
      fall();
      isJumping = false;
    }
  }, 30);
}
// fall
function fall() {
  clearInterval(upTimerId);
  isJumping = false;
  downTimerId = setInterval(function() {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + 'px';
    if (doodlerBottomSpace <= 0) {
      gameOver();
    }
    platforms.forEach(platform => {
      if ((doodlerBottomSpace >= platform.bottom) &&
        (doodlerBottomSpace <= platform.bottom + 15) &&
        ((doodlerLeftSpace + 60) >= platform.left) &&
        (doodlerLeftSpace <= (platform.left + 85)) &&
        !isJumping
      ) {
        startPoint = doodlerBottomSpace;
        jump();
        isJumping = true;
      }
    });
  }, 20);
}
// control
function control(e) {
  if (e.key === 'ArrowLeft') {
    moveLeft();
  } else if (e.key === 'ArrowRight') {
    moveRight();
  } else if (e.key === 'ArrowUp') {
    moveStraight();
  }
}
// move left
function moveLeft() {
  if (isGoingRight) {
    clearInterval(rightTimerId);
    isGoingRight = false;
  }
  isGoingLeft = true;
  leftTimerId = setInterval(function() {
    if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + 'px';
    } else moveRight();
  }, 20);
}
// move right
function moveRight() {
  if (isGoingLeft) {
    clearInterval(leftTimerId);
    isGoingLeft = false;
  }
  isGoingRight = true;
  rightTimerId = setInterval(function() {
    if (doodlerLeftSpace <= 313) {
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + 'px';
    } else moveLeft();
  }, 20);
}
// move straight
function moveStraight() {
  isGoingLeft = false;
  isGoingRight = false;
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}
// game over
function gameOver() {
  isGameOver = true;
  clearInterval(upTimerId);
  clearInterval(downTimerId);

}
// start game
function start() {
  if (!isGameOver) {
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 30);
    jump();
    document.addEventListener('keydown', control);
  }
}
start();
