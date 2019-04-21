import { pause as pauseTimer, setup as setupTimer, start as startTimer } from './timebase.js';

const toggleEl = document.getElementById('run-toggle');
const counterEl = document.getElementById('counter');

let audioCtx = null;
let isRunning = false;
let isSetup = false;
let bpm = 120;
let secondsPerBeat = 60 / bpm;

toggleEl.addEventListener('change', e => {
  isRunning = e.target.checked;
  if (!isSetup) {
    isSetup = true;
    setupTimer(scheduleEvents);
    audioCtx = new AudioContext();
  }
  if (isRunning) {
    startTimer();
  } else {
    pauseTimer();
  }
});

function scheduleEvents(now, scanStart, scanEnd) {
  const firstBeat = Math.ceil(scanStart / secondsPerBeat);
  const lastBeat = Math.floor(scanEnd / secondsPerBeat);
  
  if (firstBeat <= lastBeat) {
    for (let i = firstBeat; i <= lastBeat; i++) {
      performEvent(i, now);
    }
  }
}

function performEvent(index, now) {
  const delay = Math.max(0, (index * secondsPerBeat) - now);

  const osc = audioCtx.createOscillator();
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + 0.1);

  setTimeout(
    () => {
      counterEl.textContent = index;
    }, delay * 1000);
}
