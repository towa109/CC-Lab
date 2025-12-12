let myInput;
let button;
let mySelect;
let displayText = "";


let mode = "home"; // "home" or "pixels"

// pic
let imgSpring, imgSummer, imgFall, imgWinter;
let currentImg;
let tiles = [];
let tileSize = 8;
let assembled = true; // true = 集合, false = 散乱
let clickCount = 0;   


function preload() {
  
  imgSpring = loadImage("DSC04190.jpg");              // 桜の川
  imgWinter = loadImage("DSC04033.jpg");              // 緑の日本家屋
  imgFall   = loadImage("DSC04626-Enhanced-NR.jpg");  // 室内（猫）
  imgSummer = loadImage("IMG_4982.JPG");              // 雪の日本家屋
}

function setup() {
  createCanvas(800, 450);

  myInput = createInput();
  myInput.position(40, 350);

  button = createButton('start');
  button.position(190, 350);
  button.mousePressed(startPixelMode); // push botton to pixel

  mySelect = createSelect();
  mySelect.position(320, 350);
  mySelect.option('spring');
  mySelect.option('summer');
  mySelect.option('fall');
  mySelect.option('winter');
}


function draw() {
  if (mode === "home") {
    drawHomeScreen();
  } else if (mode === "pixels") {
    drawPixelScreen();
  }
}


function drawHomeScreen() {
 
  let season = mySelect.value();
  if (season === 'spring') background(255, 220, 230);
  else if (season === 'summer') background(210, 255, 220);
  else if (season === 'fall')   background(255, 235, 210);
  else if (season === 'winter') background(220, 235, 255);
  else background(240);

  fill(0);
  textSize(15);
  textAlign(LEFT);
  text("Choose!", 20, 50);

  textSize(16);
  text(displayText, 25, 75);
}


function startPixelMode() {
  
  displayText = myInput.value();

  let season = mySelect.value();
  if (season === 'spring') currentImg = imgSpring;
  else if (season === 'summer') currentImg = imgSummer;
  else if (season === 'fall')   currentImg = imgFall;
  else if (season === 'winter') currentImg = imgWinter;
  else currentImg = imgSpring;

  // 画像からタイル
  buildTilesForImage(currentImg);

  // リセット
  assembled = true;
  clickCount = 0;
  mode = "pixels";

  myInput.hide();
  button.hide();
  mySelect.hide();
}


//make tiles from pic
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
  for (let t of tiles) {
    t.x = t.homeX;
    t.y = t.homeY;
  }
}


function drawPixelScreen() {
  background(10);

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].update(assembled);
    tiles[i].display(tileSize);
  }

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

  textAlign(LEFT);
  textSize(16);
  text(displayText, 20, 30);
}

function mousePressed() {
  if (mode !== "pixels") return;

  clickCount++;

  if (clickCount < 3) {
    // 散乱 / 集合 
    assembled = !assembled;

    if (!assembled) {
      // 散らばる
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].resetScatterTarget();
      }
    } else {
      // 集合
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].orbitRadius = random(10, 40);
      }
    }
  } else {
    mode = "home";
    tiles = [];
    assembled = true;

    myInput.show();
    button.show();
    mySelect.show();
  }
}

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
