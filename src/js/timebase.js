/**
 * Run is called at requestAnimationFrame rate, 60 times per second.
 * Each time it checks if a next 
 * 
 * @see https://github.com/hoch/waax file src/waax.timebase.js 
 */

const scanRange = 4 / 60;
const updateFrequency = 1 / 60;
const callbacks = [];

let isRunning = false;
let needsScan = false;
let scanStart = 0;
let scanEnd = 0;
let absNow = 0;
let absLastNow = 0;
let now = 0;

export function setup(callback) {
  callbacks.push(callback)
  run();
}

export function start() {
  absNow = performance.now() / 1000;
  absLastNow = absNow;
  isRunning = true;
}

export function pause() {
  isRunning = false;
}

export function rewind() {
  now = 0;
}

function run() {
  if (isRunning) {
    absNow = performance.now() / 1000;
    now += (absNow - absLastNow);
    absLastNow = absNow;
    advanceScanRange();
    scheduleNotesInScanRange();
  }

  requestAnimationFrame(run);
}

function scheduleNotesInScanRange() {
  if (needsScan) {
    callbacks.forEach(callback => callback(now, scanStart, scanEnd));
    needsScan = false;
  }
}

function advanceScanRange() {
  while (now + updateFrequency > scanEnd) {
    scanStart = scanEnd;
    scanEnd = scanEnd + scanRange;
    if (now + updateFrequency <= scanEnd) {
      needsScan = true;
    }
  }
}
