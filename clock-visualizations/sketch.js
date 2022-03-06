/*jshint esversion: 10 */

const workerClock = new Clock();

const pallette = ["#B983FF", "#94B3FD", "#94DAFF", "#99FEFF", "#22577A", "#38A3A5", "#57CC99", "#80ED99", "#E02401", '#F78812', '#AB6D23', '#51050F'];

const width = 800;
const height = 800;
function setup() {
    createCanvas(width, height);

    frameRate(30);

    button = createButton("toggle");
    button.position(width, height - 40);
    button.mousePressed(toggleRunning);

    let inp = createInput("");
    inp.position(width, height - 20);
    inp.size(100);
    inp.input(changeTickPeriod);
}

clock = 0; // secs
clockRunning = true;
showSeconds = true;
tickValue = 1.0 / 6;

function tick() {
    if (clockRunning) clock += tickValue;
}
function toggleRunning() {
    clockRunning = !clockRunning;
    workerClock.toggleRunning();
}
function changeTickPeriod() {
    try {
        let n = parseFloat(this.value());
        if (!isNaN(n) && isFinite(n) && n > 0) tickValue = n;
    } catch (err) {
        tickValue = 1;
    }
}

function drawFace() {
    push();
    translate(width / 2, height / 2);

    fill(color("#ffffff99"));
    ellipse(0, 0, 200, 200);

    push();
    fill(color("red"));
    circle(0, 0, 10);

    pop();

    // draw minutes
    push();
    stroke(color("red"));
    for (i = 0; i < 360; i += 6) {
        push();
        if (i % 90 == 0) {
            strokeWeight(4);
        }
        u = p5.Vector.fromAngle(radians(i), 100);
        v = p5.Vector.fromAngle(radians(i), i % 30 == 0 ? 80 : 90);
        line(u.x, u.y, v.x, v.y);
        pop();
    }

    pop();
    pop();
}

function drawHandles() {
    let wc = workerClock.getValue();
    hh = Math.floor((wc / 60 / 60) % 24);
    mm = Math.floor((wc / 60) % 60);
    ss = Math.floor(wc % 60);

    push();
    translate(0, 0);
    textSize(32);
    text(`${hh}:${mm}:${ss}`, 30, 30);
    pop();

    push();
    translate(width / 2, height / 2);
    fill(color("green"));
    v = p5.Vector.fromAngle(radians(-90), 50);
    rotate(radians(hh * 30 + (mm * 30) / 60.0));
    rect(-2, 0, v.x + 4, v.y);
    pop();

    push();
    translate(width / 2, height / 2);
    fill(color("green"));
    rotate(radians(mm * 6));
    v = p5.Vector.fromAngle(radians(-90), 70);
    rect(-2, 0, v.x + 4, v.y);
    pop();

    if (showSeconds) {
        push();
        translate(width / 2, height / 2);
        fill(color(" #e6e6ff"));
        rotate(radians(ss * 6));
        v = p5.Vector.fromAngle(radians(-90), 70);
        rect(-0.2, 0, v.x + 0.4, v.y);
        pop();
    }

    let mm1 = (wc / 60.0) % 60;
    let ang = 6.0 * mm1 - (30.0 * hh + (mm1 * 1.0) / 2.0);
    let th = Math.abs(Math.abs(ang) - 90);
    if (th <= 1e-2) {
        clockRunning = false;
    }

    push();
    translate(0, 0);
    textSize(16);
    text(`${ang.toFixed(2)}°`, 30, 50);
    pop();
}

function draw90s() {
    push();
    translate(0, 0);
    textSize(14);
    let v90s = workerClock.get90s();
    let i = 0;
    v90s.forEach((e) => {
        let col = color(pallette[(i*2)%pallette.length] + '70')

        let aa = e.split(":");
        push();
        translate(width / 2, height / 2);
        hh = parseInt(aa[0]);
        mm = parseInt(aa[1]);
        ss = parseInt(aa[2]);
        ha = hh * 30.0 + mm * 0.5;
        ma = mm * 6.0;
        hav = p5.Vector.fromAngle(radians(-90 + ha), 30);
        mav = p5.Vector.fromAngle(radians(-90 + ma), 30);
        //fill(color(0, 153, 251, 102));
        stroke(color('black'))
        fill(col)
        let start = { x: 210, y: 210 };
        let offset = 10;
        if (ma > ha) {
            if (ma - ha < 100)
                arc(0, 0, start.x + i * offset, start.y + i * offset, radians(-90 + ha), radians(-90 + ma), PIE);
            else arc(0, 0, start.x + i * offset, start.y + i * offset, radians(-90 + ma), radians(-90 + ha), PIE);
        } else {
            if (ha - ma < 100)
                arc(0, 0, start.x + i * offset, start.y + i * offset, radians(-90 + ma), radians(-90 + ha), PIE);
            else arc(0, 0, start.x + i * offset, start.y + i * offset, radians(-90 + ha), radians(-90 + ma), PIE);
        }
        pop();

        push();
        stroke(col)
        fill(col)
        //rect(width - 120, i*20, 10, 10)
        //text(`${i + 1}) ${e}`, width - 100, 10 + i * 20);
        rect(width - 220, i*20, 10, 10)
        text(`${i + 1}) ${e} ${ha} ${ma} ${Math.abs(Math.abs(ma - ha))}`, width - 200, 10 + i * 20);
        i += 1;
        pop()
    });
    pop();
}

function draw() {
    background(220);

    //if((millis())%1 == 0)
    tick();

    //angleMode(DEGREES)
    draw90s();
    drawFace();
    drawHandles();
}
