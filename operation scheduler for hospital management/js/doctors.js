// js/doctors.js
(function(){
  if (!window.db) return;
  const byId = id => document.getElementById(id);
  const tbody = document.querySelector('#doctorsTable tbody');

  async function list(){
    const snap = await db.collection('doctors').get();
    tbody.innerHTML='';
    for (const d of snap.docs){
      const x = { id: d.id, ...d.data() };
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${x.name}</td><td>${x.speciality}</td><td>${x.phone||''}</td>
        <td><button class='edit' data-id='${x.id}'>Edit</button>
            <button class='del' data-id='${x.id}'>Delete</button></td>`;
      tbody.appendChild(tr);
    }
    tbody.querySelectorAll('button.edit').forEach(b=>b.addEventListener('click',()=>load(b.dataset.id)));
    tbody.querySelectorAll('button.del').forEach(b=>b.addEventListener('click',()=>remove(b.dataset.id)));
  }
  async function load(id){
    const doc = await db.collection('doctors').doc(id).get();
    const v = doc.data();
    byId('docId').value = id;
    byId('name').value = v.name||'';
    byId('speciality').value = v.speciality||'';
    byId('phone').value = v.phone||'';
  }
  async function remove(id){
    await db.collection('doctors').doc(id).delete();
    logAction('DELETE_DOCTOR', { id });
    list();
  }
  document.getElementById('doctorForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      name: byId('name').value.trim(),
      speciality: byId('speciality').value.trim(),
      phone: byId('phone').value.trim() || null
    };
    const id = byId('docId').value;
    if (id){
      await db.collection('doctors').doc(id).update(payload);
      logAction('UPDATE_DOCTOR', { id, payload });
    }else{
      const ref = await db.collection('doctors').add(payload);
      logAction('ADD_DOCTOR', { id: ref.id, payload });
    }
    e.target.reset();
    list();
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    document.getElementById('doctorForm').reset();
    byId('docId').value='';
  });
  list();
})();