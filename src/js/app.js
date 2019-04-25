import { pause as pauseTimer, setup as setupTimer, start as startTimer } from './timebase.js';

const toggleEl = document.getElementById('run-toggle');
const counterEl = document.getElementById('counter');
const sliderEl = document.getElementById('slider');
const decreaseEl = document.getElementById('decrease');
const increaseEl = document.getElementById('increase');
const bpmEl = document.getElementById('bpm');
const min = 40;
const max = 208;

let audioCtx = null;
let isRunning = false;
let isSetup = false;
let bpm = 120;
let secondsPerBeat = 60 / bpm;
let gain = null;

decreaseEl.addEventListener('click', e => {
  setBPM(bpm - 1);
});

increaseEl.addEventListener('click', e => {
  setBPM(bpm + 1);
});

sliderEl.addEventListener('input', e => {
  setBPM(e.target.value);
});

bpmEl.addEventListener('change', e => {
  setBPM(e.target.value);
});

toggleEl.addEventListener('change', e => {
  isRunning = e.target.checked;
  if (!isSetup) {
    isSetup = true;
    setupTimer(scheduleEvents);
    audioCtx = new AudioContext();
    gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
  }
  if (isRunning) {
    startTimer();
  } else {
    pauseTimer();
  }
});

function setBPM(newValue) {
  bpm = Math.max(min, Math.min(newValue, max));
  secondsPerBeat = 60 / bpm;
  bpmEl.value = bpm;
  sliderEl.value = bpm;
}

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
  const when = audioCtx.currentTime + delay;

  gain.gain.setValueAtTime(0.3, when);
  gain.gain.exponentialRampToValueAtTime(0.00001, when + 0.15);

  const osc = audioCtx.createOscillator();
  osc.frequency.setValueAtTime(index % 4 === 0 ? 880 : 440, when);
  osc.connect(gain);
  osc.start(when);
  osc.stop(when + 0.03);

  setTimeout(
    () => {
      counterEl.textContent = index;
    }, delay * 1000);
}

setBPM(120);
