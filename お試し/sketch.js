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
let tileSize = 8;
let assembled = true;
let clickCount = 0;

// center offsets
let offsetX = 0;
let offsetY = 0;


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
  // ⭐ create canvas and put it inside the HTML div
  let cnv = createCanvas(800, 450);
  cnv.parent("p5-canvas-container");

  mySelect = createSelect();
  mySelect.option("spring");
  mySelect.option("summer");
  mySelect.option("fall");
  mySelect.option("winter");

  // when season is selected, instantly show the picture
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

  // move text lower so it doesn't overlap the future image area
  textSize(26);
  text("Select a season to begin", width / 2, height / 2 + 70);

  textSize(16);
  text("Picture will appear instantly", width / 2, height / 2 + 100);

  // put the dropdown UNDER the picture area (centered horizontally)
  let uiX = width / 2 - 50;
  let uiY = height / 2 + 140;
  mySelect.position(uiX, uiY);
}


// =========================
//  START PIXEL MODE
// =========================
function startPixelMode() {
  let season = mySelect.value();

  if (season === "spring") currentImg = imgSpring;
  else if (season === "summer") currentImg = imgSummer;
  else if (season === "fall")   currentImg = imgFall;
  else currentImg = imgWinter;

  // resize image smaller & consistent for performance and centering
  currentImg.resize(600, 338); // 16:9-ish, fits nicely
  currentImg.loadPixels();

  buildTilesForCenteredImage();

  assembled = true;
  clickCount = 0;
  mode = "pixels";

  mySelect.hide();
}


// =========================
//  BUILD PIXELS CENTERED
// =========================
function buildTilesForCenteredImage() {
  tiles = [];

  // calculate the offset so the image is centered in the canvas
  offsetX = (width  - currentImg.width)  / 2;
  offsetY = (height - currentImg.height) / 2;

  for (let y = 0; y < currentImg.height; y += tileSize) {
    for (let x = 0; x < currentImg.width; x += tileSize) {
      let c = currentImg.get(x, y);
      let p = new PixelPiece(x + offsetX, y + offsetY, c);
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
    text(assembled ? "click = scatter" : "click = assemble", width / 2, height - 20);
    text("3rd click = back to home", width / 2, height - 5);
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
