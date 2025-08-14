// js/patients.js
(function(){
  if (!window.db) return;
  const byId = id => document.getElementById(id);
  const tbody = document.querySelector('#patientsTable tbody');

  async function list(){
    const snap = await db.collection('patients').get();
    tbody.innerHTML='';
    for (const d of snap.docs){
      const x = { id: d.id, ...d.data() };
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${x.name}</td><td>${x.mrn}</td><td>${x.age||''}</td><td>${x.sex||''}</td><td>${x.phone||''}</td>
        <td><button class='edit' data-id='${x.id}'>Edit</button>
            <button class='del' data-id='${x.id}'>Delete</button></td>`;
      tbody.appendChild(tr);
    }
    tbody.querySelectorAll('button.edit').forEach(b=>b.addEventListener('click',()=>load(b.dataset.id)));
    tbody.querySelectorAll('button.del').forEach(b=>b.addEventListener('click',()=>remove(b.dataset.id)));
  }
  async function load(id){
    const doc = await db.collection('patients').doc(id).get();
    const v = doc.data();
    byId('patId').value = id;
    byId('pname').value = v.name||'';
    byId('mrn').value = v.mrn||'';
    byId('age').value = v.age||'';
    byId('sex').value = v.sex||'';
    byId('pphone').value = v.phone||'';
  }
  async function remove(id){
    await db.collection('patients').doc(id).delete();
    logAction('DELETE_PATIENT', { id });
    list();
  }
  document.getElementById('patientForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      name: byId('pname').value.trim(),
      mrn: byId('mrn').value.trim(),
      age: Number(byId('age').value) || null,
      sex: byId('sex').value || null,
      phone: byId('pphone').value.trim() || null
    };
    const id = byId('patId').value;
    if (id){
      await db.collection('patients').doc(id).update(payload);
      logAction('UPDATE_PATIENT', { id, payload });
    }else{
      const ref = await db.collection('patients').add(payload);
      logAction('ADD_PATIENT', { id: ref.id, payload });
    }
    e.target.reset();
    list();
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    document.getElementById('patientForm').reset();
    byId('patId').value='';
  });
  list();
})();