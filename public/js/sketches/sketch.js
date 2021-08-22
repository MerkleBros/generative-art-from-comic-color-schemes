import "../p5.js";
import colors from "../../colors.js";

// All sketches assume there are up to 10 colors available to choose from

// TODO: Kandisnky Circles in a circle 1923 sketch with comic book colors
// https://www.wassilykandinsky.net/work-247.php
const COLORS_ARRAY = colors["../../data/images/default-redlands.png"]["10"];

/**
 * Fill the screen with randomly sized and placed color circles
 */
let init = (sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
    COLORS_ARRAY.forEach((c, i) => {
      if (i === 1) {
        sketch.background(sketch.color(c["red"], c["green"], c["blue"]));
      } else {
        for (let i = 0; i < 5; i++) {
          const x = sketch.random(0, window.innerWidth);
          const y = sketch.random(0, window.innerHeight);
          const diameter = sketch.random(10, window.innerHeight * 0.6);
          const strokeColor = sketch.color(c["red"], c["green"], c["blue"]);
          sketch.strokeWeight(5);
          sketch.stroke(strokeColor);
          sketch.fill(strokeColor);
          sketch.circle(x, y, diameter);
        }
      }
    });
  };

  sketch.draw = () => {};
};

/**
 * A p5js ring created by overlapping two circles
 * @constructor
 * @param {Number} x, y, outerRadius, innerRadius
 * @param {p5.color} innerColor, outerColor colors of inner/outer circle
 * @param {p5} sketch
 */
function Ring({
  x,
  y,
  outerRadius,
  innerRadius,
  innerColor = null,
  outerColor,
  strokeWeight = 40,
  width = null,
  height = null,
  sketch,
}) {
  this.x = x;
  this.y = y;
  this.innerRadius = innerRadius;
  this.outerRadius = outerRadius;
  this.innerColor = innerColor;
  this.outerColor = outerColor;
  this.strokeWeight = strokeWeight;
  this.width = width;
  this.height = height;

  this.draw = function () {
    sketch.strokeWeight(strokeWeight);
    sketch.stroke(outerColor);
    if (innerColor !== null) {
      sketch.fill(innerColor);
    } else {
      sketch.fill(sketch.color(0, 0, 0, 0));
    }
    if (width !== null && height !== null) {
      sketch.ellipse(this.x, this.y, this.width, this.height);
    } else {
      sketch.circle(this.x, this.y, this.outerRadius);
    }
    // this.innerColor ? sketch.fill(innerColor) : sketch.fill(255);
    // sketch.circle(this.x, this.y, this.innerRadius);
  };
}

// spinning circles fill
const initCircles = (s) => {
  var cr = 20;
  var smallCircleRadius = 15;
  var n = 10;
  var circles = new Array();
  var j = 0;
  var cl = true; // clockwise

  function myCircle() {
    this.x = null;
    this.y = null;
    this.r = cr;
    this.fill = false;

    this.draw = function () {
      if (this.fill) {
        s.fill(255);
      } else {
        s.fill(0);
      }
      s.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    };
  }

  s.setup = () => {
    s.createCanvas(400, 400);
    const R = (3 * cr) / 2 / s.sin((2 * s.PI) / n / 2);
    for (var i = 0; i < n; i++) {
      circles[i] = new myCircle();
      circles[i].x = s.width / 2 + s.sin(((2 * s.PI) / n) * i) * R;
      circles[i].y = s.height / 2 + s.cos(((2 * s.PI) / n) * i) * R;
    }
    for (var i = 0; i < n; i++) {
      circles[i + n] = new myCircle();
      circles[i + n].r = smallCircleRadius;
      circles[i + n].x = s.width / 2 + s.sin(((2 * s.PI) / n) * i) * R;
      circles[i + n].y = s.height / 2 + s.cos(((2 * s.PI) / n) * i) * R;
    }
    s.frameRate(10);
  };
  s.draw = () => {
    s.background(220);
    circles[j].fill = false;

    if (!cl) {
      if (++j >= 10) {
        j %= 10;
      }
    } else {
      if (--j < 0) {
        j = 9;
      }
    }
    circles[j].fill = true;
    for (var i = 0; i < n; i++) {
      circles[i].draw();
      circles[i + n].draw();
    }
  };
};

