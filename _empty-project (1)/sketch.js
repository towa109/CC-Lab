// =========================
//  グローバル変数
// =========================

// UI
let myInput;
let button;
let mySelect;
let displayText = "";

// モード管理
let mode = "home"; // "home" or "pixels"

// 画像 & ピクセル
let imgSpring, imgSummer, imgFall, imgWinter;
let currentImg;
let tiles = [];
let tileSize = 8;
let assembled = true; // true = 集合, false = 散乱
let clickCount = 0;   // ピクセル画面でのクリック回数


// =========================
//  画像読み込み
// =========================
function preload() {
  // ファイル名はプロジェクトと同じフォルダに置いておく
  imgSpring = loadImage("DSC04190.jpg");              // 桜の川
  imgSummer = loadImage("DSC04033.jpg");              // 緑の日本家屋
  imgFall   = loadImage("DSC04626-Enhanced-NR.jpg");  // 室内（猫）
  imgWinter = loadImage("IMG_4982.JPG");              // 雪の日本家屋
}


// =========================
//  setup
// =========================
function setup() {
  createCanvas(800, 450);

  // ---- ホーム画面 UI ----
  myInput = createInput();
  myInput.position(20, 100);

  button = createButton('start');
  button.position(170, 300);
  button.mousePressed(startPixelMode); // ボタン押したらピクセルモードへ

  mySelect = createSelect();
  mySelect.position(300, 300);
  mySelect.option('spring');
  mySelect.option('summer');
  mySelect.option('fall');
  mySelect.option('winter');
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
//  ホーム画面の描画
// =========================
function drawHomeScreen() {
  // 季節で背景色ちょっと変える
  let season = mySelect.value();
  if (season === 'spring') background(255, 220, 230);
  else if (season === 'summer') background(210, 255, 220);
  else if (season === 'fall')   background(255, 235, 210);
  else if (season === 'winter') background(220, 235, 255);
  else background(240);

  fill(0);
  textSize(20);
  textAlign(LEFT);
  text("Type something and choose a season!", 20, 50);

  textSize(16);
  text(displayText, 25, 75);
}


// =========================
//  ボタンが押されたとき
// =========================
function startPixelMode() {
  // 入力テキストを覚えておく
  displayText = myInput.value();

  // 選んだ季節から画像を決める
  let season = mySelect.value();
  if (season === 'spring') currentImg = imgSpring;
  else if (season === 'summer') currentImg = imgSummer;
  else if (season === 'fall')   currentImg = imgFall;
  else if (season === 'winter') currentImg = imgWinter;
  else currentImg = imgSpring;

  // 画像からタイルを作成
  buildTilesForImage(currentImg);

  // 状態リセット
  assembled = true;
  clickCount = 0;
  mode = "pixels";

  // UI を隠す
  myInput.hide();
  button.hide();
  mySelect.hide();
}


// 指定した画像から tiles を作る
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

  // 最初は写真どおり
  for (let t of tiles) {
    t.x = t.homeX;
    t.y = t.homeY;
  }
}


// =========================
//  ピクセル画面の描画
// =========================
function drawPixelScreen() {
  background(10);

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].update(assembled);
    tiles[i].display(tileSize);
  }

  // 下の説明テキスト
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(14);

  if (clickCount < 3) {
    if (assembled) {
      text("click = scatter pixels", width / 2, height - 20);
    } else {
      text("click = assemble pixels", width / 2, height - 20);
    }
    text("3rd click = back to home", width / 2, height - 5);
  }

  // 上に入力テキストも表示
  textAlign(LEFT);
  textSize(16);
  text(displayText, 20, 30);
}


// =========================
//  マウスクリック
// =========================
function mousePressed() {
  if (mode !== "pixels") return;

  clickCount++;

  if (clickCount < 3) {
    // 1回目・2回目 → 散乱 / 集合 トグル
    assembled = !assembled;

    if (!assembled) {
      // 散らばるモード
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].resetScatterTarget();
      }
    } else {
      // 集合モード
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].orbitRadius = random(10, 40);
      }
    }
  } else {
    // 3回目 → ホーム画面へ戻る
    mode = "home";
    tiles = [];
    assembled = true;

    // UI を再表示
    myInput.show();
    button.show();
    mySelect.show();
  }
}


// =========================
//  PixelPiece クラス
// =========================
class PixelPiece {
  constructor(homeX, homeY, col) {
    this.homeX = homeX;
    this.homeY = homeY;

    this.x = homeX;
    this.y = homeY;

    this.col = col;

    // scatter 用ターゲット
    this.scatterX = random(width);
    this.scatterY = random(height);

    // 動きパラメータ
    this.angle = random(TWO_PI);
    this.orbitRadius = random(10, 40);
    this.noiseOffset = random(1000);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.spinSpeed = random(-0.08, 0.08);
  }

  update(assembleMode) {
    let targetX, targetY, easeAmount;

    if (assembleMode) {
      // 集合モード：くるくるしながら home に戻る
      this.angle += this.spinSpeed;
      this.orbitRadius = lerp(this.orbitRadius, 0, 0.05);

      let offsetX = cos(this.angle) * this.orbitRadius;
      let offsetY = sin(this.angle) * this.orbitRadius;

      targetX = this.homeX + offsetX;
      targetY = this.homeY + offsetY;
      easeAmount = 0.2;
    } else {
      // 散乱モード
      this.scatterX += this.vx;
      this.scatterY += this.vy;

      if (this.scatterX < -100 || this.scatterX > width + 100) {
        this.vx *= -1;
      }
      if (this.scatterY < -100 || this.scatterY > height + 100) {
        this.vy *= -1;
      }

      this.noiseOffset += 0.01;
      let wobbleX = map(noise(this.noiseOffset), 0, 1, -20, 20);
      let wobbleY = map(noise(this.noiseOffset + 1000), 0, 1, -20, 20);

      targetX = this.scatterX + wobbleX;
      targetY = this.scatterY + wobbleY;
      easeAmount = 0.08;
    }

    this.x += (targetX - this.x) * easeAmount;
    this.y += (targetY - this.y) * easeAmount;
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
