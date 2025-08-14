import { auth, db } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { logInfo, logError } from './logger.js';

const regForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const msg = document.getElementById('authMsg');

regForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', user.uid), { email, role, createdAt: Date.now() });
    msg.textContent = 'Registered successfully. You can now log in.';
    logInfo('user.register', { uid: user.uid, email, role });
  } catch (err) {
    logError('user.register.error', { message: err.message });
    msg.textContent = err.message;
  }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const roleSnap = await getDoc(doc(db, 'users', user.uid));
    const role = roleSnap.exists() ? roleSnap.data().role : 'receptionist';
    msg.textContent = `Welcome ${email}. Redirecting to ${role} workspace...`;
    logInfo('user.login', { uid: user.uid, email, role });
    setTimeout(()=>{
      if (role === 'doctor') location.href = './doctor.html';
      else location.href = './receptionist.html';
    }, 600);
  } catch (err) {
    logError('user.login.error', { message: err.message });
    msg.textContent = err.message;
  }
});

onAuthStateChanged(auth, (user) => {
  // No-op here; pages use their own listeners.
});
