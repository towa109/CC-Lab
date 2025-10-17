/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let fireworks = [];
let bgMix = 0;
let nightOn = 0;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container")
  angleMode(DEGREES);
}

function draw() {
  let target = 0;
  if (nightOn === 1) {
    target = 1;
  }
  let sp = 0.06;
  if (target > bgMix) {
    bgMix = bgMix + sp;
  } else {
    bgMix = bgMix - sp;
  }
  if (bgMix < 0) {
    bgMix = 0;
  }
  if (bgMix > 1) {
    bgMix = 1;
  }

  let inv = 1 - bgMix;
  let r = 165 * inv + 20 * bgMix;
  let g = 210 * inv + 28 * bgMix;
  let b = 240 * inv + 70 * bgMix;

  background(r, g, b);

  drawBackgroundBubbles();
}

function keyPressed() {
  if (nightOn === 0) {
    nightOn = 1;
  } else {
    nightOn = 0;
  }
}

function drawBackgroundBubbles() {
  noStroke();
  let i = 0;
  while (i < 16) {
    let t = frameCount * 0.7 + i * 35;
    while (t > 560) {
      t = t - 560;
    }
    let y = 480 - t;

    let s = frameCount * 0.5 + i * 90;
    while (s > 920) {
      s = s - 920;
    }
    let x = -60 + s + sin(frameCount + i * 17) * 2;

    let r = 8 + (sin(i * 19.3 + frameCount * 0.2) * 0.5 + 0.5) * 6;
    fill(255, 255, 255, 25);
    circle(x, y, r);

    i = i + 1;
  }
  drawHorns(500, 165);
  creature();
  drawEye(460, 170);
  drawEye(540, 170);
  drawCandy(660, 290);

  // fireworks
  for (let i = 0; i < fireworks.length; i++) {
    let f = fireworks[i];
    fill(f[4], f[5], f[6], f[3]);
    noStroke();
    circle(f[0], f[1], 5);
    f[0] = f[0] + f[7];
    f[1] = f[1] + f[8];
    f[3] = f[3] - 5;
  }

  let newList = [];
  for (let i = 0; i < fireworks.length; i++) {
    if (fireworks[i][3] > 0) {
      newList.push(fireworks[i]);
    }
  }
  fireworks = newList;
}

function mousePressed() {
  for (let i = 0; i < 90; i++) {
    let x = mouseX;
    let y = mouseY;
    let a = 255;
    let r = random(200, 255);
    let g = random(100, 255);
    let b = random(200, 255);
    let vx = random(-3, 3);
    let vy = random(-3, 3);
    fireworks.push([x, y, 5, a, r, g, b, vx, vy]);
  }
}

function creature() {
  noStroke();
  fill("pink");
  rect(375, 200, 250, 300, 150);
  circle(500, 195, 230);
  ellipse(600, 280, 170, 80);
  ellipse(400, 280, 170, 80);
  ellipse(420, 470, 110, 70);
  ellipse(575, 470, 110, 70);

  fill("white");
  circle(500, 220, 50);
  rect(450, 280, 100, 170, 60);

  fill("purple");
  ellipse(645, 290, 70, 30);
  ellipse(355, 290, 70, 30);
}

function drawHorns(hx, hy) {
  fill(110, 30, 180);
  noStroke();
  push();
  translate(hx - 70, hy - 70);
  triangle(-25, 25, 0, -35, 25, 25);
  pop();

  push();
  translate(hx + 70, hy - 70);
  triangle(-25, 25, 0, -35, 25, 25);
  pop();
}

function drawEye(x, y) {
  push();
  translate(x, y);
  let blink = (sin(frameCount * 0.5) + 1) / 2;
  blink = 0.3 + 0.7 * blink;
  fill(255);
  ellipse(0, 0, 40, 35 * blink);
  fill(30, 40, 70);
  ellipse(0, -2, 20, 25 * blink);
  fill(255, 255, 255, 150);
  ellipse(5, -5 * blink, 5, 5 * blink);
  pop();
}

function drawCandy(px, py) {
  push();
  translate(px, py);
  let ang = sin(frameCount * 2.2) * 9 + sin(frameCount * 0.6) * 3;
  rotate(ang);

  stroke(90, 60, 20);
  strokeWeight(7);
  line(0, 0, 0, -55);

  noStroke();
  fill(255, 120, 180);
  circle(0, -75, 60);
  fill(140, 220, 255);
  circle(0, -75, 48);
  fill(255, 120, 180);
  circle(0, -75, 36);
  fill(140, 220, 255);
  circle(0, -75, 22);
  fill(255);
  circle(0, -75, 8);
  pop();
}
