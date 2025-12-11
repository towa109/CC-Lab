let img1;
let img2;
let tiles = [];
let tileSize = 5;
let assembled = true;      // true = 集合してる, false = 散ってる
let currentImageIndex = 0; // 0 = img1, 1 = img2

function preload() {
  // ★ ここのファイル名は自分の画像に合わせて変えてね
  img1 = loadImage("DSC04190.jpg");   // 最初の写真
  img2 = loadImage("DSC_7239.jpg");        // 変身後の写真
}

function setup() {
  createCanvas(800, 450);

  // 両方の画像をキャンバスサイズに合わせる
  img1.resize(width, height);
  img2.resize(width, height);
  img1.loadPixels();
  img2.loadPixels();

  // ピクセルタイルを作成
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let c1 = img1.get(x, y); // 1枚目の色
      let c2 = img2.get(x, y); // 2枚目の色
      let p = new PixelPiece(x, y, c1, c2);
      tiles.push(p);
    }
  }

  // 最初はホーム位置にそろえる
  resetTilesToHome();
}

// tiles 全部を home 位置に戻す
function resetTilesToHome() {
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].x = tiles[i].homeX;
    tiles[i].y = tiles[i].homeY;
  }
}

function draw() {
  background(10);

  // ピクセル更新＆表示
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].update(assembled);
    tiles[i].display(tileSize, currentImageIndex);
  }

  // 下の説明テキスト
  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  if (assembled) {
    text("click = scatter pixels", width / 2, height - 10);
  } else {
    text("click = assemble pixels (will form the OTHER picture)", width / 2, height - 10);
  }
}

function mousePressed() {
  // true/false 切り替え
  assembled = !assembled;

  if (!assembled) {
    // ⇨ scatter モードに入るとき
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].resetScatterTarget();
    }
  } else {
    // ⇨ assemble モードに戻るとき
    // ここで画像を切り替え（0 ⇄ 1）
    currentImageIndex = 1 - currentImageIndex;

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].orbitRadius = random(10, 40);
    }
  }
}

// PixelPiece Class
class PixelPiece {
  constructor(homeX, homeY, col1, col2) {
    this.homeX = homeX;
    this.homeY = homeY;

    // 現在位置（最初はhome）
    this.x = homeX;
    this.y = homeY;

    // 2枚分の色を持たせる
    this.col1 = col1;
    this.col2 = col2;

    // scatter target
    this.scatterX = random(width);
    this.scatterY = random(height);

    // extra motion parameters
    this.angle = random(TWO_PI);          // 回転用角度
    this.orbitRadius = random(10, 40);    // 集合時のぐるぐる半径
    this.noiseOffset = random(1000);      // パーリンノイズ用
    this.vx = random(-0.5, 0.5);          // scatterモードのドリフト速度
    this.vy = random(-0.5, 0.5);
    this.spinSpeed = random(-0.08, 0.08); // 回転スピード
  }

  update(assembleMode) {
    let targetX, targetY, easeAmount;

    if (assembleMode) {
      // assemble モード：くるくるしながら home に近づく
      this.angle += this.spinSpeed;
      this.orbitRadius = lerp(this.orbitRadius, 0, 0.05);

      let offsetX = cos(this.angle) * this.orbitRadius;
      let offsetY = sin(this.angle) * this.orbitRadius;

      targetX = this.homeX + offsetX;
      targetY = this.homeY + offsetY;

      easeAmount = 0.2;
    } else {
      // scatter モード
      this.scatterX += this.vx;
      this.scatterY += this.vy;

      // ある程度外に出たら向き反転
      if (this.scatterX < -100 || this.scatterX > width + 100) {
        this.vx *= -1;
      }
      if (this.scatterY < -100 || this.scatterY > height + 100) {
        this.vy *= -1;
      }

      // ノイズでゆらゆら
      this.noiseOffset += 0.01;
      let wobbleX = map(noise(this.noiseOffset), 0, 1, -20, 20);
      let wobbleY = map(noise(this.noiseOffset + 1000), 0, 1, -20, 20);

      targetX = this.scatterX + wobbleX;
      targetY = this.scatterY + wobbleY;

      easeAmount = 0.08;
    }

    // イージング移動
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

  // imageIndex: 0なら1枚目, 1なら2枚目
  display(size, imageIndex) {
    noStroke();
    if (imageIndex === 0) {
      fill(this.col1);
    } else {
      fill(this.col2);
    }
    rect(this.x, this.y, size, size);
  }
}
