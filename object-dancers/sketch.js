/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new TowakoDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class TowakoDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    this.t = 0;                       
    this.bodyColor = color(188,239,247); 
    this.accentColor = color(245,74,12); 
    //..
    //..
    //..
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour

    if(frameCount % 100 == 0)
      console.log ("frame!")
    this.t += 0.05;

    
    this.floatY = sin(this.t * 2.0) * 6;

    this.swingX = sin(this.t * 1.4) * 4;

    this.wingDeg = sin(this.t * 3.5) * 15;
  
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x + this.swingX, this.y + this.floatY);
    // ******** //
    // ⬇️ draw your dancer from here ⬇️
      noStroke()
      
      fill(this.bodyColor);
      ellipse(0, 30, 80, 170); 
      circle(0, -50, 85);
      
      push();
      rotate(radians(this.wingDeg));
      ellipse(40, -10, 145, 30);
      pop();

      
      push();
      rotate(radians(-this.wingDeg));
      ellipse(-40, -10, 145, 30); 
      pop();

      
      triangle(-10,-70, 40,-70, 30,-110);
      triangle( 10,-70,-40,-70,-30,-110);

      
      fill(this.accentColor);
      circle(0, -40, 40);
      ellipse(0, 10, 40, 80);

      
      this.drawReferenceShapes();
      pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/