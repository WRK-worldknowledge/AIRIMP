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
