// ============================================================
//  timetable.js — Daily Study Timetable Builder
// ============================================================

const Timetable = (() => {
  const STORAGE_KEY = 'epdash_timetable';
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const TIME_SLOTS = [
    '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
    '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM',
  ];
  const SUBJECT_COLORS = {
    'reasoning': { bg:'rgba(139,92,246,0.25)', border:'#8b5cf6', text:'#c4b5fd' },
    'quant':     { bg:'rgba(6,182,212,0.25)',  border:'#06b6d4', text:'#67e8f9' },
    'english':   { bg:'rgba(34,197,94,0.25)',  border:'#22c55e', text:'#86efac' },
    'gk':        { bg:'rgba(245,158,11,0.25)', border:'#f59e0b', text:'#fcd34d' },
    'revision':  { bg:'rgba(236,72,153,0.25)', border:'#ec4899', text:'#f9a8d4' },
    'mock-test': { bg:'rgba(239,68,68,0.25)',  border:'#ef4444', text:'#fca5a5' },
    'break':     { bg:'rgba(255,255,255,0.06)',border:'rgba(255,255,255,0.2)', text:'#94a3b8' },
    'other':     { bg:'rgba(99,102,241,0.25)', border:'#6366f1', text:'#a5b4fc' },
  };

  let schedule = load();
  let modalTarget = null;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule)); }

  function render() {
    const container = document.getElementById('timetable-grid');
    if (!container) return;
    let html = `<div class="tt-header-cell">Time</div>`;
    DAYS.forEach(day => {
      const isToday = isCurrentDay(day);
      html += `<div class="tt-header-cell" style="${isToday?'color:#8b5cf6;border:1px solid rgba(139,92,246,0.4);':''}">${day}${isToday?' 📍':''}</div>`;
    });
    TIME_SLOTS.forEach((time, slotIdx) => {
      html += `<div class="tt-time-cell">${time}</div>`;
      DAYS.forEach((day, dayIdx) => {
        const key = `${dayIdx}_${slotIdx}`;
        const entry = schedule[key];
        if (entry) {
          const c = SUBJECT_COLORS[entry.subject] || SUBJECT_COLORS['other'];
          html += `<div class="tt-slot filled" data-day="${dayIdx}" data-slot="${slotIdx}" style="background:${c.bg};border:1px solid ${c.border};color:${c.text};" onclick="Timetable.openEditModal(${dayIdx},${slotIdx})"><span class="tt-slot-delete" onclick="event.stopPropagation();Timetable.deleteSlot(${dayIdx},${slotIdx})">&#x2715;</span><span class="tt-slot-label">${entry.label}</span></div>`;
        } else {
          html += `<div class="tt-slot" data-day="${dayIdx}" data-slot="${slotIdx}" onclick="Timetable.openAddModal(${dayIdx},${slotIdx})" title="Click to add study session"><span style="opacity:0.25;font-size:18px;">+</span></div>`;
        }
      });
    });
    container.innerHTML = html;
    highlightCurrentSlot();
  }

  function highlightCurrentSlot() {
    const now = new Date();
    const hour = now.getHours();
    const slotIdx = TIME_SLOTS.findIndex(t => {
      const h = parseInt(t);
      const isPM = t.includes('PM') && h !== 12;
      const h24 = isPM ? h+12 : (t.includes('AM') && h===12 ? 0 : h);
      return h24 === hour;
    });
    const dayIdx = (now.getDay()+6)%7;
    if (slotIdx >= 0) {
      const el = document.querySelector(`[data-day="${dayIdx}"][data-slot="${slotIdx}"]`);
      if (el && !schedule[`${dayIdx}_${slotIdx}`]) { el.style.borderColor='rgba(139,92,246,0.5)'; el.style.background='rgba(139,92,246,0.05)'; }
    }
  }

  function isCurrentDay(day) {
    const jsDay = new Date().getDay();
    const dayMap = { Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6, Sun:0 };
    return dayMap[day] === jsDay;
  }

  function openAddModal(dayIdx, slotIdx) {
    modalTarget = { dayIdx, slotIdx };
    const modal = document.getElementById('tt-modal');
    const title = document.getElementById('tt-modal-title');
    if (!modal) return;
    if (title) title.textContent = `Add Session — ${DAYS[dayIdx]}, ${TIME_SLOTS[slotIdx]}`;
    document.getElementById('tt-label').value = '';
    document.getElementById('tt-subject').value = 'reasoning';
    modal.classList.add('open');
  }

  function openEditModal(dayIdx, slotIdx) {
    const entry = schedule[`${dayIdx}_${slotIdx}`];
    if (!entry) return openAddModal(dayIdx, slotIdx);
    modalTarget = { dayIdx, slotIdx };
    const modal = document.getElementById('tt-modal');
    const title = document.getElementById('tt-modal-title');
    if (!modal) return;
    if (title) title.textContent = `Edit — ${DAYS[dayIdx]}, ${TIME_SLOTS[slotIdx]}`;
    document.getElementById('tt-label').value = entry.label;
    document.getElementById('tt-subject').value = entry.subject;
    modal.classList.add('open');
  }

  function closeModal() {
    const modal = document.getElementById('tt-modal');
    if (modal) modal.classList.remove('open');
    modalTarget = null;
  }

  function saveFromModal() {
    if (!modalTarget) return;
    const label = document.getElementById('tt-label').value.trim();
    const subject = document.getElementById('tt-subject').value;
    if (!label) { showToast('⚠️ Please enter a session label'); return; }
    schedule[`${modalTarget.dayIdx}_${modalTarget.slotIdx}`] = { label, subject };
    save(); closeModal(); render();
    showToast('📅 Study session saved!', 'success');
  }

  function deleteSlot(dayIdx, slotIdx) {
    delete schedule[`${dayIdx}_${slotIdx}`];
    save(); render();
  }

  function clearWeek() {
    if (!confirm('Clear all sessions this week?')) return;
    schedule = {}; save(); render();
    showToast('🗑️ Timetable cleared');
  }

  function init() {
    render();
    const saveBtn = document.getElementById('tt-modal-save');
    const closeBtn = document.getElementById('tt-modal-close');
    const clearBtn = document.getElementById('tt-clear');
    if (saveBtn) saveBtn.addEventListener('click', saveFromModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (clearBtn) clearBtn.addEventListener('click', clearWeek);
    const modal = document.getElementById('tt-modal');
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  return { init, render, openAddModal, openEditModal, deleteSlot };
})();
