// ============================================================
//  app.js — Main Initializer + Data + State + Progress Rings
// ============================================================

// ── Exam Data ─────────────────────────────────────────────
const EXAM_DATA = {
  ibps: {
    name: 'IBPS SO IT Officer',
    date: 'August 29, 2026',
    totalQ: 150,
    totalMarks: 125,
    duration: '120 min (40 min/section)',
    negMark: '-0.25 per wrong',
    sections: [
      {
        id: 'reasoning',
        name: 'Reasoning Ability',
        icon: '🧩',
        questions: 50, marks: 50, time: '40 min',
        color: '#8b5cf6',
        cutGeneral: '6.50–11.25',
        cutPwBD:    '3.00–6.75',
        topics: [
          { id: 't1',  name: 'Puzzles & Seating Arrangement', questions: '15–20Q', priority: 'very-high' },
          { id: 't2',  name: 'Syllogism',                     questions: '4–5Q',   priority: 'high' },
          { id: 't3',  name: 'Inequalities',                   questions: '4–5Q',   priority: 'high' },
          { id: 't4',  name: 'Coding-Decoding',               questions: '4–5Q',   priority: 'high' },
          { id: 't5',  name: 'Data Sufficiency',              questions: '3–5Q',   priority: 'moderate' },
          { id: 't6',  name: 'Machine Input-Output',          questions: '0–5Q',   priority: 'moderate' },
          { id: 't7',  name: 'Blood Relations',               questions: '2–3Q',   priority: 'moderate' },
          { id: 't8',  name: 'Direction & Distance',          questions: '2–3Q',   priority: 'moderate' },
          { id: 't9',  name: 'Miscellaneous (Alphanumeric, Ranking)', questions: '2–4Q', priority: 'low' },
        ],
      },
      {
        id: 'quant',
        name: 'Quantitative Aptitude',
        icon: '📐',
        questions: 50, marks: 50, time: '40 min',
        color: '#06b6d4',
        cutGeneral: '8.00–10.25',
        cutPwBD:    '5.00–6.75',
        topics: [
          { id: 'q1', name: 'Data Interpretation (DI)',       questions: '15–20Q', priority: 'very-high' },
          { id: 'q2', name: 'Arithmetic Word Problems',       questions: '10–15Q', priority: 'very-high' },
          { id: 'q3', name: 'Number Series',                  questions: '4–5Q',   priority: 'high' },
          { id: 'q4', name: 'Quadratic Equations',            questions: '4–5Q',   priority: 'high' },
          { id: 'q5', name: 'Simplification / Approximation',questions: '4–5Q',   priority: 'high' },
          { id: 'q6', name: 'Data Sufficiency (Math)',        questions: '3–5Q',   priority: 'moderate' },
          { id: 'q7', name: 'Quantity 1 vs Quantity 2',       questions: '0–3Q',   priority: 'low' },
        ],
      },
      {
        id: 'english',
        name: 'English Language',
        icon: '📖',
        questions: 50, marks: 25, time: '40 min',
        color: '#10b981',
        cutGeneral: '10.25–10.50',
        cutPwBD:    '7.00–8.00',
        topics: [
          { id: 'e1', name: 'Reading Comprehension',          questions: '10–15Q', priority: 'very-high' },
          { id: 'e2', name: 'Cloze Test',                     questions: '5–7Q',   priority: 'high' },
          { id: 'e3', name: 'Error Spotting',                 questions: '5Q',     priority: 'high' },
          { id: 'e4', name: 'Sentence Improvement',           questions: '5Q',     priority: 'high' },
          { id: 'e5', name: 'Para Jumbles',                   questions: '5Q',     priority: 'high' },
          { id: 'e6', name: 'Fill in the Blanks',             questions: '4–5Q',   priority: 'moderate' },
          { id: 'e7', name: 'Word Swap / Word Usage',         questions: '3–5Q',   priority: 'moderate' },
        ],
      },
    ],
  },

  ssc: {
    name: 'SSC CGL Tier 1',
    date: 'Aug–Sep 2026',
    totalQ: 100,
    totalMarks: 200,
    duration: '60 min',
    negMark: '-0.50 per wrong',
    sections: [
      {
        id: 'gr',
        name: 'General Intelligence & Reasoning',
        icon: '🧠',
        questions: 25, marks: 50, time: '(shared)',
        color: '#8b5cf6',
        topics: [
          { id: 'r1', name: 'Analogy & Classification',    questions: '4–6Q',  priority: 'very-high' },
          { id: 'r2', name: 'Series (Number + Alphanumeric)', questions: '3–5Q', priority: 'very-high' },
          { id: 'r3', name: 'Non-Verbal Reasoning',         questions: '3–5Q',  priority: 'high' },
          { id: 'r4', name: 'Coding-Decoding',              questions: '2–4Q',  priority: 'high' },
          { id: 'r5', name: 'Syllogism',                    questions: '1–2Q',  priority: 'moderate' },
          { id: 'r6', name: 'Blood Relations',              questions: '1–2Q',  priority: 'moderate' },
          { id: 'r7', name: 'Miscellaneous (Venn Diagrams, Direction)', questions: '2–4Q', priority: 'moderate' },
        ],
      },
      {
        id: 'sq',
        name: 'Quantitative Aptitude',
        icon: '📊',
        questions: 25, marks: 50, time: '(shared)',
        color: '#06b6d4',
        topics: [
          { id: 'sq1', name: 'Data Interpretation',         questions: '3–5Q',  priority: 'very-high' },
          { id: 'sq2', name: 'Geometry & Mensuration',      questions: '5–7Q',  priority: 'high' },
          { id: 'sq3', name: 'Algebra',                     questions: '3–4Q',  priority: 'high' },
          { id: 'sq4', name: 'Trigonometry',                questions: '2–3Q',  priority: 'high' },
          { id: 'sq5', name: 'Arithmetic Core (Profit/Loss, %, Ratio)', questions: '5–7Q', priority: 'moderate' },
          { id: 'sq6', name: 'Time, Speed, Distance & Work',questions: '2–4Q',  priority: 'moderate' },
        ],
      },
      {
        id: 'se',
        name: 'English Comprehension',
        icon: '✍️',
        questions: 25, marks: 50, time: '(shared)',
        color: '#10b981',
        topics: [
          { id: 'se1', name: 'Reading Comprehension / Cloze Test', questions: '5Q', priority: 'very-high' },
          { id: 'se2', name: 'Error Spotting / Sentence Improvement', questions: '4–5Q', priority: 'high' },
          { id: 'se3', name: 'Synonyms & Antonyms',         questions: '3–4Q',  priority: 'high' },
          { id: 'se4', name: 'Active/Passive & Direct/Indirect', questions: '2–4Q', priority: 'high' },
          { id: 'se5', name: 'Idioms & Phrases',            questions: '2–3Q',  priority: 'moderate' },
          { id: 'se6', name: 'One Word Substitution / Spelling', questions: '2–4Q', priority: 'moderate' },
        ],
      },
      {
        id: 'ga',
        name: 'General Awareness',
        icon: '🌍',
        questions: 25, marks: 50, time: '(shared)',
        color: '#f59e0b',
        topics: [
          { id: 'ga1', name: 'Current Affairs (last 6–8 months)', questions: '5–8Q', priority: 'very-high' },
          { id: 'ga2', name: 'General Science',             questions: '4–6Q',  priority: 'high' },
          { id: 'ga3', name: 'History & Culture',           questions: '3–5Q',  priority: 'high' },
          { id: 'ga4', name: 'Polity & Constitution',       questions: '3–4Q',  priority: 'moderate' },
          { id: 'ga5', name: 'Geography & Economy',         questions: '4–6Q',  priority: 'moderate' },
        ],
      },
    ],
  },

  common: [
    { id: 'c1',  name: 'Syllogism',              exam: 'Both',      questions: 'IBPS: 4–5Q | SSC: 1–2Q', priority: 'high' },
    { id: 'c2',  name: 'Coding-Decoding',        exam: 'Both',      questions: 'IBPS: 4–5Q | SSC: 2–4Q', priority: 'high' },
    { id: 'c3',  name: 'Blood Relations',         exam: 'Both',      questions: 'IBPS: 2–3Q | SSC: 1–2Q', priority: 'moderate' },
    { id: 'c4',  name: 'Data Interpretation',    exam: 'Both',      questions: 'IBPS: 15–20Q | SSC: 3–5Q', priority: 'very-high' },
    { id: 'c5',  name: 'Profit & Loss',           exam: 'Both',      questions: 'IBPS Arithmetic | SSC Core', priority: 'very-high' },
    { id: 'c6',  name: 'Time, Speed & Distance',  exam: 'Both',      questions: 'IBPS Arithmetic | SSC Core', priority: 'high' },
    { id: 'c7',  name: 'Time & Work',             exam: 'Both',      questions: 'IBPS Arithmetic | SSC Core', priority: 'high' },
    { id: 'c8',  name: 'Ratio & Proportion',      exam: 'Both',      questions: 'IBPS Arithmetic | SSC Core', priority: 'high' },
    { id: 'c9',  name: 'Reading Comprehension',   exam: 'Both',      questions: 'IBPS: 10–15Q | SSC: 5Q', priority: 'very-high' },
    { id: 'c10', name: 'Error Spotting',           exam: 'Both',      questions: 'IBPS: 5Q | SSC: 4–5Q', priority: 'high' },
    { id: 'c11', name: 'Para Jumbles',             exam: 'Both',      questions: 'IBPS: 5Q | SSC: included', priority: 'high' },
    { id: 'c12', name: 'Fill in the Blanks',       exam: 'Both',      questions: 'IBPS: 4–5Q | SSC: included', priority: 'moderate' },
  ],
};

