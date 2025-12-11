// =========================
//  グローバル変数
// =========================

// UI
let button;
let mySelect;

// モード管理
let mode = "home"; // "home" or "pixels"

// 画像 & ピクセル
let imgSpring, imgSummer, imgFall, imgWinter;
let currentImg;
let tiles = [];
let tileSize = 5;
let assembled = true; 
let clickCount = 0;


// =========================
//  画像読み込み
// =========================
function preload() {
  imgSpring = loadImage("DSC04190.jpg");              // 桜
  imgSummer = loadImage("DSC04033.jpg");              // 夏の家
  imgFall   = loadImage("DSC04626-Enhanced-NR.jpg");  // 室内猫
  imgWinter = loadImage("DSC_7239.jpg");              // 雪の家
}


// =========================
//  setup
// =========================
function setup() {
  createCanvas(800, 450);

  // ---- ホーム UI ----
  mySelect = createSelect();
  mySelect.option('spring');
  mySelect.option('summer');
  mySelect.option('fall');
  mySelect.option('winter');

  button = createButton('start');
  button.mousePressed(startPixelMode);
}


// =========================
//  draw
// =========================
function draw() {
  if (mode === "home") {
    drawHomeScreen();
  } else if (mode === "pixels") {
    drawPixelScreen();
  }
}


// =========================
//  ホーム画面
// =========================
function drawHomeScreen() {
  background(235);

  textAlign(CENTER);
  fill(0);
  textSize(26);
  text("Choose a season and press start", width/2, 80);

  textSize(16);
  text("Picture will appear AFTER pressing start", width/2, 110);

  // UI を写真の出る位置の「上の中央」に置く
  let uiX = width / 2 - 60;
  let uiY = 150;

  mySelect.position(uiX, uiY);
  button.position(uiX, uiY + 40);
}


// =========================
//  start button pressed
// =========================
function startPixelMode() {
  let season = mySelect.value();

  if (season === 'spring') currentImg = imgSpring;
  else if (season === 'summer') currentImg = imgSummer;
  else if (season === 'fall')   currentImg = imgFall;
  else if (season === 'winter') currentImg = imgWinter;

  buildTilesForImage(currentImg);

  assembled = true;
  clickCount = 0;
  mode = "pixels";

  // hide UI
  mySelect.hide();
  button.hide();
}


// =========================
//  タイル構築
// =========================
function buildTilesForImage(img) {
  tiles = [];

  img.resize(width, height);
  img.loadPixels();

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let c = img.get(x, y);
      let p = new PixelPiece(x, y, c);
      tiles.push(p);
    }
  }
}


// =========================
//  ピクセル描画画面
// =========================
function drawPixelScreen() {
  background(10);

  for (let p of tiles) {
    p.update(assembled);
    p.display(tileSize);
  }

  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(14);

  if (clickCount < 3) {
    if (assembled) text("click = scatter", width/2, height - 20);
    else text("click = assemble", width/2, height - 20);

    text("3rd click = back to home", width/2, height - 5);
  }
}


// =========================
//  mouse click
// =========================
function mousePressed() {
  if (mode !== "pixels") return;

  clickCount++;

  if (clickCount < 3) {
    assembled = !assembled;

    if (!assembled) {
      for (let p of tiles) p.resetScatterTarget();
    } else {
      for (let p of tiles) p.orbitRadius = random(10, 40);
    }

  } else {
    // return home
    mode = "home";
    tiles = [];

    mySelect.show();
    button.show();
  }
}


// =========================
//  PixelPiece class
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

    this.angle = random(TWO_PI);
    this.orbitRadius = random(10, 40);
    this.noiseOffset = random(1000);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.spinSpeed = random(-0.08, 0.08);
  }

  update(assembleMode) {
    let targetX, targetY, ease;

    if (assembleMode) {
      this.angle += this.spinSpeed;
      this.orbitRadius = lerp(this.orbitRadius, 0, 0.05);

      targetX = this.homeX + cos(this.angle) * this.orbitRadius;
      targetY = this.homeY + sin(this.angle) * this.orbitRadius;

      ease = 0.2;
    } else {
      this.scatterX += this.vx;
      this.scatterY += this.vy;

      if (this.scatterX < -100 || this.scatterX > width + 100) this.vx *= -1;
      if (this.scatterY < -100 || this.scatterY > height + 100) this.vy *= -1;

      this.noiseOffset += 0.01;

      targetX = this.scatterX + map(noise(this.noiseOffset), 0, 1, -20, 20);
      targetY = this.scatterY + map(noise(this.noiseOffset + 1000), 0, 1, -20, 20);

      ease = 0.08;
    }

    this.x += (targetX - this.x) * ease;
    this.y += (targetY - this.y) * ease;
  }

  resetScatterTarget() {
    this.scatterX = random(width);
    this.scatterY = random(height);
    this.vx = random(-0.8, 0.8);
    this.vy = random(-0.8, 0.8);
    this.noiseOffset = random(1000);
    this.orbitRadius = random(20, 60);
  }

  display(size) {
    noStroke();
    fill(this.col);
    rect(this.x, this.y, size, size);
  }
}
