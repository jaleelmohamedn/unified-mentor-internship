import { db } from '../firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { appendHistory } from './patientsService.js';
import { logInfo } from '../logger.js';

export async function recordPrescription({ patientId, diagnosis, items }){
  const data = { patientId, diagnosis, items, createdAt: Date.now() };
  await addDoc(collection(db, 'prescriptions'), data);
  await appendHistory(patientId, { diagnosis, items });
  logInfo('prescription.create', { patientId });
  return data;
}
