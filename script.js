// ====================== HUNTER SYSTEM ======================
// Solo Leveling inspired fitness RPG
// Pure Vanilla JS + LocalStorage

const STORAGE_KEY = 'hunterSystem_v1';

// ---------- DATA ----------
const RANK_THRESHOLDS = [
  { name: 'E Rank', xp: 0 },
  { name: 'D Rank', xp: 500 },
  { name: 'C Rank', xp: 1000 },
  { name: 'B Rank', xp: 2500 },
  { name: 'A Rank', xp: 5000 },
  { name: 'S Rank', xp: 10000 },
  { name: 'National Hunter', xp: 25000 },
  { name: 'Monarch', xp: 50000 }
];

const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000];

const XP_VALUES = {
  'push-ups': 2,
  'squats': 2,
  'jumping jacks': 1,
  'plank': 10,
  'pull-ups': 6,
  'lunges': 3,
  'burpees': 5,
  'running': 15
};

const QUOTES = [
  '"Arise."',
  '"The weak become strong."',
  '"Every day is another dungeon."',
  '"Level Up."',
  '"I alone level up."',
  '"Fear is just another obstacle."',
  '"Become the hunter, not the hunted."',
  '"Strength is the only truth."'
];

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Workout', desc: 'Complete your first task', icon: 'fa-play' },
  { id: 'streak_7', name: '7-Day Streak', desc: 'Maintain a 7-day streak', icon: 'fa-fire' },
  { id: 'pushups_100', name: '100 Push-ups', desc: 'Total 100 push-ups completed', icon: 'fa-hand-fist' },
  { id: 'squats_1000', name: '1000 Squats', desc: 'Total 1000 squats completed', icon: 'fa-person-walking' },
  { id: 'burpees_100', name: '100 Burpees', desc: 'Total 100 burpees completed', icon: 'fa-bolt' },
  { id: 'run_10k', name: '10 km Run', desc: 'Accumulate 10 km of running', icon: 'fa-road' },
  { id: 'monarch_candidate', name: 'Monarch Candidate', desc: 'Reach S Rank', icon: 'fa-crown' }
];

// Progressive workout generators
function generateBeginner(day) {
  const base = {
    pushups: 10 + (day - 1) * 1,
    squats: 15 + (day - 1) * 2,
    jumpingJacks: 20 + (day - 1) * 2,
    plank: 20 + (day - 1) * 2
  };
  return [
    { id: `b${day}_1`, name: `${base.pushups} Push-ups`, type: 'push-ups', count: base.pushups, xp: base.pushups * 2 },
    { id: `b${day}_2`, name: `${base.squats} Squats`, type: 'squats', count: base.squats, xp: base.squats * 2 },
    { id: `b${day}_3`, name: `${base.jumpingJacks} Jumping Jacks`, type: 'jumping jacks', count: base.jumpingJacks, xp: base.jumpingJacks * 1 },
    { id: `b${day}_4`, name: `${base.plank} sec Plank`, type: 'plank', count: base.plank, xp: 10 }
  ];
}

function generateIntermediate(day) {
  return [
    { id: `i${day}_1`, name: `${12 + day} Push-ups`, type: 'push-ups', count: 12 + day, xp: (12 + day) * 2 },
    { id: `i${day}_2`, name: `${5 + Math.floor(day / 3)} Pull-ups`, type: 'pull-ups', count: 5 + Math.floor(day / 3), xp: (5 + Math.floor(day / 3)) * 6 },
    { id: `i${day}_3`, name: `${16 + day * 2} Lunges`, type: 'lunges', count: 16 + day * 2, xp: (16 + day * 2) * 3 },
    { id: `i${day}_4`, name: `${8 + Math.floor(day / 2)} Burpees`, type: 'burpees', count: 8 + Math.floor(day / 2), xp: (8 + Math.floor(day / 2)) * 5 },
    { id: `i${day}_5`, name: `${30 + day * 2} sec Plank`, type: 'plank', count: 30 + day * 2, xp: 10 },
    { id: `i${day}_6`, name: `${1 + Math.floor(day / 5)} km Running`, type: 'running', count: 1 + Math.floor(day / 5), xp: 15 }
  ];
}

