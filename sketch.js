let pots = [];
let turn = 0;
let inMove = false;
let gameOver = false;

let mouseIndex = 0;
let handIndex = 0;
let moveClock = 0;
let handCount = 0;
let handX = 0;
let handY = 0;
let targetHandX = 0;
let targetHandY = 0;
let oldHandX = 0;
let oldHandY = 0;

const moveSpeed = 10;
const pebblePosVar = 20;
let baseSeed;
let turnCount;
let winner;

const confettiDensity = 2;
const confettiSize = 9;
const confettiSpeed = 3.5;
const confettiSpeedVar = 1.5;
const confettiDriftVar = 1.75;
let confettiArray = [];
let bounceSpeed = 8;
let bounceY = 0;
let time;

function setup() {

  createCanvas(1000, 300);
  frameRate(30);
  baseSeed = random(100);

  for (let i = 0; i < 14; i++) {
    if (i < 7) {
      pots[i] = new Pot(i, 6 - i, 0);
    } else {
      pots[i] = new Pot(i, i - 6, 1);
    }
  }

  for (let i = 0; i < 14; i++) {

    pots[i].update();
  }

  print("     -=:SETUP COMPLETE:=-");
}

function draw() {

  background(204, 237, 255);

  pebbleSum = handCount;
  for (let i = 0; i < 14; i++) {//updating pots and drawing pebbes

    pots[i].update();
    pebbleSum += pots[i].count;
    if (pots[i].isBig && pots[i].index == 6) {

      drawPebbles(pots[i].index * baseSeed, pots[i].count, pots[i].x + 50, pots[i].y + 100, true, false);
    } else if (pots[i].isBig && pots[i].index == 13) {

      drawPebbles(pots[i].index * baseSeed, pots[i].count, pots[i].x + 50, pots[i].y + 0, true, false);
    } else {

      drawPebbles(pots[i].index * baseSeed, pots[i].count, pots[i].x + 50, pots[i].y + 50, false, false);
    }
  }
  if (pebbleSum != 48) {

    print("MANUAL ERROR: Uneven sum of pebbles: " + pebbleSum);
  }

  let a = 0;
  for (let i = 0; i < 6; i++) {//win conditions

    a += pots[i].count;
  }
  if (a == 0 && !inMove && !gameOver) {

    gameOver = true;
  }

  let b = 0;
  for (let i = 0; i < 6; i++) {

    b += pots[i + 7].count;
  }
  if (b == 0 && !inMove && !gameOver) {

    print("Game Over");
    if (pots[6].count > pots[13].count) {

      winner = 0;
    } else if (pots[6].count < pots[13].count){

      winner = 1;
    } else {

      winner = 2;
    }
    gameOver = true;
  }

  noFill();
  stroke(0);
  strokeWeight(4);
  rect(90, 50, 820, 200, 30);

  if (!pots[mouseIndex].isBig && pots[mouseIndex].indexY == turn && !inMove && !gameOver) {// cursor/highlights or whatever

    noFill();
    stroke(92, 198, 255);
    strokeWeight(6);
    rect(pots[mouseIndex].x - 3, pots[mouseIndex].y - 3, 106, 106, 5);
  }
  if (inMove && !pots[handIndex].isBig) {

    noFill();
    stroke(92, 198, 255);
    strokeWeight(6);
    rect(pots[handIndex].x - 3, pots[handIndex].y - 3, 106, 106, 5);
  } else if (inMove && pots[handIndex].index == 6) {

    noFill();
    stroke(92, 198, 255);
    strokeWeight(6);
    rect(pots[handIndex].x - 3, pots[handIndex].y - 3, 106, 206, 5);
  } else if (inMove && pots[handIndex].index == 13) {

    noFill();
    stroke(92, 198, 255);
    strokeWeight(6);
    rect(pots[handIndex].x - 3, pots[handIndex].y - 103, 106, 206, 5);
  }

  if (inMove) {

    drawPebbles(baseSeed, handCount, handX, handY, false, true);

    if (moveClock >= moveSpeed) {// move update

      handIndex++;

      if (handIndex == 14) {//looping
        handIndex = 0;
      }

      oldOldHandX = oldHandX;
      oldOldHandY = oldHandY;
      oldHandX = targetHandX;
      oldHandY = targetHandY;
      if (handIndex != 13) {

        targetHandX = pots[handIndex + 1].x + 50;
        targetHandY = pots[handIndex + 1].y + 50;
      } else {

        targetHandX = pots[0].x + 50;
        targetHandY = pots[0].y + 50;
      }

      if (pots[handIndex].index == 5) {

        targetHandY += 50;
      } else if (pots[handIndex].index == 12) {

        targetHandY -= 50;
      }

      if (turn == 0 && handIndex == 13) {//skipping opponent pots

        handIndex = 0;
      } else if (turn == 1 && handIndex == 6) {

        handIndex = 7;
      }

      if (handCount > 0) {//if you still have pebbles in hand

        handCount--;
        pots[handIndex].count++;

      } else {// if you are out

        handIndex--;
        if (handIndex < 0) {

          handIndex = 13;
        }
        if (!pots[handIndex].isBig) {// if you end on a normal pot

          print("Ended on a normal pot");

          if (pots[handIndex].indexY == 1 && pots[handIndex].count == 1) {//if you land in an empty space

            if (turn == 0) {

              pots[6].count += pots[6 - (handIndex - 6)].count;
            } else {

              pots[13].count += pots[6 - (handIndex - 6)].count;
            }
            pots[6 - (handIndex - 6)].count = 0;
          } else if (pots[handIndex].indexY == 0 && pots[handIndex].count == 1) {

            if (turn == 0) {

              pots[6].count += pots[6 + (6 - handIndex)].count;
            } else {

              pots[13].count += pots[6 + (6 - handIndex)].count;
            }
            pots[6 + (6 - handIndex)].count = 0;
          }

          if (turn == 0) {//turn over
            turn = 1;
          } else {
            turn = 0;
          }
          inMove = false;

        } else {// if you end on a big pot

          print("Ended on a a big pot");
          if (pots[handIndex].index == 6 && turn == 1 && handCount != 0) {

            print("Wait nvm mb 1");
          } else if (pots[handIndex].index == 13 && turn == 0 && handCount != 0) {

            print("Wait nvm mb 0");
          } else {

            inMove = false;
          }
        }
      }

      moveClock = 0;
      print("Updated move");
    } else {

      ratio = moveClock/moveSpeed;
      handX = oldHandX - (oldHandX - targetHandX) * ratio;
      handY = oldHandY - (oldHandY - targetHandY) * ratio;

      moveClock++;
    }
  }

  //nameCards
  fill(240);
  stroke(0);
  strokeWeight(5);
  rect(0, -15, 125, 45, 15);
  rect(width - 125, -15, 125, 45, 15);

  fill(0);
  noStroke();
  textSize(25);
  textAlign(CENTER, TOP);
  text("Player 1", 125 / 2, 1);
  text("Player 2", width - (125 / 2), 1);

  if (gameOver) {

    inMove = false;

    for (let i = 0; i < confettiDensity; i++) {//confetti

      let newConf = new confetti();
      confettiArray.push(newConf);
      newConf.index = confettiArray.length;
    }

    for (let i = 0; i < confettiArray.length; i++) {

      confettiArray[i].update();
    }

    if (winner == 0) {

      stroke(0);
      strokeWeight(5);
      fill(171, 219, 245);
      rect((width / 2) - 150, (height / 2) - 37.5, 300, 75, 20);

      fill(0);
      noStroke();
      textSize(45);
      textAlign(CENTER, CENTER);
      text("Player 1 Wins!", width / 2, height / 2);
    } else if (winner == 1) {

      stroke(0);
      strokeWeight(5);
      fill(171, 219, 245);
      rect((width / 2) - 150, (height / 2) - 37.5, 300, 75, 20);

      fill(0);
      noStroke();
      textSize(45);
      textAlign(CENTER, CENTER);
      text("Player 2 Wins!", width / 2, height / 2);
    } else {

      stroke(0);
      strokeWeight(5);
      fill(171, 219, 245);
      rect((width / 2) - 75, (height / 2) - 37.5, 150, 75, 20);

      fill(0);
      noStroke();
      textSize(55);
      textAlign(CENTER, CENTER);
      text("Tie!", width / 2, height / 2);
    }
  }
}

