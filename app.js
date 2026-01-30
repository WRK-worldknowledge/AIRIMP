let allData = [], gameData = [], i = 0, score = 0, time = 60, timer, mode = 'train', gameType = 'code-to-city';

const moduleNames = {
  'Passenger': 'Passenger & Special Pax',
  'Meals': 'Meals',
  'Cabin': 'Cabin & Operations',
  'Safety': 'Safety & Emergency',
  'Cargo': 'Cargo & Special Loads',
  'Flight': 'Flight & Operations'
};

fetch('iata.json')
  .then(r => r.json())
  .then(d => {
    allData = d;
    const mods = [...new Set(d.map(x => x.module))];
    const c = document.getElementById('modules');
    c.innerHTML = "";

    mods.forEach(m => {
      c.innerHTML += `<label><input type="checkbox" value="${m}" checked> ${moduleNames[m] || m}</label><br>`;
    });
  });

function setMode(m) {
  mode = m;
  document.getElementById('modules').style.display = m === 'exam' ? 'none' : 'block';
}

function setGameType(t) {
  gameType = t;
}

function startGame() {
  const checked = [...document.querySelectorAll('#modules input:checked')].map(x => x.value);

  gameData = mode === 'exam'
    ? allData.slice()
    : allData.filter(x => checked.includes(x.module));

  if (gameData.length === 0) {
    gameData = allData.slice();
  }

  gameData.sort(() => Math.random() - 0.5);

  document.getElementById('start').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  score = 0;
  i = 0;
  time = 60;

  timer = setInterval(tick, 1000);
  show();
}

function tick() {
  time--;
  document.getElementById('timer').innerText = `Time: ${time}s | Score: ${score}`;
  if (time <= 0) end();
}

function show() {
  if (i >= gameData.length) i = 0;

  const item = gameData[i];
  const text = (gameType === 'city-to-code')
    ? item.code
    : item.city;

  document.getElementById('code').innerText = text || "???";
}

function good() {
  score++;
  i++;
  show();
}

function skip() {
  const item = gameData[i];
  document.getElementById('game').classList.add('hidden');

  const h = document.getElementById('hint');
  const answer = (gameType === 'city-to-code') ? item.city : item.code;

  h.innerHTML = `${answer} — ${item.country}<br><small>tap to continue</small>`;
  h.classList.remove('hidden');
}

function next() {
  document.getElementById('hint').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  i++;
  show();
}

function end() {
  clearInterval(timer);
  document.getElementById('game').classList.add('hidden');
  document.getElementById('end').classList.remove('hidden');
  document.getElementById('score').innerText = `Final score: ${score}`;
}
// --- DEFINITIVE STABLE TILT ---
let lastAction = 0;
let tiltLocked = false;

window.addEventListener('deviceorientation', function(e) {
  if (!gameData.length) return;
  if (time <= 0) return;

  const gamma = e.gamma; // left-right tilt
  const now = Date.now();

  // Hard cooldown
  if (now - lastAction < 1200) return;

  // Ignore small movement (dead zone)
  if (gamma > -15 && gamma < 15) {
    tiltLocked = false;
    return;
  }

  // Only trigger if unlocked
  if (tiltLocked) return;

  // RIGHT tilt = GOOD
  if (gamma > 30) {
    tiltLocked = true;
    lastAction = now;
    good();
  }

  // LEFT tilt = WRONG
  if (gamma < -30) {
    tiltLocked = true;
    lastAction = now;
    skip();
  }
});
