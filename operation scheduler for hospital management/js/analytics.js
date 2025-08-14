// js/analytics.js
(function(){
  if (!window.db) return;
  async function run(){
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;
    if (!from || !to) return alert('Select date range');
    const snap = await db.collection('otSchedules').where('surgeryDate','>=',from).where('surgeryDate','<=',to).get();
    const rows = snap.docs.map(d => d.data());

    const total = rows.length;
    const byStatus = rows.reduce((m, r)=>{ m[r.status] = (m[r.status]||0)+1; return m; },{});
    const byOT = rows.reduce((m, r)=>{ m[r.otId] = (m[r.otId]||0)+1; return m; },{});
    const bySurgeon = rows.reduce((m, r)=>{ m[r.surgeon] = (m[r.surgeon]||0)+1; return m; },{});

    const res = document.getElementById('results');
    res.innerHTML = `
      <div class='card'><h3>Total Surgeries</h3><p>${total}</p></div>
      <div class='card'><h3>By Status</h3><pre>${JSON.stringify(byStatus, null, 2)}</pre></div>
      <div class='card'><h3>By OT</h3><pre>${JSON.stringify(byOT, null, 2)}</pre></div>
      <div class='card'><h3>By Surgeon</h3><pre>${JSON.stringify(bySurgeon, null, 2)}</pre></div>
    `;
    logAction('RUN_ANALYTICS', { from, to, totals: { total } });
  }
  document.getElementById('run').addEventListener('click', run);
})();