class Pot {
  constructor (index_, indexX_, indexY_) {

    this.index = index_;
    this.indexX = indexX_;
    this.indexY = indexY_;
    this.x = (0 + this.indexX) * 100 + 100;
    this.y = this.indexY * 100 + 50;
    if (this.index == 6 || this.index == 13) {

      this.isBig = true;
      this.count = 0;
    } else {

      this.isBig = false;
      this.count = 4;
      this.mouseHover = false;
    }

    print("New pot created at " + this.indexX + " : " + this.indexY + " with index " + this.index);
  }

  update() {

    if (mouseX < this.x + 100 && mouseX > this.x && mouseY < this.y + 100 && mouseY > this.y && !this.isBig) {

      this.mouseHover = true;
    } else if (mouseX < this.x + 100 && mouseX > this.x && mouseY < this.y + 200 && mouseY > this.y && this.index == 6) {

      this.mouseHover = true;
    } else if (mouseX < this.x + 100 && mouseX > this.x && mouseY < this.y + 100 && mouseY > this.y - 100 && this.index == 13) {

      this.mouseHover = true;
    } else {

      this.mouseHover = false;
    }
    if (this.mouseHover) {
      mouseIndex = this.index;
    }

    if (!this.isBig) {

      fill(252, 239, 197);
      noStroke();
      rect(this.x, this.y, 100, 100,);

      noStroke();
      fill(232, 219, 177);
      ellipse(this.x + 50, this.y + 50, 80, 80);
    } else if (this.index == 6) {

      fill(252, 239, 197);
      noStroke();
      rect(this.x - 10, this.y, 110, 200, 30, 0, 0, 30);

      noStroke();
      fill(232, 219, 177);
      rect(this.x + 10, this.y + 10, 80, 180, 40);
    } else if (this.index == 13) {

      fill(252, 239, 197);
      noStroke();
      rect(this.x, this.y - 100, 110, 200, 0, 30, 30, 0);

      noStroke();
      fill(232, 219, 177);
      rect(this.x + 10, this.y - 90, 80, 180, 40);
    }

    if (this.index == 6) {

      noStroke();
      fill(171, 219, 245);
      ellipse(this.x - 28, this.y + 100, 40, 40);

      fill(0);
      noStroke();
      textSize(25);
      textAlign(CENTER, CENTER);
      text(this.count, this.x - 28, this.y + 100);
    } else if (this.index == 13) {

      noStroke();
      fill(171, 219, 245);
      ellipse(this.x + 128, this.y, 40, 40);

      fill(0);
      noStroke();
      textSize(25);
      textAlign(CENTER, CENTER);
      text(this.count, this.x + 128, this.y);
    } else if (this.indexY == 0) {

      noStroke();
      fill(171, 219, 245);
      ellipse(this.x + 50, this.y - 18, 30, 30);

      fill(0);
      noStroke();
      textSize(25);
      textAlign(CENTER, BOTTOM);
      text(this.count, this.x + 50, this.y - 5);
    } else if (this.indexY == 1) {

      noStroke();
      fill(171, 219, 245);
      ellipse(this.x + 50, this.y + 118, 30, 30);

      fill(0);
      noStroke();
      textSize(25);
      textAlign(CENTER, TOP);
      text(this.count, this.x + 50, this.y + 105);
    }
  }
}

