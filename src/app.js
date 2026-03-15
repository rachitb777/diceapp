/* ── State ───────────────────────────────────────────────────── */
let diceCount = 1;
let currentTheme = 'classic';
let isDark = false;
let isRolling = false;
let history = [];

/* ── Face rotations that land on each value ─────────────────── */
// Each rotation makes that face point toward the viewer (+Z axis)
const faceRotations = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(180deg)',
  3: 'rotateX(0deg) rotateY(-90deg)',
  4: 'rotateX(0deg) rotateY(90deg)',
  5: 'rotateX(-90deg) rotateY(0deg)',
  6: 'rotateX(90deg) rotateY(0deg)',
};

/* ── Pip layouts per face ────────────────────────────────────── */
const pipLayouts = {
  1: ['g'],
  2: ['a', 'b'],
  3: ['a', 'g', 'b'],
  4: ['a', 'c', 'd', 'b'],
  5: ['a', 'c', 'g', 'd', 'b'],
  6: ['a', 'c', 'e', 'f', 'd', 'b'],
};

/* ── Build a single die element ─────────────────────────────── */
function buildDie(id) {
  const scene = document.createElement('div');
  scene.className = 'die-scene';

  const die = document.createElement('div');
  die.className = 'die';
  die.id = `die-${id}`;

  for (let v = 1; v <= 6; v++) {
    const face = document.createElement('div');
    face.className = `face face-${v}`;
    face.dataset.value = v;

    // Only render pips that belong on this face value
    pipLayouts[v].forEach(slot => {
      const pip = document.createElement('div');
      pip.className = `pip pip-${slot}`;
      face.appendChild(pip);
    });

    die.appendChild(face);
  }

  scene.appendChild(die);
  return scene;
}

/* ── Render the tray ────────────────────────────────────────── */
function renderTray() {
  const tray = document.getElementById('diceTray');
  tray.innerHTML = '';
  for (let i = 0; i < diceCount; i++) {
    tray.appendChild(buildDie(i));
  }
}

/* ── Roll ────────────────────────────────────────────────────── */
function roll() {
  if (isRolling) return;
  isRolling = true;

  const rollBtn = document.getElementById('rollBtn');
  rollBtn.disabled = true;

  const results = [];
  for (let i = 0; i < diceCount; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }

  // Animate each die
  results.forEach((value, i) => {
    const die = document.getElementById(`die-${i}`);
    if (!die) return;

    const finalRotation = faceRotations[value];

    // Add random extra full spins for variety
    const extraX = (Math.floor(Math.random() * 3) + 2) * 360;
    const extraY = (Math.floor(Math.random() * 3) + 2) * 360;

    // Parse the final rotation and add extra spins
    const [rx, ry] = finalRotation.match(/-?\d+/g).map(Number);
    const totalX = rx + extraX;
    const totalY = ry + extraY;

    die.style.setProperty('--final-rotation', `rotateX(${totalX}deg) rotateY(${totalY}deg)`);
    die.classList.remove('rolling');

    // Force reflow
    void die.offsetWidth;
    die.classList.add('rolling');
  });

  // After animation, snap to correct face
  setTimeout(() => {
    results.forEach((value, i) => {
      const die = document.getElementById(`die-${i}`);
      if (!die) return;
      die.classList.remove('rolling');
      die.style.transform = faceRotations[value];
    });

    // Update total
    const total = results.reduce((s, v) => s + v, 0);
    document.getElementById('totalValue').textContent = total;

    // Save to history
    addToHistory(results, total);

    isRolling = false;
    rollBtn.disabled = false;
  }, 720);
}

/* ── History ────────────────────────────────────────────────── */
function addToHistory(results, total) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  history.unshift({ results, total, time });
  if (history.length > 50) history.pop();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (history.length === 0) {
    list.innerHTML = '<li class="history-empty">No rolls yet</li>';
    return;
  }

  list.innerHTML = history.map(h => `
    <li class="history-item">
      <span class="history-dice">${h.results.join(' · ')}</span>
      <span class="history-total">${h.total}</span>
      <span class="history-time">${h.time}</span>
    </li>
  `).join('');
}

/* ── Theme & Mode ────────────────────────────────────────────── */
function setTheme(theme) {
  document.body.classList.remove(`theme-${currentTheme}`);
  document.body.classList.add(`theme-${theme}`);
  currentTheme = theme;
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  localStorage.setItem('dice-theme', theme);
}

function setMode(dark) {
  isDark = dark;
  document.body.dataset.mode = dark ? 'dark' : 'light';
  document.querySelector('.mode-icon').textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('dice-dark', dark ? '1' : '0');
}

/* ── Boot ────────────────────────────────────────────────────── */
function init() {
  // Restore prefs
  const savedTheme = localStorage.getItem('dice-theme') || 'classic';
  const savedDark  = localStorage.getItem('dice-dark');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = savedDark !== null ? savedDark === '1' : prefersDark;

  setTheme(savedTheme);
  setMode(useDark);
  renderTray();

  // Dice count buttons
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      diceCount = parseInt(btn.dataset.count);
      document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTray();
      document.getElementById('totalValue').textContent = '–';
    });
  });

  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  // Mode toggle
  document.getElementById('modeToggle').addEventListener('click', () => setMode(!isDark));

  // Roll button
  document.getElementById('rollBtn').addEventListener('click', roll);

  // Clear history
  document.getElementById('clearHistory').addEventListener('click', () => {
    history = [];
    renderHistory();
  });

  // Keyboard shortcut: Space / Enter to roll
  document.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'Enter') && e.target === document.body) {
      e.preventDefault();
      roll();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