const initRings = (s) => {
  const CANVAS_WIDTH = (1740 / 1799) * 900;
  const CANVAS_HEIGHT = (1799 / 1799) * 900;

  const STROKE_WEIGHT = 1;
  const CIRCLE_START_RADIUS = 100;
  const CIRCLE_INNER_RADIUS = 150;
  const CIRCLE_RADIUS_INCREASE = 70;

  const ITERATIONS = 7;

  const CIRCLE_X_OFFSET = 300;
  const CIRCLE_Y_OFFSET = 300;

  const index = Math.floor(Math.random() * (COLORS_ARRAY.length - 1));
  const bgArr = COLORS_ARRAY[index];
  const BACKGROUND_COLOR = s.color(bgArr["red"], bgArr["green"], bgArr["blue"]);

  const rings = [];
  s.setup = () => {
    s.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    s.background(BACKGROUND_COLOR);

    for (let i = 0; i < ITERATIONS; i++) {
      COLORS_ARRAY.forEach((c, i) => {
        const ring = new Ring({
          x: s.random(CIRCLE_X_OFFSET, CANVAS_WIDTH - CIRCLE_X_OFFSET),
          y: s.random(CIRCLE_Y_OFFSET, CANVAS_HEIGHT - CIRCLE_Y_OFFSET),
          outerRadius: CIRCLE_START_RADIUS + i * CIRCLE_RADIUS_INCREASE,
          innerRadius: CIRCLE_INNER_RADIUS,
          outerColor: s.color(c["red"], c["green"], c["blue"]),
          strokeWeight: STROKE_WEIGHT,
          sketch: s,
        });
        rings.push(ring);
      });
    }
  };
  s.draw = () => {
    rings.forEach((r) => r.draw());
  };
};

const initKandinsky = (s) => {
  const CANVAS_WIDTH = (1740 / 1799) * 900;
  const CANVAS_HEIGHT = (1799 / 1799) * 900;

  const RING_RADIUS = 0.8 * CANVAS_WIDTH;
  const RING_X_OFFSET = 0.01 * CANVAS_WIDTH;
  const RING_Y_OFFSET = 0.01 * CANVAS_HEIGHT;

  const STROKE_WEIGHT = 40;

  const BACKGROUND_COLOR = s.color(238, 220, 208, 255);
  const LINE_ONE_COLOR = s.color(255, 160, 0, 90);
  const LINE_TWO_COLOR = s.color(0, 100, 100, 130);

  const shapes = [];
  s.setup = () => {
    s.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    s.background(BACKGROUND_COLOR);

    const ring = new Ring({
      x: s.random(
        CANVAS_WIDTH / 2 - RING_X_OFFSET,
        CANVAS_WIDTH / 2 + RING_X_OFFSET
      ),
      y: s.random(
        CANVAS_HEIGHT / 2 - RING_Y_OFFSET,
        CANVAS_HEIGHT / 2 + RING_Y_OFFSET
      ),
      outerRadius: RING_RADIUS,
      outerColor: s.color(0),
      strokeWeight: STROKE_WEIGHT,
      width: CANVAS_WIDTH * 0.85,
      height: CANVAS_HEIGHT * 0.86,
      sketch: s,
    });
    // const ring = s.ellipse(
    //   CANVAS_WIDTH / 2,
    //   CANVAS_HEIGHT / 2,
    //   0.8 * CANVAS_WIDTH,
    //   0.8 * CANVAS_HEIGHT
    // );
    shapes.push(ring);

    s.fill(LINE_ONE_COLOR);
    s.strokeWeight(0);
    const lineOne = s.quad(
      -50,
      CANVAS_HEIGHT - 200,
      CANVAS_WIDTH - 20,
      -30,
      CANVAS_WIDTH + 10,
      0,
      0,
      CANVAS_HEIGHT + 40
    );

    s.fill(LINE_TWO_COLOR);
    s.strokeWeight(1);
    const lineTwo = s.quad(
      150,
      0,
      275,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT - 380,
      CANVAS_WIDTH,
      CANVAS_HEIGHT - 20
    );
  };
  s.draw = () => {
    shapes.forEach((s) => s.draw());
  };
};