function generateAdvanced(day) {
  return [
    { id: `a${day}_1`, name: `${20 + day * 2} Push-ups`, type: 'push-ups', count: 20 + day * 2, xp: (20 + day * 2) * 2 },
    { id: `a${day}_2`, name: `${8 + Math.floor(day / 2)} Pull-ups`, type: 'pull-ups', count: 8 + Math.floor(day / 2), xp: (8 + Math.floor(day / 2)) * 6 },
    { id: `a${day}_3`, name: `${25 + day * 2} Lunges`, type: 'lunges', count: 25 + day * 2, xp: (25 + day * 2) * 3 },
    { id: `a${day}_4`, name: `${12 + day} Burpees`, type: 'burpees', count: 12 + day, xp: (12 + day) * 5 },
    { id: `a${day}_5`, name: `${45 + day * 3} sec Plank`, type: 'plank', count: 45 + day * 3, xp: 10 },
    { id: `a${day}_6`, name: `${2 + Math.floor(day / 4)} km Running`, type: 'running', count: 2 + Math.floor(day / 4), xp: 15 }
  ];
}

function generateExpert(day) {
  return [
    { id: `e${day}_1`, name: `${30 + day * 3} Push-ups`, type: 'push-ups', count: 30 + day * 3, xp: (30 + day * 3) * 2 },
    { id: `e${day}_2`, name: `${12 + day} Pull-ups`, type: 'pull-ups', count: 12 + day, xp: (12 + day) * 6 },
    { id: `e${day}_3`, name: `${35 + day * 3} Lunges`, type: 'lunges', count: 35 + day * 3, xp: (35 + day * 3) * 3 },
    { id: `e${day}_4`, name: `${18 + day * 2} Burpees`, type: 'burpees', count: 18 + day * 2, xp: (18 + day * 2) * 5 },
    { id: `e${day}_5`, name: `${60 + day * 4} sec Plank`, type: 'plank', count: 60 + day * 4, xp: 10 },
    { id: `e${day}_6`, name: `${3 + Math.floor(day / 3)} km Running`, type: 'running', count: 3 + Math.floor(day / 3), xp: 15 }
  ];
}

const GENERATORS = {
  beginner: generateBeginner,
  intermediate: generateIntermediate,
  advanced: generateAdvanced,
  expert: generateExpert
};

// ---------- STATE ----------
let state = {
  totalXP: 0,
  level: 1,
  rank: 'E Rank',
  streak: 0,
  lastLogin: null,
  currentDifficulty: 'beginner',
  unlockedDifficulties: ['beginner'],
  completedDays: { beginner: [], intermediate: [], advanced: [], expert: [] },
  taskCompletions: {}, // key: taskId -> true
  stats: {
    totalWorkouts: 0,
    pushups: 0,
    squats: 0,
    burpees: 0,
    runningKm: 0
  },
  achievements: {},
  soundEnabled: true,
  currentDay: 1,
  currentDiffView: 'beginner'
};

// ---------- HELPERS ----------
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
    } catch (e) {
      console.warn('Failed to load save');
    }
  }
}

function getLevelFromXP(xp) {
  let lvl = 1;
  for (let i = 1; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) lvl = i + 1;
    else break;
  }
  return Math.min(lvl, LEVEL_XP.length);
}

function getXPForNextLevel(level) {
  if (level >= LEVEL_XP.length) return LEVEL_XP[LEVEL_XP.length - 1] + 5000;
  return LEVEL_XP[level] || LEVEL_XP[LEVEL_XP.length - 1];
}

function getRankFromXP(xp) {
  let rank = RANK_THRESHOLDS[0];
  for (const r of RANK_THRESHOLDS) {
    if (xp >= r.xp) rank = r;
  }
  return rank;
}

