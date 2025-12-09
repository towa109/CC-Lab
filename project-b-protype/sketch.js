
let img;
let tiles = [];
let tileSize = 5;
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

  
  if (!assembled) {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].resetScatterTarget();
    }
  } else {
    
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].orbitRadius = random(10, 40);
    }
  }
}


// PixelPiece Class

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

    // ✨ extra motion parameters
    this.angle = random(TWO_PI);          // for spiral / rotation
    this.orbitRadius = random(10, 40);    // how big the spiral is at start
    this.noiseOffset = random(1000);      // perlin noise seed
    this.vx = random(-0.5, 0.5);          // drift speed in scatter mode
    this.vy = random(-0.5, 0.5);          // drift speed in scatter mode
    this.spinSpeed = random(-0.08, 0.08); // rotation speed
  }

  update(assembleMode) {
    let targetX, targetY, easeAmount;

    if (assembleMode) {
      
      this.angle += this.spinSpeed;
      
      this.orbitRadius = lerp(this.orbitRadius, 0, 0.05);

      let offsetX = cos(this.angle) * this.orbitRadius;
      let offsetY = sin(this.angle) * this.orbitRadius;

      targetX = this.homeX + offsetX;
      targetY = this.homeY + offsetY;

      easeAmount = 0.2; 
    } else {
      
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