function drawPebbles (seed, count, x, y, isBig, isHand) {

  stroke(0);
  strokeWeight(4);
  fill(85);
  randomSeed(seed);
  for (let i = 0; i < count; i++) {

    if ((i + floor(seed)) % 4 == 0) {

      xVar = random(5, pebblePosVar);
      yVar = random(-pebblePosVar, -5);
    } else if ((i + floor(seed)) % 4 == 1) {

      xVar = random(5, pebblePosVar);
      yVar = random(5, pebblePosVar);
    } else if ((i + floor(seed)) % 4 == 2) {

      xVar = random(-pebblePosVar, -5);
      yVar = random(5, pebblePosVar);
    } else if ((i + floor(seed)) % 4 == 3) {

      xVar = random(-pebblePosVar, -5);
      yVar = random(-pebblePosVar, -5);
    }

    if (isBig) {

      yVar = yVar * 3;
    }

    if (isHand) {

      ellipse(x + xVar, y + yVar, 35, 35);
    } else {

      ellipse(x + xVar, y + yVar, 30, 30);
    }
  }
}

function mousePressed () {

  if (!pots[mouseIndex].isBig && pots[mouseIndex].indexY == turn && !inMove && pots[mouseIndex].count != 0 && !gameOver) {

    turnCount++;
    inMove = true;
    handCount = pots[mouseIndex].count;
    pots[mouseIndex].count = 0;
    handIndex = mouseIndex;

    oldHandX = pots[handIndex].x + 50;
    oldHandY = pots[handIndex].y + 50;
    targetHandX = pots[handIndex + 1].x + 50;
    targetHandY = pots[handIndex + 1].y + 50;
    if (pots[handIndex].index == 6) {

      targetHandY += 50;
    } else if (pots[handIndex].index == 13) {

      targetHandY -= 50;
    }
    handX = pots[handIndex].x + 50;
    handY = pots[handIndex].y + 50;
    moveClock = moveSpeed - moveSpeed;
  }
}

class confetti {

  constructor () {

    randomSeed(time);

    this.x = random(0, width);
    this.y = -10;
    this.varX = random(-confettiDriftVar, confettiDriftVar);
    this.speed = random(confettiSpeed - confettiSpeedVar, confettiSpeed + confettiSpeedVar);
    this.index;

    this.x1 = random(0, confettiSize);
    this.y1 = random(0, confettiSize);
    this.x2 = random(-confettiSize, 0);
    this.y2 = random(0, confettiSize);
    this.x3 = random(-confettiSize, 0);
    this.y3 = random(-confettiSize, 0);
    this.x4 = random(0, confettiSize);
    this.y4 = random(-confettiSize, 0);

    this.r = random(150, 250);
    this.g = random(150, 250);
    this.b = random(150, 250);
  }

  update () {

    noStroke();
    fill(this.r, this.g, this.b);
    quad(this.x + this.x1, this.y + this.y1, this.x + this.x2, this.y + this.y2, this.x + this.x3, this.y + this.y3, this.x + this.x4, this.y + this.y4);

    this.y += this.speed;
    this.x += this.varX;
  }
}
