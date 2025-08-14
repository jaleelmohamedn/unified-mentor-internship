import { auth } from '../firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { createPatient } from '../services/patientsService.js';
import { nextToken, enqueuePatient } from '../services/tokensService.js';
import { createBill } from '../services/billingService.js';
import { logError } from '../logger.js';

const emailSpan = document.getElementById('receptionistEmail');
const form = document.getElementById('newPatientForm');
const msg = document.getElementById('newPatientMsg');
const billForm = document.getElementById('billForm');
const billMsg = document.getElementById('billMsg');

onAuthStateChanged(auth, (user)=>{
  emailSpan.textContent = user?.email || 'Guest';
  if(!user) msg.textContent = 'Please login via Auth page.';
});

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  try{
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const pat = await createPatient({ fullName, phone, age, gender });
    const token = await nextToken();
    await enqueuePatient(pat.id, token);
    msg.textContent = `Created patient ${pat.fullName} with ID ${pat.id}. Token: #${token}`;
    form.reset();
  }catch(err){
    logError('reception.newpatient.error', { message: err.message });
    msg.textContent = err.message;
  }
});

billForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  try{
    const patientId = document.getElementById('billPatientId').value.trim();
    const base = document.getElementById('baseFee').value;
    const meds = document.getElementById('medFee').value;
    const other = document.getElementById('otherFee').value || 0;
    const bill = await createBill(patientId, { base, meds, other });
    billMsg.textContent = `Bill created: Total ₹${bill.total}`;
    billForm.reset();
  }catch(err){
    logError('reception.bill.error', { message: err.message });
    billMsg.textContent = err.message;
  }
});