function getNextRank(xp) {
  for (const r of RANK_THRESHOLDS) {
    if (xp < r.xp) return r;
  }
  return null;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  // Simple Web Audio beep (no external files required)
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'complete') {
      osc.frequency.value = 880;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'level') {
      osc.frequency.value = 523;
      gain.gain.value = 0.15;
      osc.start();
      setTimeout(() => { osc.frequency.value = 659; }, 100);
      setTimeout(() => { osc.frequency.value = 784; }, 200);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'rank') {
      osc.frequency.value = 392;
      gain.gain.value = 0.2;
      osc.start();
      setTimeout(() => { osc.frequency.value = 523; }, 150);
      setTimeout(() => { osc.frequency.value = 659; }, 300);
      setTimeout(() => { osc.frequency.value = 784; }, 450);
      osc.stop(ctx.currentTime + 0.7);
    }
  } catch (e) {}
}

function showPromotion(title, subtitle) {
  const overlay = document.getElementById('promotion-overlay');
  document.getElementById('promotion-title').textContent = title;
  document.getElementById('promotion-subtitle').textContent = subtitle;
  overlay.classList.remove('hidden');
  overlay.classList.add('show');
  playSound(title === 'ARISE' ? 'rank' : 'level');
  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }, 2500);
}

function floatXP(amount, x, y) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = `+${amount} XP`;
  el.style.left = (x || window.innerWidth / 2) + 'px';
  el.style.top = (y || window.innerHeight / 2) + 'px';
  document.getElementById('xp-float-container').appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function addXP(amount) {
  const oldLevel = state.level;
  const oldRank = state.rank;
  state.totalXP += amount;
  state.level = getLevelFromXP(state.totalXP);
  const newRankObj = getRankFromXP(state.totalXP);
  state.rank = newRankObj.name;

  if (state.level > oldLevel) {
    showPromotion('LEVEL UP', `You reached Level ${state.level}`);
  }
  if (state.rank !== oldRank) {
    setTimeout(() => showPromotion('ARISE', `Promoted to ${state.rank}`), 2800);
  }
  save();
  updateUI();
}

// ---------- DAILY LOGIN ----------
function checkDailyLogin() {
  const today = new Date().toDateString();
  if (state.lastLogin !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (state.lastLogin === yesterday.toDateString()) {
      state.streak += 1;
    } else if (state.lastLogin !== today) {
      state.streak = 1;
    }
    // Login bonus (7-day cycle)
    const bonus = 10 + (state.streak % 7) * 10;
    state.totalXP += bonus;
    state.lastLogin = today;
    save();
    setTimeout(() => {
      alert(`Daily Login Bonus: +${bonus} XP\nCurrent Streak: ${state.streak} days`);
    }, 600);
  }
}

// ---------- ACHIEVEMENTS ----------
function checkAchievements() {
  const s = state.stats;
  if (state.stats.totalWorkouts >= 1) unlockAchievement('first_workout');
  if (state.streak >= 7) unlockAchievement('streak_7');
  if (s.pushups >= 100) unlockAchievement('pushups_100');
  if (s.squats >= 1000) unlockAchievement('squats_1000');
  if (s.burpees >= 100) unlockAchievement('burpees_100');
  if (s.runningKm >= 10) unlockAchievement('run_10k');
  if (state.rank === 'S Rank' || state.rank === 'National Hunter' || state.rank === 'Monarch') {
    unlockAchievement('monarch_candidate');
  }
}

function unlockAchievement(id) {
  if (!state.achievements[id]) {
    state.achievements[id] = true;
    save();
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (a) {
      setTimeout(() => alert(`Achievement Unlocked!\n${a.name}\n${a.desc}`), 400);
    }
  }
}

