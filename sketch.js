var song;

function preload() {
  song = loadSound("gtr.mp3");
  gtr = loadImage("gtr.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  song.loop();
  song.disconnect();

  dist = new p5.Distortion();
  dist.process(song, .05, "x4");
  dist.drywet(1);
  dist.disconnect();

  filter = new p5.Filter();
  filter.setType("bandpass");
  filter.process(dist, 1500, 0);
  filter.drywet(1);

  delay = new p5.Delay();
  delay.setType("pingPong");
  delay.process(filter, .3, .4, 10000);

  slider1 = createSlider(0, 1, 0, 0); //dist
  slider2 = createSlider(0, 1, 0, 0); //delay
  slider3 = createSlider(.7, 1.3, 1, 0); //tuning
  slider4 = createSlider(0, 1, .5, 0); //volume

  fft = new p5.FFT();
}

function draw() {
  background("white");

  push();
  let waveform = fft.waveform();
  noFill();
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (var i = 0; i < waveform.length; i+=5){
    let x = map(i, 0, waveform.length, -width*0.1, width*1.1);
    let y = map(waveform[i], -2, 2, 0, 650);
    curveVertex(x, y);
  }
  endShape();
  pop();

  imageMode(CENTER);
  image(gtr, width/3.5, 0, 1200, 1200);

  slider1.position(width*.6, 150-50);
  slider2.position(width*.6, 250-50);
  slider3.position(width*.6, 350+80);
  slider4.position(width*.6, 450+80);

  textSize(22);
  textStyle(BOLD);
  text("Distortion", width*.6, 150-10-50);
  text("Echo", width*.6, 250-10-50);
  text("Tuning", width*.6, 350-10+80);
  text("Volume", width*.6, 450-10+80);

  let val1 = slider1.value();
  let val2 = slider2.value();
  let val3 = slider3.value();
  let val4 = slider4.value();

  dist.drywet(val1);
  filter.drywet(val1 + .5);
  delay.drywet(val2);
  song.rate(val3);
  song.amp(val4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