// ── SVG Progress Ring Helper ──────────────────────────────
function updateRing(svgId, pct, color) {
  const circle = document.getElementById(svgId);
  if (!circle) return;
  const r   = parseFloat(circle.getAttribute('r'));
  const circ = 2 * Math.PI * r;
  circle.style.strokeDasharray  = circ;
  circle.style.strokeDashoffset = circ * (1 - pct / 100);
  circle.style.stroke = color;
}

// ── Tab Switching ─────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabTarget;
      const group  = btn.dataset.tabGroup || 'main';

      // Deactivate all in group
      document.querySelectorAll(`[data-tab-group="${group}"]`).forEach(b => {
        b.className = b.className.replace(/active-\w+/g, '').trim();
      });

      // Activate clicked
      btn.classList.add(btn.dataset.tabActive || 'active');

      // Show/hide panels
      document.querySelectorAll(`[data-tab-panel="${group}"]`).forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });
}

// ── Render Sections ───────────────────────────────────────
function renderAllSections() {
  // IBPS SO Sections
  EXAM_DATA.ibps.sections.forEach(sec => {
    Checklist.renderSection(`ibps_${sec.id}_topics`, sec.topics, `ibps_${sec.id}`);
  });

  // SSC CGL Sections
  EXAM_DATA.ssc.sections.forEach(sec => {
    Checklist.renderSection(`ssc_${sec.id}_topics`, sec.topics, `ssc_${sec.id}`);
  });

  // Common Topics
  Checklist.renderSection('common_topics', EXAM_DATA.common, 'common');
}