// ---------- UI UPDATE ----------
function updateUI() {
  // Sidebar
  document.getElementById('sidebar-rank').textContent = state.rank.split(' ')[0];
  document.getElementById('sidebar-level').textContent = state.level;

  // Dashboard
  document.getElementById('current-rank').textContent = state.rank;
  document.getElementById('current-level').textContent = state.level;
  document.getElementById('total-xp').textContent = state.totalXP.toLocaleString();
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('difficulty-display').textContent = 
    state.currentDifficulty.charAt(0).toUpperCase() + state.currentDifficulty.slice(1);

  // Level progress
  const currentLevelXP = LEVEL_XP[state.level - 1] || 0;
  const nextLevelXP = getXPForNextLevel(state.level);
  const levelProgress = Math.min(100, ((state.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
  document.getElementById('level-progress-fill').style.width = levelProgress + '%';
  document.getElementById('level-progress-text').textContent = 
    `${state.totalXP - currentLevelXP} / ${nextLevelXP - currentLevelXP} XP`;

  // Rank progress
  const nextRank = getNextRank(state.totalXP);
  if (nextRank) {
    const prevRankXP = RANK_THRESHOLDS.find(r => r.name === state.rank)?.xp || 0;
    const rankProgress = ((state.totalXP - prevRankXP) / (nextRank.xp - prevRankXP)) * 100;
    document.getElementById('rank-progress-fill').style.width = Math.min(100, rankProgress) + '%';
    document.getElementById('rank-progress-text').textContent = 
      `${state.totalXP} / ${nextRank.xp} XP to ${nextRank.name}`;
  } else {
    document.getElementById('rank-progress-fill').style.width = '100%';
    document.getElementById('rank-progress-text').textContent = 'MAX RANK ACHIEVED';
  }

  // Quote
  document.getElementById('motivational-quote').textContent = 
    QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // Difficulty tabs
  document.querySelectorAll('#difficulty-tabs .tab').forEach(tab => {
    const diff = tab.dataset.diff;
    tab.classList.toggle('locked', !state.unlockedDifficulties.includes(diff));
    tab.classList.toggle('active', state.currentDiffView === diff);
  });

  renderMissions();
  renderStats();
  renderAchievements();
}

function renderMissions() {
  const container = document.getElementById('missions-list');
  const day = state.currentDay;
  const diff = state.currentDiffView;
  const tasks = GENERATORS[diff](day);

  document.getElementById('current-day-label').textContent = `Day ${day}`;

  container.innerHTML = tasks.map(task => {
    const done = !!state.taskCompletions[task.id];
    return `
      <div class="task-item ${done ? 'completed' : ''}" data-id="${task.id}">
        <input type="checkbox" ${done ? 'checked' : ''} data-id="${task.id}" />
        <span class="task-name">${task.name}</span>
        <span class="task-xp">+${task.xp} XP</span>
      </div>
    `;
  }).join('');

  // Bind checkboxes
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      if (e.target.checked) {
        state.taskCompletions[id] = true;
        // Update stats
        if (task.type === 'push-ups') state.stats.pushups += task.count;
        if (task.type === 'squats') state.stats.squats += task.count;
        if (task.type === 'burpees') state.stats.burpees += task.count;
        if (task.type === 'running') state.stats.runningKm += task.count;
        state.stats.totalWorkouts += 1;

        addXP(task.xp);
        playSound('complete');
        floatXP(task.xp, e.clientX, e.clientY);
        checkAchievements();

        // Check if day is fully complete
        const allDone = tasks.every(t => state.taskCompletions[t.id]);
        if (allDone && !state.completedDays[diff].includes(day)) {
          state.completedDays[diff].push(day);
          // Unlock next difficulty after 30 days
          if (state.completedDays[diff].length >= 30) {
            const order = ['beginner', 'intermediate', 'advanced', 'expert'];
            const idx = order.indexOf(diff);
            if (idx < order.length - 1) {
              const next = order[idx + 1];
              if (!state.unlockedDifficulties.includes(next)) {
                state.unlockedDifficulties.push(next);
                state.currentDifficulty = next;
                alert(`Difficulty Unlocked: ${next.toUpperCase()}!`);
              }
            }
          }
        }
        save();
        updateUI();
      } else {
        // Unchecking not allowed to keep simplicity (or implement reverse if wanted)
        e.target.checked = true;
      }
    });
  });

  // Total XP of current day
  const totalDayXP = tasks.reduce((sum, t) => sum + (state.taskCompletions[t.id] ? 0 : t.xp), 0);
  document.getElementById('mission-xp').textContent = totalDayXP > 0 ? `+${totalDayXP} XP remaining` : 'All tasks complete!';
}

