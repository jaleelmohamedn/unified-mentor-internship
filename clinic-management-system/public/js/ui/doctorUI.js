import { auth } from '../firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getWaitingList } from '../services/tokensService.js';
import { recordPrescription } from '../services/prescriptionsService.js';
import { logError } from '../logger.js';

const waitingList = document.getElementById('waitingList');
const examForm = document.getElementById('examForm');
const msg = document.getElementById('examMsg');
const doctorEmail = document.getElementById('doctorEmail');

onAuthStateChanged(auth, (user)=>{
  doctorEmail.textContent = user?.email || 'Guest';
  if(!user) msg.textContent = 'Please login via Auth page.';
  refreshWaiting();
});

async function refreshWaiting(){
  const list = await getWaitingList(50);
  waitingList.innerHTML = list.map(item => `<li>#${item.token} — PatientID: ${item.patientId} — ${new Date(item.createdAt).toLocaleString()}</li>`).join('');
}

examForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  try{
    const patientId = document.getElementById('patientId').value.trim();
    const diagnosis = document.getElementById('diagnosis').value.trim();
    const items = document.getElementById('prescription').value.split(',').map(s=>s.trim()).filter(Boolean);
    await recordPrescription({ patientId, diagnosis, items });
    msg.textContent = 'Saved and sent to reception for billing.';
    examForm.reset();
    await refreshWaiting();
  }catch(err){
    logError('doctor.exam.error', { message: err.message });
    msg.textContent = err.message;
  }
});
