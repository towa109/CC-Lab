// CCLab Mini Project - 9.R Particle World Template
// pastel stars that orbit in pairs, then switch partners periodically ✨

let NUM_OF_PARTICLES = 200;
let MAX_OF_PARTICLES = 500;

let particles = [];
let pairs = [];
const SWITCH_INTERVAL_FRAMES = 360; // ~6 sec @60fps

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();

  // ensure even number so everyone has a partner
  NUM_OF_PARTICLES = floor(NUM_OF_PARTICLES / 2) * 2;

  // make particles
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(random(width), random(height));
  }

  // make initial pairs + assign partners
  initPairs();
  assignPartners();
}

function draw() {
  background(215, 225, 221); // soft sky (HSB)

  // update pairs (their pivots drift + spin)
  for (let pr of pairs) pr.update();

  // update + display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  // limit total number (not dynamically adding here but keeping the rule)
  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, 1);
  }

  // re-pair on interval
  if (frameCount % SWITCH_INTERVAL_FRAMES === 0) {
    rePair();
  }
}

/* ---------- Pair class: shared pivot for two orbiting stars ---------- */
class Pair {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.7, 0.7);
    this.vy = random(-0.7, 0.7);
    this.baseAngle = random(TWO_PI);
    this.angSpeed = random(0.01, 0.03);
    this.wobble = random(1000);
  }
  update() {
    // soft randomish drift
    this.x += this.vx * 0.8 + 0.5 * noise(this.wobble) - 0.25;
    this.y += this.vy * 0.8 + 0.5 * noise(this.wobble + 100) - 0.25;
    this.wobble += 0.01;

    // wrap edges for endless float
    if (this.x < -40) this.x = width + 40;
    if (this.x > width + 40) this.x = -40;
    if (this.y < -40) this.y = height + 40;
    if (this.y > height + 40) this.y = -40;

    // spin the orbit
    this.baseAngle += this.angSpeed;
  }
}

/* ---------- Particle (star) ---------- */
class Particle {
  constructor(startX, startY) {
    // visual
    this.size = random(16, 34);
    this.hBase = random(360);   // pastel hue base (will drift)
    this.twinkle = random(100); // alpha flutter
    this.spin = random(-0.03, 0.03);

    // movement (set after pairing)
    this.pairIndex = 0;
    this.side = 1; // +1 or -1 to sit opposite their partner
    this.radius = random(24, 55); // orbit radius
    this.offset = random(TWO_PI); // personal phase offset for variety

    // fallback position before pair assignment
    this.x = startX;
    this.y = startY;
  }

  update() {
    const pr = pairs[this.pairIndex];
    if (pr) {
      // angle around the shared pivot
      const a = pr.baseAngle + this.offset + (this.side === 1 ? 0 : PI);

      // lil’ breathing on radius
      const breathe = 1 + 0.12 * sin(frameCount * 0.05 + this.offset);
      const r = this.radius * breathe;

      // position from pair pivot + a tiny independent wiggle
      this.x = pr.x + cos(a) * r + sin(frameCount * 0.02 + this.offset) * 2;
      this.y = pr.y + sin(a) * r + cos(frameCount * 0.025 + this.offset) * 2;
    }

    // twinkle + hue drift
    this.twinkle += 0.12;
    this.hBase = (this.hBase + 0.25) % 360; // slow rainbow drift
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.spin * frameCount);

    // soft pastel color (low-ish sat, bright, twinkly alpha)
    const h = this.hBase;
    const s = 35 + 20 * noise(this.offset + frameCount * 0.01); // 35–55
    const b = 95;
    const a = 190 + 65 * sin(this.twinkle); // 125–255
    fill(h, s, b, a);

    drawStar(0, 0, this.size * 0.42, this.size * 0.9, 5);
    pop();
  }
}

/* ---------- Helpers: pairing + re-pairing ---------- */
function initPairs() {
  const pairCount = floor(particles.length / 2);
  pairs = [];
  for (let i = 0; i < pairCount; i++) {
    pairs.push(new Pair(random(width), random(height)));
  }
}

function assignPartners() {
  // shuffle particles, then assign alternately to pairs as side +1 / -1
  const order = [...particles.keys()];
  shuffleArray(order);

  for (let i = 0; i < order.length; i += 2) {
    const pA = particles[order[i]];
    const pB = particles[order[i + 1]];
    const idx = floor(i / 2); // pair index

    // if pairs array is too small (can happen if count changed), fix it
    if (!pairs[idx]) pairs[idx] = new Pair(random(width), random(height));

    pA.pairIndex = idx; pA.side = 1;
    pB.pairIndex = idx; pB.side = -1;

    // give them slightly different radii/phase so it feels organic
    pA.radius = random(22, 58);
    pB.radius = random(22, 58);
    pA.offset = random(TWO_PI);
    pB.offset = random(TWO_PI);
  }
}

function rePair() {
  // keep old pair pivots drifting, but randomize who pairs with whom
  // (optionally jitter pivots a bit so the scene reflows)
  for (let pr of pairs) {
    pr.x += random(-10, 10);
    pr.y += random(-10, 10);
    pr.baseAngle += random(-0.5, 0.5);
  }
  assignPartners();
}

/* ---------- Drawing a star ---------- */
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

/* ---------- Utilities ---------- */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