function renderStats() {
  const grid = document.getElementById('stats-grid');
  const completedTasks = Object.keys(state.taskCompletions).length;
  const totalPossible = 30 * 4 * 4; // rough
  const completion = Math.min(100, Math.round((completedTasks / 200) * 100));

  grid.innerHTML = `
    <div class="stat-card">
      <div class="card-title">Total Workouts</div>
      <div class="big-stat">${state.stats.totalWorkouts}</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Current Streak</div>
      <div class="big-stat">${state.streak} <i class="fas fa-fire"></i></div>
    </div>
    <div class="stat-card">
      <div class="card-title">Total XP</div>
      <div class="big-stat">${state.totalXP.toLocaleString()}</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Level</div>
      <div class="big-stat">${state.level}</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Rank</div>
      <div class="big-stat" style="font-size:1.4rem">${state.rank}</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Completion</div>
      <div class="big-stat">${completion}%</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Push-ups</div>
      <div class="big-stat">${state.stats.pushups}</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Squats</div>
      <div class="big-stat">${state.stats.squats}</div>
    </div>
  `;
}

function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = !!state.achievements[a.id];
    return `
      <div class="achievement-card ${unlocked ? '' : 'locked'}">
        <div class="icon"><i class="fas ${a.icon}"></i></div>
        <h3>${a.name}</h3>
        <p>${a.desc}</p>
        ${unlocked ? '<p style="color:var(--success);margin-top:0.5rem">Unlocked</p>' : ''}
      </div>
    `;
  }).join('');
}

// ---------- EVENT LISTENERS ----------
document.querySelectorAll('.nav-links li').forEach(li => {
  li.addEventListener('click', () => {
    document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
    li.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(li.dataset.page).classList.add('active');
  });
});

document.getElementById('prev-day').addEventListener('click', () => {
  if (state.currentDay > 1) {
    state.currentDay--;
    updateUI();
  }
});
document.getElementById('next-day').addEventListener('click', () => {
  if (state.currentDay < 30) {
    state.currentDay++;
    updateUI();
  }
});

document.querySelectorAll('#difficulty-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('locked')) return;
    state.currentDiffView = tab.dataset.diff;
    state.currentDay = 1;
    updateUI();
  });
});

document.getElementById('complete-all-btn').addEventListener('click', () => {
  const day = state.currentDay;
  const diff = state.currentDiffView;
  const tasks = GENERATORS[diff](day);
  let gained = 0;
  tasks.forEach(task => {
    if (!state.taskCompletions[task.id]) {
      state.taskCompletions[task.id] = true;
      gained += task.xp;
      if (task.type === 'push-ups') state.stats.pushups += task.count;
      if (task.type === 'squats') state.stats.squats += task.count;
      if (task.type === 'burpees') state.stats.burpees += task.count;
      if (task.type === 'running') state.stats.runningKm += task.count;
      state.stats.totalWorkouts += 1;
    }
  });
  if (gained > 0) {
    addXP(gained);
    playSound('complete');
    floatXP(gained);
    if (!state.completedDays[diff].includes(day)) {
      state.completedDays[diff].push(day);
    }
    checkAchievements();
    save();
    updateUI();
  }
});

document.getElementById('sound-toggle').addEventListener('change', (e) => {
  state.soundEnabled = e.target.checked;
  save();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
});

document.getElementById('export-btn').addEventListener('click', () => {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hunter-system-save-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-btn').addEventListener('click', () => {
  document.getElementById('import-file').click();
});
document.getElementById('import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      state = { ...state, ...data };
      save();
      updateUI();
      alert('Progress imported successfully!');
    } catch (err) {
      alert('Invalid save file.');
    }
  };
  reader.readAsText(file);
});

// ---------- INIT ----------
window.addEventListener('DOMContentLoaded', () => {
  load();
  checkDailyLogin();
  state.level = getLevelFromXP(state.totalXP);
  state.rank = getRankFromXP(state.totalXP).name;
  document.getElementById('sound-toggle').checked = state.soundEnabled;
  updateUI();

  // Hide loading
  setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 500);
  }, 800);
});