// js/otManager.js
/* global firebase, db, storage */
(function(){
  if (!window.db) return;

  const tableBody = () => document.querySelector('#scheduleTable tbody');
  const byId = id => document.getElementById(id);

  async function fetchByDate(date, statusFilter){
    let q = db.collection('otSchedules').where('surgeryDate', '==', date);
    if (statusFilter) q = q.where('status','==', statusFilter);
    const snap = await q.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function fetchRange(from, to){
    const snap = await db.collection('otSchedules').where('surgeryDate', '>=', from).where('surgeryDate','<=', to).get();
    return snap.docs.map(d => ({ id:d.id, ...d.data() }));
  }

  function renderRows(rows){
    const tb = tableBody();
    if (!tb) return;
    tb.innerHTML = '';
    for (const s of rows){
      const tr = document.createElement('tr');
      const time = `${s.startTime} - ${s.endTime}`;
      tr.innerHTML = `
        <td>${s.otId}</td>
        <td>${s.surgeryDate}</td>
        <td>${time}</td>
        <td>${s.surgeon}</td>
        <td><span class="badge status-${s.status}">${s.status}</span></td>
        <td>
          <button data-id="${s.id}" class="edit">Edit</button>
          <button data-id="${s.id}" class="cancel">Cancel</button>
          <button data-id="${s.id}" class="emerg">Emergency</button>
          ${s.surgeryReportURL ? `<a class="link" target="_blank" href="${s.surgeryReportURL}">Report</a>` : ''}
        </td>`;
      tb.appendChild(tr);
    }
    tb.querySelectorAll('button.edit').forEach(b => b.addEventListener('click', () => loadIntoForm(b.dataset.id)));
    tb.querySelectorAll('button.cancel').forEach(b => b.addEventListener('click', () => updateStatus(b.dataset.id,'Cancelled')));
    tb.querySelectorAll('button.emerg').forEach(b => b.addEventListener('click', () => updateStatus(b.dataset.id,'Emergency')));
  }

  async function loadIntoForm(id){
    const doc = await db.collection('otSchedules').doc(id).get();
    if (!doc.exists) return;
    const s = doc.data();
    byId('docId').value = id;
    ['otId','surgeryDate','startTime','endTime','surgeon','assistantSurgeon','anesthesiologist','anesthesiaType','patientId','preOpNotes','postOpNotes','remarks'].forEach(k => byId(k).value = s[k] || '');
    byId('nurses').value = (s.nurses||[]).join(', ');
    byId('materialsNeeded').value = (s.materialsNeeded||[]).join(', ');
    byId('status').value = s.status || 'Scheduled';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  async function updateStatus(id, status){
    await db.collection('otSchedules').doc(id).update({ status, updatedAt: Date.now() });
    logAction('UPDATE_STATUS', { id, status });
    const date = byId('schedule-date')?.value || byId('surgeryDate')?.value;
    if (date) loadSchedules();
  }

  async function handleSave(e){
    e.preventDefault();
    const nurses = (byId('nurses').value || '').split(',').map(s=>s.trim()).filter(Boolean);
    const materials = (byId('materialsNeeded').value || '').split(',').map(s=>s.trim()).filter(Boolean);

    const payload = {
      otId: byId('otId').value.trim(),
      surgeryDate: byId('surgeryDate').value,
      startTime: byId('startTime').value,
      endTime: byId('endTime').value,
      surgeon: byId('surgeon').value.trim(),
      assistantSurgeon: byId('assistantSurgeon').value.trim() || null,
      anesthesiologist: byId('anesthesiologist').value.trim(),
      anesthesiaType: byId('anesthesiaType').value.trim(),
      nurses,
      patientId: byId('patientId').value.trim() || null,
      preOpNotes: byId('preOpNotes').value.trim(),
      postOpNotes: byId('postOpNotes').value.trim(),
      materialsNeeded: materials,
      remarks: byId('remarks').value.trim(),
      status: byId('status').value,
      updatedAt: Date.now()
    };

    if (!payload.otId || !payload.surgeryDate) return alert('OT ID and Date are required');
    if (payload.startTime >= payload.endTime) return alert('End time must be after start time');

    const file = byId('reportFile')?.files?.[0];

    const id = byId('docId').value;
    if (id){
      await db.collection('otSchedules').doc(id).update(payload);
      if (file){
        const ref = storage.ref().child(`reports/${id}.pdf`);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        await db.collection('otSchedules').doc(id).update({ surgeryReportURL: url });
      }
      logAction('UPDATE_SCHEDULE', { id, payload });
    }else{
      payload.createdAt = Date.now();
      payload.createdBy = (window.auth?.currentUser||{}).uid || null;
      const docRef = await db.collection('otSchedules').add(payload);
      if (file){
        const ref = storage.ref().child(`reports/${docRef.id}.pdf`);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        await docRef.update({ surgeryReportURL: url });
      }
      logAction('ADD_SCHEDULE', { id: docRef.id, payload });
      byId('schedule-form').reset();
    }
    loadSchedules();
  }

  async function loadSchedules(){
    const date = byId('schedule-date')?.value || byId('surgeryDate')?.value;
    if (!date) return;
    const statusFilter = byId('statusFilter') ? byId('statusFilter').value : '';
    const rows = await fetchByDate(date, statusFilter);
    renderRows(rows);
  }

  function bind(){
    const saveForm = document.getElementById('schedule-form');
    if (saveForm) saveForm.addEventListener('submit', handleSave);
    const loadBtn = document.getElementById('loadBtn');
    if (loadBtn) loadBtn.addEventListener('click', loadSchedules);
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => document.getElementById('schedule-form').reset());
    if (byId('schedule-date')){
      byId('schedule-date').valueAsDate = new Date();
      loadSchedules();
    }
  }

  bind();
  window.OT = { fetchRange, fetchByDate };
})();