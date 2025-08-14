import { db } from '../firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { newId } from '../utils/id.js';
import { logInfo } from '../logger.js';

export async function createPatient({ fullName, phone, age, gender }){
  const id = newId('pat');
  const data = { id, fullName, phone, age: Number(age), gender, createdAt: Date.now(), history: [] };
  await setDoc(doc(db, 'patients', id), data);
  logInfo('patient.create', { id, phone });
  return data;
}

export async function getPatient(id){
  const snap = await getDoc(doc(db, 'patients', id));
  return snap.exists() ? snap.data() : null;
}

export async function appendHistory(id, entry){
  const pat = await getPatient(id);
  if(!pat) throw new Error('Patient not found');
  pat.history = pat.history || [];
  pat.history.push({ ...entry, ts: Date.now() });
  await setDoc(doc(db, 'patients', id), pat);
  logInfo('patient.history.append', { id });
  return pat;
}