const initKandinskyReference = (s) => {
  const CANVAS_WIDTH = (1740 / 1799) * 900;
  const CANVAS_HEIGHT = (1799 / 1799) * 900;

  s.setup = () => {
    s.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    s.background(0);
    s.loadImage("./Wassily_Kandisnky_Circles_in_a_Circle_1923.jpeg", (img) => {
      img.resize(CANVAS_WIDTH, 0);
      s.image(img, 0, 0);
    });
  };
  s.draw = () => {};
};

const getRandomColorFromColorsArray = (array, sketch) => {
  const i = Math.floor(Math.random() * (array.length - 1));
  const element = array[i];
  return sketch.color(element["red"], element["green"], element["blue"]);
};

const gaussianLines = (s) => {
  const BACKGROUND_COLOR = getRandomColorFromColorsArray(COLORS_ARRAY, s);
  const FOREGROUND_COLOR = getRandomColorFromColorsArray(COLORS_ARRAY, s);
  const X_STANDARD_DEVIATION = 600;
  const Y_STANDARD_DEVIATION = 300;
  const ITERATIONS = 400;

  const lines = [];
  s.setup = () => {
    s.createCanvas(window.innerWidth, window.innerHeight);
    s.background(BACKGROUND_COLOR);
    s.fill(FOREGROUND_COLOR);
    s.strokeWeight(0);
    s.rect(0, s.height / 2, s.width, s.height);
    const mean = s.width / 2;
    for (let i = 0; i < ITERATIONS; i++) {
      let x = s.randomGaussian();
      x = x * X_STANDARD_DEVIATION + mean; // Scale the gaussian

      let y = s.randomGaussian();
      const yMean = s.height / 2;
      y = y * Y_STANDARD_DEVIATION + yMean;

      if (y > s.height / 2) {
        // flip all vertical lines above horizon
        let d = y - s.height / 2;
        y = y - 2 * d;
      }

      s.strokeWeight(20);
      s.stroke(getRandomColorFromColorsArray(COLORS_ARRAY, s));
      s.strokeCap(s.SQUARE);
      const line = s.line(x, s.height / 2, x, y);
      lines.push(line);
    }
  };
  s.draw = () => {
    s.fill(255, 0, 0);
    lines[lines.length - 1].draw();
  };
};

const eArt = (s) => {
  const BACKGROUND_COLOR = getRandomColorFromColorsArray(COLORS_ARRAY, s);
  const FOREGROUND_COLOR = getRandomColorFromColorsArray(COLORS_ARRAY, s);
  const X_STANDARD_DEVIATION = 130;
  const Y_STANDARD_DEVIATION = 100;
  const ITERATIONS = 20000;

  const lines = [];
  s.setup = () => {
    s.createCanvas(window.innerWidth, window.innerHeight);
    s.background(BACKGROUND_COLOR);
    s.fill(FOREGROUND_COLOR);
    s.strokeWeight(4);
    s.textSize(20);
    const mean = s.width / 2;
    for (let i = 0; i < ITERATIONS; i++) {
      let x = s.randomGaussian();
      x = x * X_STANDARD_DEVIATION + mean; // Scale the gaussian

      let y = s.randomGaussian();
      const yMean = s.height / 2;
      y = y * Y_STANDARD_DEVIATION + yMean;

      // if (y > s.height / 2) {
      //   // flip all vertical lines above horizon
      //   let d = y - s.height / 2;
      //   y = y - 2 * d;
      // }
      // y = y - 10;

      s.fill(getRandomColorFromColorsArray(COLORS_ARRAY, s));
      s.strokeWeight(20);
      s.stroke(getRandomColorFromColorsArray(COLORS_ARRAY, s));
      s.text("e", x, y);
    }
  };
  s.draw = () => {};
};

// const project = new p5(init);
// const project = new p5(initCircles);
// const project = new p5(initRings);
// const kandinsky = new p5(initKandinsky);
// const kandinskyReference = new p5(initKandinskyReference);
// const rg = new p5(gaussianLines);
const eProject = new p5(eArt);
