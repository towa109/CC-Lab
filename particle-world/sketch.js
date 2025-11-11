let NUM_OF_PARTICLES = 200;
let MAX_OF_PARTICLES = 500;
let particles = [];
let CX, CY, MAXR;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  CX = width * 0.5;
  CY = height * 0.5;
  MAXR = dist(0, 0, CX, CY);
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();

  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(215, 225, 235);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.display();
    if (p.done) {
      particles[i] = new Particle(); // respawn
    }
  }

  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, particles.length - MAX_OF_PARTICLES);
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);

    const speed = random(1.2, 2.2);
    const dir = random(TWO_PI);
    this.vx = cos(dir) * speed;
    this.vy = sin(dir) * speed;

    this.baseSize = random(14, 28);
    this.h = random(360);

    this.life = 1.0;                         // 1 → 0
    this.decay = random(0.003, 0.007);       // how fast it fades
    this.done = false;
  }

  update() {
    // small random turn each frame
    const turn = random(-0.06, 0.06);
    const ct = cos(turn), st = sin(turn);
    const vx2 = this.vx * ct - this.vy * st;
    const vy2 = this.vx * st + this.vy * ct;
    this.vx = vx2;
    this.vy = vy2;

    // move
    this.x += this.vx;
    this.y += this.vy;

    // bounce on edges
    if (this.x < 0)   { this.x = 0;   this.vx *= -1; }
    if (this.x > width)  { this.x = width;  this.vx *= -1; }
    if (this.y < 0)   { this.y = 0;   this.vy *= -1; }
    if (this.y > height) { this.y = height; this.vy *= -1; }

    // decay
    this.life -= this.decay;
    if (this.life <= 0) this.done = true;

    // hue drift (tiny)
    this.h = (this.h + 0.25) % 360;
  }

  display() {
    if (this.done) return;

    const alpha = 220 * this.life;                         // fade out
    const s = 45;                                          // gentle pastel
    const b = 95;
    const size = this.baseSize * (0.6 + 0.4 * this.life);  // shrink a bit

    fill(this.h, s, b, alpha);
    drawStar(this.x, this.y, size * 0.42, size * 0.9, 5);
  }
}

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