// ── Update All Progress Rings ─────────────────────────────
function updateAllProgress() {
  let totalTopics = 0, totalDone = 0;

  // IBPS sections
  EXAM_DATA.ibps.sections.forEach(sec => {
    const ids = sec.topics.map(t => t.id);
    const p   = Checklist.getProgress(`ibps_${sec.id}`, ids);
    updateRing(`ring_ibps_${sec.id}`, p.pct, sec.color);
    const pctEl = document.getElementById(`pct_ibps_${sec.id}`);
    if (pctEl) pctEl.textContent = `${p.pct}%`;
    totalTopics += p.total;
    totalDone   += p.done;
  });

  // SSC sections
  EXAM_DATA.ssc.sections.forEach(sec => {
    const ids = sec.topics.map(t => t.id);
    const p   = Checklist.getProgress(`ssc_${sec.id}`, ids);
    updateRing(`ring_ssc_${sec.id}`, p.pct, sec.color);
    const pctEl = document.getElementById(`pct_ssc_${sec.id}`);
    if (pctEl) pctEl.textContent = `${p.pct}%`;
    totalTopics += p.total;
    totalDone   += p.done;
  });

  // Common topics
  const commonIds = EXAM_DATA.common.map(t => t.id);
  const cp = Checklist.getProgress('common', commonIds);
  updateRing('ring_common', cp.pct, '#f59e0b');
  const cpEl = document.getElementById('pct_common');
  if (cpEl) cpEl.textContent = `${cp.pct}%`;
  totalTopics += cp.total;
  totalDone   += cp.done;

  // Global ring
  const globalPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;
  updateRing('ring_global', globalPct, '#8b5cf6');
  const gEl = document.getElementById('global-pct');
  if (gEl) gEl.textContent = `${globalPct}%`;
  const gSub = document.getElementById('global-sub');
  if (gSub) gSub.textContent = `${totalDone} / ${totalTopics} topics`;
}

// ── Streak Tracker ────────────────────────────────────────
function updateStreak() {
  const today     = new Date().toDateString();
  const lastVisit = localStorage.getItem('epdash_last_visit');
  let streak      = parseInt(localStorage.getItem('epdash_streak') || '0');

  if (lastVisit === today) {
    // Same day — no change
  } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
    streak++;
  } else {
    streak = 1;
  }

  localStorage.setItem('epdash_last_visit', today);
  localStorage.setItem('epdash_streak', streak);

  const el = document.getElementById('streak-count');
  if (el) el.textContent = `${streak} day${streak !== 1 ? 's' : ''}`;
}

// ── Smooth Scroll Nav ─────────────────────────────────────
function setupNavLinks() {
  document.querySelectorAll('[data-scroll-to]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── Reset All Data ────────────────────────────────────────
function resetAll() {
  if (!confirm('⚠️ Reset ALL progress, timetable, and scores? This cannot be undone!')) return;
  Checklist.resetAll();
  localStorage.removeItem('epdash_timetable');
  localStorage.removeItem('epdash_scores');
  localStorage.removeItem('epdash_streak');
  localStorage.removeItem('epdash_pomo_sessions');
  location.reload();
}

// ── Main Init ─────────────────────────────────────────────
const App = { updateAllProgress };

document.addEventListener('DOMContentLoaded', () => {
  renderAllSections();
  updateAllProgress();
  updateStreak();
  setupTabs();
  setupNavLinks();
  TimerModule.startCountdowns();
  TimerModule.initPomodoro();
  TimerModule.requestNotifPermission();
  Timetable.init();
  Scores.initForm();
  Calculator.init();

  // Reset button
  const resetBtn = document.getElementById('btn-reset-all');
  if (resetBtn) resetBtn.addEventListener('click', resetAll);

  // Resize chart on window resize
  window.addEventListener('resize', () => {
    setTimeout(Scores.renderChart, 100);
  });
});
