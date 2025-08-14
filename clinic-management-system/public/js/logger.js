// Simple logger: console + Firestore 'logs' collection
import { db, auth } from './firebase.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function write(level, event, payload) {
  const uid = auth.currentUser?.uid || null;
  const entry = {
    ts: Date.now(),
    uid,
    level,
    event,
    payload: payload || null
  };
  try {
    console[level === 'error' ? 'error' : 'log']('[LOG]', entry);
    await addDoc(collection(db, 'logs'), entry);
  } catch (e) {
    console.error('Failed to persist log', e);
  }
}

export const logInfo = (event, payload) => write('info', event, payload);
export const logWarn = (event, payload) => write('warn', event, payload);
export const logError = (event, payload) => write('error', event, payload);
