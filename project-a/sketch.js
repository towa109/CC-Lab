/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let fireworks = [];
let bubbles = [];
let seaweed = [];
let bgMix = 0;
let nightOn = 0;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container")
  angleMode(DEGREES);
  makeSeaweed();
}

function draw() {
  let target;
  if (nightOn === 1) {
    target = 1;
  } else {
    target = 0;
  }

  let diff = target - bgMix;
  bgMix = bgMix + diff * 0.06;
  bgMix = constrain(bgMix, 0, 1);

  let inv = 1 - bgMix;
  let r = 165 * inv + 20 * bgMix;
  let g = 210 * inv + 28 * bgMix;
  let b = 240 * inv + 70 * bgMix;
  background(r, g, b);

  if (nightOn === 0) {
    drawSeaweed();
  }

  drawHorns(500, 165);
  creature();
  drawEye(460, 170);
  drawEye(540, 170);
  drawCandyOrTorch(660, 290);

  if (nightOn === 0) {
    moveBubbles();
  } else {
    moveFireworks();
  }
}

function keyPressed() {
  if (nightOn === 0) {
    nightOn = 1;
  } else {
    nightOn = 0;
  }
}

function mousePressed() {
  if (nightOn === 1) {
    // night: fireworks
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
  } else {
    // day: bubbles
    for (let i = 0; i < 10; i++) {
      bubbles.push([
        mouseX + random(-6, 6),
        mouseY + random(-6, 6),
        random(-0.3, 0.3),
        random(-2.0, -1.0),
        random(10, 20),
      ]);
    }
  }
}

function moveBubbles() {
  let next = [];
  for (let i = 0; i < bubbles.length; i++) {
    let b = bubbles[i];
    b[0] = b[0] + b[2];
    b[1] = b[1] + b[3];
    b[4] = b[4] - 0.15;

    noFill();
    stroke(180, 220, 255);
    strokeWeight(2);
    ellipse(b[0], b[1], b[4], b[4]);
    noStroke();
    fill(255);
    circle(b[0] - b[4] * 0.22, b[1] - b[4] * 0.25, b[4] * 0.35);

    if (b[1] + b[4] > -20) {
      if (b[4] > 2) {
        next.push(b);
      }
    }
  }
  bubbles = next;
}

function moveFireworks() {
  noStroke();
  let newList = [];
  for (let i = 0; i < fireworks.length; i++) {
    let f = fireworks[i];
    fill(f[4], f[5], f[6]);
    circle(f[0], f[1], 5);
    f[0] = f[0] + f[7];
    f[1] = f[1] + f[8];
    f[3] = f[3] - 5;

    if (f[3] > 0) {
      newList.push(f);
    }
  }
  fireworks = newList;
}

function makeSeaweed() {
  seaweed = [];
  for (let i = 0; i < 9; i++) {
    let x = map(i, 0, 8, 50, width - 50);
    let h = random(240, 320);
    let w = random(28, 36);
    let speed = random(0.12, 0.2);
    let amp = random(10, 16);
    let phase = random(0, 360);
    let r = 18 + random(-2, 2);
    let g = 120 + random(-6, 6);
    let b = 105 + random(-4, 4);
    seaweed.push({
      x: x,
      h: h,
      w: w,
      speed: speed,
      amp: amp,
      phase: phase,
      col: [r, g, b],
    });
  }
}

function drawSeaweed() {
  for (let i = 0; i < seaweed.length; i++) {
    drawOneWakame(seaweed[i]);
  }
}

function drawOneWakame(sw) {
  let baseSway = sin(frameCount * sw.speed + sw.phase) * sw.amp;
  let segs = 12;
  let baseY = height;

  fill(sw.col[0], sw.col[1], sw.col[2]);
  noStroke();

  beginShape();
  for (let s = 0; s <= segs; s++) {
    let u = s / segs;
    let ease = u * u * u;
    let ruf = sin(frameCount * 0.8 + s * 28) * 2 * u;
    let cx = sw.x + baseSway * ease + ruf;
    let cy = baseY - sw.h * u;
    let w = sw.w * (1 - u * 0.45) + 8;
    vertex(cx - w * 0.5, cy);
  }
  for (let s = segs; s >= 0; s--) {
    let u = s / segs;
    let ease = u * u * u;
    let ruf = sin(frameCount * 0.8 + s * 28) * 2 * u;
    let cx = sw.x + baseSway * ease + ruf;
    let cy = baseY - sw.h * u;
    let w = sw.w * (1 - u * 0.45) + 8;
    vertex(cx + w * 0.5, cy);
  }
  endShape(CLOSE);

  // light streaks
  let lr = sw.col[0] + 8;
  if (lr > 255) lr = 255;
  let lg = sw.col[1] + 20;
  if (lg > 255) lg = 255;
  let lb = sw.col[2] + 12;
  if (lb > 255) lb = 255;
  fill(lr, lg, lb);
  let u1 = 0.55;
  let u2 = 0.3;
  let cx1 = sw.x + baseSway * (u1 * u1 * u1);
  let cy1 = baseY - sw.h * u1;
  let cx2 = sw.x + baseSway * (u2 * u2 * u2);
  let cy2 = baseY - sw.h * u2;
  ellipse(cx1 - 6, cy1, 22, 7);
  ellipse(cx2 + 8, cy2, 18, 6);
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
  let speed;
  if (nightOn === 1) {
    speed = 1.6;
  } else {
    speed = 0.5;
  }
  let blink = (sin(frameCount * speed) + 1) / 2;
  blink = 0.3 + 0.7 * blink;

  fill(255);
  ellipse(0, 0, 40, 35 * blink);
  if (nightOn === 1) {
    fill(255, 100, 150);
  } else {
    fill(30, 40, 70);
  }
  ellipse(0, -2, 20, 25 * blink);
  fill(255);
  ellipse(5, -5 * blink, 5, 5 * blink);
  pop();
}

function drawCandyOrTorch(px, py) {
  push();
  translate(px, py);
  let sway = sin(frameCount * 2.0) * 6 + sin(frameCount * 0.5) * 2;
  rotate(sway);

  stroke(90, 60, 20);
  strokeWeight(7);
  line(0, 0, 0, -55);
  noStroke();

  if (nightOn === 1) {
    let fx = 0;
    let fy = -75;
    fill(255, 140, 60);
    circle(fx, fy, 66);
    fill(255, 190, 80);
    circle(fx, fy - 3, 46);
    fill(255, 230, 120);
    circle(fx, fy - 6, 28);
    fill(255, 255, 200);
    circle(fx, fy - 9, 14);
  } else {
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
  }
  pop();
}
