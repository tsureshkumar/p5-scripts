const worker = self;
const workerID = 0;

clock = 0; // secs
clockRunning = false;
tickValue = 1.0 / 6;
prevAngle = 0;

function tick() {
    if (clockRunning) clock += tickValue;
}
function toggleRunning() {
    clockRunning = !clockRunning;
}
function changeTickPeriod(v) {
    try {
        let n = parseFloat(v);
        if (!isNaN(n) && isFinite(n) && n > 0) tickValue = n;
    } catch (err) {
        tickValue = 1;
    }
}

function startIteration() {
    clockRunning = true;

    function next() {
        let c = 12*11; // make this 12 for matching clock animation
        while (clockRunning && c > -0) {
            tick();
            let wc = clock;
            hh = Math.floor((wc / 60 / 60) % 24);
            mm = Math.floor((wc / 60) % 60);
            ss = Math.floor(wc % 60);
            let mm1 = (wc / 60.0) % 60;
            let ang = 6.0 * mm1 - (30.0 * hh + (mm1 * 1.0) / 2.0);
            let th = Math.abs(Math.abs(ang) - 90);
            let th2 = Math.abs(Math.abs(ang) - 270);
            const EPS = 1e-2
            if (th <= EPS || th2 <= EPS) {
                let minDiff  = Math.abs(prevAngle - wc);
                console.log(minDiff);
                if(minDiff > 5*1.6*60) {
                    clockRunning = false;
                    setTimeout(() => clockRunning = true, 3000);
                    prevAngle = wc;
                    worker.postMessage({
                        wokerID: 0,
                        method: "got90",
                        value: `${hh}:${mm}:${ss}`,
                    });
                }
            }
            c--;
        }
        worker.postMessage({
            wokerID: 0,
            method: "updateValue",
            value: clock,
        });
        setTimeout(next, 1000/30);
    }

    next();
}

function stopIteration() {
    clockRunning = false;
}

worker.addEventListener(
    "message",
    function(e) {
        if (e.data === "start") {
            startIteration();
        } else if (e.data === "toggle") {
            toggleRunning();
        } else {
            worker.postMessage(`Unknown method ${e.data} in worker 0`);
        }
    },
    false
);
