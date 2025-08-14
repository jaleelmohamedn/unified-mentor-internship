import { db } from '../firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logInfo } from '../logger.js';

export async function createBill(patientId, { base, meds, other }){
  const total = Number(base) + Number(meds) + Number(other || 0);
  const data = { patientId, base: Number(base), meds: Number(meds), other: Number(other||0), total, createdAt: Date.now() };
  await setDoc(doc(db, 'billing', patientId), data);
  logInfo('billing.create', { patientId, total });
  return data;
}
