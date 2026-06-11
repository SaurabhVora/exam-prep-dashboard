// ============================================================
//  checklist.js — Topic Checklists, Revision Counter, Difficulty
// ============================================================

const Checklist = (() => {

  // ── State Keys ──────────────────────────────────────────
  const KEYS = {
    completed: 'epdash_completed',
    revisions: 'epdash_revisions',
    difficulty: 'epdash_difficulty',
  };

  // ── Load / Save ──────────────────────────────────────────
  const load = (key) => JSON.parse(localStorage.getItem(key) || '{}');
  const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  let completed  = load(KEYS.completed);
  let revisions  = load(KEYS.revisions);
  let difficulty = load(KEYS.difficulty);

  // ── Toggle Completion ─────────────────────────────────────
  function toggleTopic(topicId, el) {
    completed[topicId] = !completed[topicId];
    save(KEYS.completed, completed);
    updateTopicUI(topicId, el);

    if (completed[topicId]) {
      fireConfetti(el);
      showToast('✅ Topic marked as done!', 'success');
    }

    App.updateAllProgress();
  }

  // ── Increment Revision ────────────────────────────────────
  function incrementRevision(topicId, el) {
    revisions[topicId] = ((revisions[topicId] || 0) + 1) % 4; // 0→3 cycles
    save(KEYS.revisions, revisions);
    const count = revisions[topicId];
    const btn = el.querySelector(`[data-rev="${topicId}"]`);
    if (btn) {
      btn.textContent = count === 0 ? '🔁 0×' : `🔁 ${count}×`;
      btn.style.color = count >= 3 ? '#22c55e' : count >= 2 ? '#eab308' : '';
    }
    if (count > 0) showToast(`📖 Revised ${count}× — keep it up!`);
  }

  // ── Set Difficulty ────────────────────────────────────────
  function setDifficulty(topicId, level, starEls) {
    difficulty[topicId] = level;
    save(KEYS.difficulty, difficulty);
    starEls.forEach((star, i) => {
      star.classList.toggle('active', i < level);
    });
  }

  // ── Update Single Topic UI ────────────────────────────────
  function updateTopicUI(topicId, row) {
    const isDone = completed[topicId];
    row.classList.toggle('completed', isDone);
  }

  // ── Build Topic Row HTML ──────────────────────────────────
  function buildTopicHTML(topic, exam) {
    const id = `${exam}_${topic.id}`;
    const isDone = !!completed[id];
    const rev    = revisions[id] || 0;
    const diff   = difficulty[id] || 0;

    const priorityClass = {
      'very-high': 'priority-vh',
      'high':      'priority-h',
      'moderate':  'priority-m',
      'low':       'priority-l',
    }[topic.priority] || 'priority-m';

    const priorityLabel = {
      'very-high': '🔴 Very High',
      'high':      '🟠 High',
      'moderate':  '🟡 Moderate',
      'low':       '🟢 Low',
    }[topic.priority] || topic.priority;

    const stars = [1,2,3].map(n =>
      `<span class="diff-star ${diff >= n ? 'active' : ''}"
             data-star-id="${id}" data-level="${n}">⭐</span>`
    ).join('');

    return `
      <div class="topic-item ${isDone ? 'completed' : ''}"
           id="row_${id}"
           data-topic-id="${id}"
           data-exam="${exam}">
        <div class="topic-checkbox" data-check="${id}">
          <span class="checkmark">✓</span>
        </div>
        <div>
          <div class="topic-name">${topic.name}</div>
          <div class="topic-questions">${topic.questions} questions</div>
        </div>
        <div class="priority-badge ${priorityClass}">${priorityLabel}</div>
        <div class="topic-actions">
          <div class="difficulty-stars" data-difficulty="${id}">
            ${stars}
          </div>
          <button class="revision-btn" data-rev="${id}">
            🔁 ${rev > 0 ? rev + '×' : '0×'}
          </button>
        </div>
      </div>`;
  }

  // ── Render Topic List Into Container ─────────────────────
  function renderSection(containerId, topics, exam) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = topics.map(t => buildTopicHTML(t, exam)).join('');
    attachListeners(container, exam);
  }

  // ── Attach Event Listeners ────────────────────────────────
  function attachListeners(container, exam) {
    // Checkbox toggle
    container.querySelectorAll('[data-check]').forEach(checkEl => {
      const topicId = checkEl.dataset.check;
      checkEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = document.getElementById(`row_${topicId}`);
        toggleTopic(topicId, row);
      });
    });

    // Entire row click also toggles
    container.querySelectorAll('.topic-item').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-rev]') ||
            e.target.closest('[data-star-id]') ||
            e.target.closest('.topic-checkbox')) return;
        const topicId = row.dataset.topicId;
        toggleTopic(topicId, row);
      });
    });

    // Revision button
    container.querySelectorAll('[data-rev]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.dataset.rev;
        const row = document.getElementById(`row_${topicId}`);
        incrementRevision(topicId, row);
      });
    });

    // Difficulty stars
    container.querySelectorAll('[data-star-id]').forEach(star => {
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = star.dataset.starId;
        const level   = parseInt(star.dataset.level);
        const allStars = container.querySelectorAll(`[data-star-id="${topicId}"]`);
        setDifficulty(topicId, level, allStars);
      });
    });
  }

  // ── Get Progress for an Exam/Section ─────────────────────
  function getProgress(exam, topicIds) {
    const total = topicIds.length;
    const done  = topicIds.filter(id => completed[`${exam}_${id}`]).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  // ── Reset All ─────────────────────────────────────────────
  function resetAll() {
    completed  = {};
    revisions  = {};
    difficulty = {};
    save(KEYS.completed, completed);
    save(KEYS.revisions, revisions);
    save(KEYS.difficulty, difficulty);
  }

  return { renderSection, getProgress, toggleTopic, resetAll };
})();


// ── Confetti Micro-burst ─────────────────────────────────
function fireConfetti(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const colors = ['#8b5cf6','#06b6d4','#f59e0b','#22c55e','#ec4899','#a78bfa'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = `
      left: ${rect.left + Math.random() * rect.width}px;
      top:  ${rect.top + window.scrollY}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      transform: rotate(${Math.random() * 360}deg);
      animation-delay: ${Math.random() * 0.3}s;
      animation-duration: ${0.6 + Math.random() * 0.4}s;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

// ── Toast Notification ────────────────────────────────────
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.borderColor = type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.15)';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}
