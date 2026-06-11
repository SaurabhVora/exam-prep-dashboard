// ============================================================
//  scores.js — Mock Test Score Logger + Cut-off Calculator
// ============================================================

const Scores = (() => {
  const STORAGE_KEY = 'epdash_scores';
  let entries = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

  function addEntry(exam, score, maxScore, date) {
    entries.push({ exam, score: parseFloat(score), maxScore: parseFloat(maxScore), date, id: Date.now() });
    entries.sort((a,b) => new Date(a.date) - new Date(b.date));
    save(); renderList(); renderChart();
    showToast('📊 Score logged successfully!', 'success');
  }

  function deleteEntry(id) {
    entries = entries.filter(e => e.id !== id);
    save(); renderList(); renderChart();
  }

  function renderList() {
    const container = document.getElementById('score-list');
    if (!container) return;
    if (entries.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:3rem;margin-bottom:12px;">📊</div><div>No scores logged yet. Add your first mock test result!</div></div>`;
      return;
    }
    container.innerHTML = [...entries].reverse().map(e => {
      const pct = Math.round((e.score / e.maxScore) * 100);
      const isIBPS = e.exam === 'ibps';
      const target = isIBPS ? 60 : 120;
      const pass = e.score >= target;
      const examLabel = isIBPS ? 'IBPS SO' : 'SSC CGL';
      const color = isIBPS ? '#8b5cf6' : '#06b6d4';
      const passColor = pass ? '#22c55e' : '#ef4444';
      return `<div class="score-entry-row"><div class="score-entry-date">📅 ${new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div><div class="score-entry-exam" style="color:${color}">${examLabel}</div><div style="flex:1;padding:0 12px;"><div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${color};border-radius:3px;"></div></div></div><div class="score-entry-score" style="color:${color}">${e.score}/${e.maxScore}</div><div style="font-size:12px;font-weight:700;color:${passColor};padding:3px 10px;background:${passColor}20;border-radius:100px;border:1px solid ${passColor}40;">${pass ? '✅ Pass' : '❌ Below Target'}</div><button onclick="Scores.deleteEntry(${e.id})" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-muted);padding:4px;">🗑️</button></div>`;
    }).join('');
  }

  function renderChart() {
    const canvas = document.getElementById('score-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 600;
    const H = canvas.offsetHeight || 200;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    if (entries.length < 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.font = '14px Inter'; ctx.textAlign = 'center';
      ctx.fillText('Add at least 2 scores to see the trend chart', W/2, H/2); return;
    }
    const ibpsEntries = entries.filter(e => e.exam === 'ibps');
    const sscEntries  = entries.filter(e => e.exam === 'ssc');
    const allPcts = entries.map(e => (e.score / e.maxScore) * 100);
    const minPct  = Math.max(0,  Math.min(...allPcts) - 10);
    const maxPct  = Math.min(100, Math.max(...allPcts) + 10);
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top  - pad.bottom;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (cH * i / 4);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px Inter'; ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(maxPct - ((maxPct-minPct)*i/4))}%`, pad.left-8, y+4);
    }
    function drawLine(data, color) {
      if (data.length < 2) return;
      const pcts = data.map(e => (e.score / e.maxScore) * 100);
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
      pcts.forEach((p, i) => {
        const x = pad.left + (cW * i / (pcts.length-1));
        const y = pad.top  + cH * (1 - (p-minPct)/(maxPct-minPct));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }); ctx.stroke();
      pcts.forEach((p, i) => {
        const x = pad.left + (cW * i / (pcts.length-1));
        const y = pad.top  + cH * (1 - (p-minPct)/(maxPct-minPct));
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI*2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = '#050510'; ctx.lineWidth = 2; ctx.stroke();
      });
    }
    drawLine(ibpsEntries, '#8b5cf6'); drawLine(sscEntries, '#06b6d4');
    ctx.fillStyle = '#8b5cf6'; ctx.fillRect(pad.left, H-20, 14, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Inter'; ctx.textAlign = 'left';
    ctx.fillText('IBPS SO', pad.left+18, H-15);
    ctx.fillStyle = '#06b6d4'; ctx.fillRect(pad.left+80, H-20, 14, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillText('SSC CGL', pad.left+98, H-15);
  }

  function initForm() {
    const form = document.getElementById('score-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const exam = document.getElementById('score-exam').value;
      const score = parseFloat(document.getElementById('score-value').value);
      const maxScore = exam === 'ibps' ? 125 : 200;
      const date = document.getElementById('score-date').value;
      if (isNaN(score) || score < 0 || score > maxScore) { showToast(`⚠️ Score must be between 0 and ${maxScore}`); return; }
      if (!date) { showToast('⚠️ Please select a date'); return; }
      addEntry(exam, score, maxScore, date);
      form.reset();
      document.getElementById('score-date').value = new Date().toISOString().split('T')[0];
    });
    const dateInput = document.getElementById('score-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    renderList();
    setTimeout(renderChart, 100);
  }

  return { initForm, renderList, renderChart, addEntry, deleteEntry };
})();

// ============================================================
//  Cut-off Calculator
// ============================================================
const Calculator = (() => {
  const CUT_OFFS = {
    ibps: { overall: { general: 65, pwbd: 55.88 } },
    ssc:  { overall: { general: 148.27, pwbd: 113.10 } }
  };

  function calculate() {
    const exam = document.getElementById('calc-exam').value;
    const attempted = parseInt(document.getElementById('calc-attempted').value) || 0;
    const correct   = parseInt(document.getElementById('calc-correct').value)   || 0;
    const wrong = attempted - correct;
    const negMark   = exam === 'ibps' ? 0.25 : 0.50;
    const marksPerQ = exam === 'ibps' ? 1 : 2;
    const totalMarks= exam === 'ibps' ? 125 : 200;
    const gross = correct * marksPerQ;
    const deducted = wrong * negMark;
    const net = Math.max(0, gross - deducted);
    const pct = Math.round((net / totalMarks) * 100);
    const cutoffs = CUT_OFFS[exam];
    const passGen  = net >= cutoffs.overall.general;
    const passPwBD = net >= cutoffs.overall.pwbd;
    const resultEl = document.getElementById('calc-result');
    const scoreEl  = document.getElementById('calc-score-display');
    const statusEl = document.getElementById('calc-status');
    const breakEl  = document.getElementById('calc-breakdown');
    if (!resultEl) return;
    resultEl.className = `calc-result ${passPwBD ? 'pass' : 'fail'}`;
    if (scoreEl) { scoreEl.textContent = net.toFixed(2); scoreEl.style.color = passPwBD ? '#22c55e' : '#ef4444'; }
    if (statusEl) statusEl.innerHTML = passPwBD ? `✅ Clears PwBD cut-off! ${passGen ? '🎉 Also clears General cut-off!' : `⚠️ ${(cutoffs.overall.general-net).toFixed(2)} marks short of General`}` : `❌ Below PwBD cut-off by <strong>${(cutoffs.overall.pwbd-net).toFixed(2)}</strong> marks`;
    if (breakEl) breakEl.innerHTML = `<div class="calc-breakdown-item"><div class="calc-breakdown-value" style="color:#22c55e">+${gross}</div><div class="calc-breakdown-label">Gross Marks</div></div><div class="calc-breakdown-item"><div class="calc-breakdown-value" style="color:#ef4444">-${deducted.toFixed(2)}</div><div class="calc-breakdown-label">Negative Marks</div></div><div class="calc-breakdown-item"><div class="calc-breakdown-value">${wrong}</div><div class="calc-breakdown-label">Wrong Answers</div></div><div class="calc-breakdown-item"><div class="calc-breakdown-value">${pct}%</div><div class="calc-breakdown-label">Score %</div></div><div class="calc-breakdown-item"><div class="calc-breakdown-value" style="color:#8b5cf6">${cutoffs.overall.pwbd}</div><div class="calc-breakdown-label">PwBD Target</div></div><div class="calc-breakdown-item"><div class="calc-breakdown-value" style="color:#06b6d4">${cutoffs.overall.general}</div><div class="calc-breakdown-label">General Target</div></div>`;
  }

  function init() {
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) calcBtn.addEventListener('click', calculate);
    ['calc-exam','calc-attempted','calc-correct'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calculate);
    });
    calculate();
  }

  return { init, calculate };
})();
