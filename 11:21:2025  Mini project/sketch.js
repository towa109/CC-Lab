// Pixel Photo Prototype (image → pixel → scatter/assemble)

let img;
let tiles = [];
let tileSize = 16;
let assembled = true; // start in assembled mode (photo visible)

function preload() {
  
  img = loadImage("DSC04190.jpg");
}

function setup() {
  createCanvas(800, 450);

  // resize the image to match canvas
  img.resize(width, height);
  img.loadPixels();

  // create pixel tiles
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let c = img.get(x, y);
      let p = new PixelPiece(x, y, c);
      tiles.push(p);
    }
  }

  // start exactly in the correct photo position
  for (let t of tiles) {
    t.x = t.homeX;
    t.y = t.homeY;
  }
}

function draw() {
  background(10);

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].update(assembled);
    tiles[i].display(tileSize);
  }

  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  if (assembled) {
    text("click = scatter pixels", width / 2, height - 10);
  } else {
    text("click = assemble pixels", width / 2, height - 10);
  }
}

function mousePressed() {
  assembled = !assembled;

  // when switching to scatter mode, assign new random positions
  if (!assembled) {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].resetScatterTarget();
    }
  }
}


class PixelPiece {
  constructor(homeX, homeY, col) {
    this.homeX = homeX;
    this.homeY = homeY;

    // start at home position
    this.x = homeX;
    this.y = homeY;

    this.col = col;

    // scatter target
    this.scatterX = random(width);
    this.scatterY = random(height);
  }

  update(assembleMode) {
    let targetX, targetY, easeAmount;

    if (assembleMode) {
      targetX = this.homeX;
      targetY = this.homeY;
      easeAmount = 0.18; // fast assemble
    } else {
      targetX = this.scatterX;
      targetY = this.scatterY;
      easeAmount = 0.06; // slow scatter
    }

    this.x += (targetX - this.x) * easeAmount;
    this.y += (targetY - this.y) * easeAmount;
  }

  resetScatterTarget() {
    this.scatterX = random(width);
    this.scatterY = random(height);
  }

  display(size) {
    noStroke();
    fill(this.col);
    rect(this.x, this.y, size, size);
  }
}
