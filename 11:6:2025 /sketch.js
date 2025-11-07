let fireworks = []
let num = 30

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  for (i = 0 ; i < num ; i++){
    fireworks.push ( new Firework (width/2, height/2))
  }
  console.log (fireworks)
}

function draw() {
  background(0);
  
  for ( i= 0 ; i < fireworks. length; i++){
    fireworks [i].update()
    fireworks[i].display()
  }
  
  //add new foreworks
  if (mouseIsPressed){
    for (i=0;i<3;i++){
      fireworks.push(new Firework (mouseX, mouseY))
    }
  }

  //take out old fireworks
if(fireworks.length > 50){
  fireworks.splice (0,3)
}  

for( let i = fireworks.length -1 ; i >=0 ; i--){

  let byeFirework = fireworks[i]
  if (byeFirework.isOutside){
    fireworks.splice (i,1)
  }
}
  fill(255)
  text(fireworks. length,10,20)
}

class Firework {
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);
    this.hue = random(0, 360);
        
    this.speedX = random(-3, 3);
    this.speedY = random(-1, -3);

    this.isOutside = false 
    
  }
  update(){

    this.x+=this.speedX;
    this.y+=this.speedY;

    this.speedY +=0.4
    this.speedX+=0.99

    this.edgeDetection()
  }

  edgeDetection(){
    if (this.x > width || this.x<0 || this.y> height || this.y < 0){
      this.isOutside =true
    }
  }
  
  display(){
   
    push();
    translate(this.x, this.y);
    
      colorMode(HSB)
      fill(this.hue, 80, 100)
      noStroke();
      circle(0, 0, this.size);
    
    pop();
  }
}