// Spiral-in stars: spin from outside -> halfway flip -> vanish at center ⭐️

let NUM_OF_PARTICLES = i
let MAX_OF_PARTICLES = 500;
let particles = [];
let CX, CY, MAXR;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  CX = width * 0.5;
  CY = height * 0.5;
  MAXR = dist(0, 0, CX, CY); // far corner-ish
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();

  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  // nice neutral backdrop
  background(215, 225, 235);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.display();
    if (p.done) {
      // recycle to keep the show going
      particles[i] = new Particle();
    }
  }

  // cap (not really needed since we recycle)
  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, particles.length - MAX_OF_PARTICLES);
  }
}

class Particle {
  constructor() {
    // motion params
    this.startR = random(MAXR * 0.75, MAXR * 1.05); // start near the edge
    this.ang = random(TWO_PI);
    this.angSpeed = random(0.02, 0.05);             // base spin speed
    this.life = 0;                                   // 0 → 1
    this.lifeSpeed = random(0.004, 0.008);           // how fast to center
    this.size = random(16, 32);

    // color + twinkle
    this.h = random(360);
    this.tw = random(1000);
    this.spin = random(-0.03, 0.03);

    // bookkeeping
    this.x = CX + cos(this.ang) * this.startR;
    this.y = CY + sin(this.ang) * this.startR;
    this.done = false;
  }

  update() {
    // life progress
    this.life += this.lifeSpeed;
    if (this.life >= 1) {
      this.done = true; // reached middle → disappear
      return;
    }

    // spiral radius shrinks to 0 at center
    const r = (1 - this.life) * this.startR;

    // flip spin direction at halfway point
    const dir = (this.life < 0.5) ? 1 : -1;
    this.ang += dir * this.angSpeed;

    // position on spiral
    // small wobble makes the path organic
    const wob = 2.5 * sin(frameCount * 0.05 + this.tw);
    this.x = CX + cos(this.ang) * (r + wob);
    this.y = CY + sin(this.ang) * (r + wob);

    // twinkle + pastel hue drift
    this.tw += 0.12;
    this.h = (this.h + 0.2) % 360;
  }

  display() {
    if (this.done) return;

    push();
    translate(this.x, this.y);
    rotate(this.spin * frameCount);

    // fade as it nears the center (last 30% of life)
    const alpha = (this.life < 0.7)
      ? 210
      : map(this.life, 0.7, 1.0, 210, 0);

    // soft pastel palette
    const s = 35 + 15 * noise(this.tw * 0.02);
    const b = 95;

    fill(this.h, s, b, alpha);
    drawStar(0, 0, this.size * 0.42, this.size * 0.9, 5);
    pop();
  }
}

// reusable star drawer
function drawStar(x, y, innerR, outerR, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * outerR;
    let sy = y + sin(a) * outerR;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * innerR;
    sy = y + sin(a + halfAngle) * innerR;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
