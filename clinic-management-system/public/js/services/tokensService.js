import { db } from '../firebase.js';
import { doc, runTransaction, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logInfo } from '../logger.js';

const COUNTER_ID = 'global_token_counter';

export async function nextToken(){
  const counterRef = doc(db, 'counters', COUNTER_ID);
  const tokenNum = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const curr = snap.exists() ? (snap.data().value || 0) : 0;
    const next = curr + 1;
    tx.set(counterRef, { value: next }, { merge: true });
    return next;
  });
  logInfo('token.next', { token: tokenNum });
  return tokenNum;
}

export async function enqueuePatient(patientId, token){
  const data = { patientId, token, status: 'waiting', createdAt: Date.now() };
  await addDoc(collection(db, 'queue'), data);
  logInfo('queue.enqueue', { patientId, token });
  return data;
}

export async function getWaitingList(limitN = 20){
  const q = query(collection(db, 'queue'), orderBy('token', 'asc'), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
