// =========================
//  GLOBAL VARIABLES
// =========================

// UI
let mySelect;

// mode
let mode = "home";

// images
let imgSpring, imgSummer, imgFall, imgWinter;
let currentImg;
let tiles = [];
let tileSize = 8;   // ⭐ Larger = smoother performance
let assembled = true;
let clickCount = 0;

// center offset (after resizing)
let photoXOffset;
let photoYOffset;


// =========================
//  preload images
// =========================
function preload() {
  imgSpring = loadImage("DSC04190.jpg");
  imgSummer = loadImage("DSC04033.jpg");
  imgFall   = loadImage("DSC04626-Enhanced-NR.jpg");
  imgWinter = loadImage("DSC_7239.jpg");
}


// =========================
//  setup
// =========================
function setup() {
  createCanvas(800, 450);

  mySelect = createSelect();
  mySelect.option("spring");
  mySelect.option("summer");
  mySelect.option("fall");
  mySelect.option("winter");

  // selecting instantly starts
  mySelect.changed(startPixelMode);
}


// =========================
//  draw
// =========================
function draw() {
  if (mode === "home") {
    drawHomeScreen();
  } else {
    drawPixelScreen();
  }
}


// =========================
//  HOME SCREEN
// =========================
function drawHomeScreen() {
  background(235);

  textAlign(CENTER);
  fill(0);

  textSize(26);
  text("Select a season to begin", width/2, height/2 + 70);

  textSize(16);
  text("Picture appears instantly", width/2, height/2 + 100);

  // place selector under the picture area
  mySelect.position(width/2 - 50, height/2 + 140);
}


// =========================
//  start triggered by selecting season
// =========================
function startPixelMode() {
  let season = mySelect.value();

  if (season === "spring") currentImg = imgSpring;
  else if (season === "summer") currentImg = imgSummer;
  else if (season === "fall")   currentImg = imgFall;
  else currentImg = imgWinter;

  // ⭐ resize small → HUGE performance gain
  currentImg.resize(800, 450);
  currentImg.loadPixels();

  buildTiles();

  assembled = true;
  clickCount = 0;
  mode = "pixels";

  mySelect.hide();
}


// =========================
//  BUILD PIXELS
// =========================
function buildTiles() {
  tiles = [];

  // ⭐ center offset (now always fits canvas)
  photoXOffset = 0;
  photoYOffset = 0;

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {

      let c = currentImg.get(x, y);
      let p = new PixelPiece(x, y, c);
      tiles.push(p);
    }
  }
}


// =========================
//  PIXEL SCREEN
// =========================
function drawPixelScreen() {
  background(10);

  for (let p of tiles) {
    p.update(assembled);
    p.display(tileSize);
  }

  fill(255);
  textAlign(CENTER);
  textSize(14);

  if (clickCount < 3) {
    text(assembled ? "click = scatter" : "click = assemble", width/2, height - 20);
    text("3rd click = back to home", width/2, height - 5);
  }
}


// =========================
//  CLICK LOGIC
// =========================
function mousePressed() {
  if (mode !== "pixels") return;

  clickCount++;

  if (clickCount < 3) {
    assembled = !assembled;

    if (!assembled) {
      for (let p of tiles) p.resetScatterTarget();
    }

  } else {
    mode = "home";
    tiles = [];
    mySelect.show();
  }
}


// =========================
//  PixelPiece CLASS
// =========================
class PixelPiece {
  constructor(homeX, homeY, col) {
    this.homeX = homeX;
    this.homeY = homeY;

    this.x = homeX;
    this.y = homeY;

    this.col = col;

    this.scatterX = random(width);
    this.scatterY = random(height);

    this.vx = random(-0.6, 0.6);
    this.vy = random(-0.6, 0.6);
  }

  update(assembleMode) {
    let targetX, targetY;

    if (assembleMode) {
      targetX = this.homeX;
      targetY = this.homeY;
    } else {
      this.scatterX += this.vx;
      this.scatterY += this.vy;

      targetX = this.scatterX;
      targetY = this.scatterY;
    }

    // ⭐ smooth movement (no jitter)
    this.x += (targetX - this.x) * 0.1;
    this.y += (targetY - this.y) * 0.1;
  }

  resetScatterTarget() {
    this.scatterX = random(width);
    this.scatterY = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
  }

  display(size) {
    noStroke();
    fill(this.col);
    rect(this.x, this.y, size, size);
  }
}
