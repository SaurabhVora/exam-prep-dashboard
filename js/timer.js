// ============================================================
//  timer.js — Countdown Timers + Pomodoro Timer
// ============================================================

const TimerModule = (() => {

  // ── Exam Dates ────────────────────────────────────────────
  const EXAM_DATES = {
    ibps: new Date('2026-08-29T09:00:00'),
    ssc:  new Date('2026-09-01T09:00:00'),
  };

  // ── Countdown Engine ──────────────────────────────────────
  function startCountdowns() {
    updateCountdown('ibps');
    updateCountdown('ssc');
    setInterval(() => {
      updateCountdown('ibps');
      updateCountdown('ssc');
    }, 1000);
  }

  function updateCountdown(exam) {
    const now    = new Date();
    const target = EXAM_DATES[exam];
    const diff   = target - now;

    const elDays  = document.getElementById(`${exam}-days`);
    const elHrs   = document.getElementById(`${exam}-hours`);
    const elMins  = document.getElementById(`${exam}-mins`);
    const elSecs  = document.getElementById(`${exam}-secs`);
    const elUrg   = document.getElementById(`${exam}-urgency`);
    if (!elDays) return;

    if (diff <= 0) {
      [elDays, elHrs, elMins, elSecs].forEach(el => { if(el) el.textContent = '00'; });
      if (elUrg) { elUrg.textContent = '🎉 Exam Day!'; elUrg.style.background = 'rgba(34,197,94,0.2)'; elUrg.style.color = '#22c55e'; }
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    setTimerVal(elDays,  days);
    setTimerVal(elHrs,   hrs);
    setTimerVal(elMins,  mins);
    setTimerVal(elSecs,  secs, true);

    // Urgency color
    if (elUrg) {
      if (days > 60) {
        elUrg.textContent = '🟢 Plenty of time — stay consistent!';
        elUrg.style.background = 'rgba(34,197,94,0.12)';
        elUrg.style.color = '#22c55e';
      } else if (days > 30) {
        elUrg.textContent = '🟡 Getting closer — intensify study!';
        elUrg.style.background = 'rgba(234,179,8,0.12)';
        elUrg.style.color = '#eab308';
      } else if (days > 7) {
        elUrg.textContent = '🟠 Final stretch — revise all topics!';
        elUrg.style.background = 'rgba(249,115,22,0.12)';
        elUrg.style.color = '#f97316';
      } else {
        elUrg.textContent = '🔴 Exam imminent — stay calm & focused!';
        elUrg.style.background = 'rgba(239,68,68,0.12)';
        elUrg.style.color = '#ef4444';
      }
    }
  }

  function setTimerVal(el, val, animate = false) {
    if (!el) return;
    const str = String(val).padStart(2, '0');
    if (el.textContent !== str) {
      el.textContent = str;
      if (animate) {
        el.classList.remove('tick');
        requestAnimationFrame(() => el.classList.add('tick'));
      }
    }
  }

  // ── Pomodoro Timer ────────────────────────────────────────
  const POMO = {
    FOCUS_MINS:  25,
    BREAK_MINS:  5,
    LONG_BREAK:  15,
    MAX_SESSIONS: 8,
  };

  let pomoState = {
    mode:      'focus',   // 'focus' | 'break' | 'long-break'
    running:   false,
    seconds:   POMO.FOCUS_MINS * 60,
    sessions:  parseInt(localStorage.getItem('epdash_pomo_sessions') || '0'),
    interval:  null,
  };

  function initPomodoro() {
    renderPomoDisplay();
    renderSessions();
    bindPomoControls();
  }

  function bindPomoControls() {
    const startBtn  = document.getElementById('pomo-start');
    const resetBtn  = document.getElementById('pomo-reset');
    const skipBtn   = document.getElementById('pomo-skip');
    const focusBtn  = document.getElementById('pomo-set-focus');
    const breakBtn  = document.getElementById('pomo-set-break');

    if (startBtn) startBtn.addEventListener('click', togglePomo);
    if (resetBtn) resetBtn.addEventListener('click', resetPomo);
    if (skipBtn)  skipBtn.addEventListener('click', skipPhase);
    if (focusBtn) focusBtn.addEventListener('click', () => setMode('focus'));
    if (breakBtn) breakBtn.addEventListener('click', () => setMode('break'));
  }

  function togglePomo() {
    pomoState.running = !pomoState.running;
    const btn = document.getElementById('pomo-start');

    if (pomoState.running) {
      if (btn) btn.textContent = '⏸ Pause';
      pomoState.interval = setInterval(tickPomo, 1000);
    } else {
      if (btn) btn.textContent = '▶ Resume';
      clearInterval(pomoState.interval);
    }
  }

  function tickPomo() {
    pomoState.seconds--;
    renderPomoDisplay();

    if (pomoState.seconds <= 0) {
      clearInterval(pomoState.interval);
      pomoState.running = false;
      handlePhaseEnd();
    }
  }

  function handlePhaseEnd() {
    if (pomoState.mode === 'focus') {
      pomoState.sessions++;
      localStorage.setItem('epdash_pomo_sessions', pomoState.sessions);
      renderSessions();
      showToast('🍅 Focus session done! Take a break.', 'success');

      const isLong = pomoState.sessions % 4 === 0;
      setMode(isLong ? 'long-break' : 'break');
    } else {
      showToast('☕ Break over! Time to focus again.');
      setMode('focus');
    }

    // Browser notification if allowed
    if (Notification && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: pomoState.mode === 'focus' ? 'Break time!' : 'Back to focus!',
        icon: '🍅',
      });
    }
  }

  function setMode(mode) {
    clearInterval(pomoState.interval);
    pomoState.running = false;
    pomoState.mode    = mode;

    const mins = mode === 'focus' ? POMO.FOCUS_MINS
               : mode === 'break' ? POMO.BREAK_MINS
               : POMO.LONG_BREAK;
    pomoState.seconds = mins * 60;

    const btn = document.getElementById('pomo-start');
    if (btn) btn.textContent = '▶ Start';

    const modeLabel = document.getElementById('pomo-mode');
    if (modeLabel) {
      modeLabel.textContent = mode === 'focus' ? '🍅 Focus Session'
                             : mode === 'break' ? '☕ Short Break'
                             : '🌙 Long Break';
    }

    renderPomoDisplay();
    updatePomoRing();
  }

  function resetPomo() {
    clearInterval(pomoState.interval);
    pomoState.running = false;
    const mins = pomoState.mode === 'focus' ? POMO.FOCUS_MINS
               : pomoState.mode === 'break' ? POMO.BREAK_MINS
               : POMO.LONG_BREAK;
    pomoState.seconds = mins * 60;
    const btn = document.getElementById('pomo-start');
    if (btn) btn.textContent = '▶ Start';
    renderPomoDisplay();
    updatePomoRing();
  }

  function skipPhase() {
    clearInterval(pomoState.interval);
    pomoState.running = false;
    pomoState.seconds = 0;
    handlePhaseEnd();
  }

  function renderPomoDisplay() {
    const m = Math.floor(pomoState.seconds / 60);
    const s = pomoState.seconds % 60;
    const display = document.getElementById('pomo-display');
    if (display) {
      display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
    updatePomoRing();
  }

  function updatePomoRing() {
    const ring = document.getElementById('pomo-ring-progress');
    if (!ring) return;
    const totalMins = pomoState.mode === 'focus' ? POMO.FOCUS_MINS
                    : pomoState.mode === 'break' ? POMO.BREAK_MINS
                    : POMO.LONG_BREAK;
    const totalSecs = totalMins * 60;
    const pct = pomoState.seconds / totalSecs;
    const circumference = 2 * Math.PI * 90; // r=90
    ring.style.strokeDashoffset = circumference * (1 - pct);
    ring.style.strokeDasharray  = circumference;

    const color = pomoState.mode === 'focus' ? '#8b5cf6'
                : pomoState.mode === 'break' ? '#06b6d4'
                : '#10b981';
    ring.style.stroke = color;
  }

  function renderSessions() {
    const container = document.getElementById('pomo-sessions');
    if (!container) return;
    container.innerHTML = '';
    const total = Math.max(POMO.MAX_SESSIONS, pomoState.sessions);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = `session-dot ${i < pomoState.sessions ? 'done' : ''}`;
      container.appendChild(dot);
    }
  }

  // Request notification permission
  function requestNotifPermission() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  return { startCountdowns, initPomodoro, requestNotifPermission };
})();
