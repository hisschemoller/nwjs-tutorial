import { pause as pauseTimer, setup as setupTimer, start as startTimer } from './timebase.js';

const counterEl = document.getElementById('counter');
const sliderEl = document.getElementById('slider');
const bpmEl = document.getElementById('bpm');
const min = 40;
const max = 208;

let ctx = null;
let gain = null;
let isRunning = false;
let isSetup = false;
let bpm = 120;
let secondsPerBeat = 60 / bpm;

sliderEl.addEventListener('input', e => {
  setBPM(e.target.value);
});

bpmEl.addEventListener('change', e => {
  setBPM(e.target.value);
});

document.getElementById('decrease').addEventListener('click', e => {
  setBPM(bpm - 1);
});

document.getElementById('increase').addEventListener('click', e => {
  setBPM(bpm + 1);
});

document.getElementById('run-toggle').addEventListener('change', e => {
  isRunning = e.target.checked;
  if (!isSetup) {
    isSetup = true;
    setupTimer(scheduleEvents);
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    gain = ctx.createGain();
    gain.connect(ctx.destination);
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
  const when = ctx.currentTime + delay;

  gain.gain.setValueAtTime(0.5, when);
  gain.gain.exponentialRampToValueAtTime(0.00001, when + 0.15);

  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(index % 4 === 0 ? 880 : 440, when);
  osc.connect(gain);
  osc.start(when);
  osc.stop(when + 0.05);

  setTimeout(
    () => {
      counterEl.textContent = index;
    }, delay * 1000);
}

setBPM(120);
