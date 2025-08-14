// js/auth.js
(function(){
  if (!window.auth) return;
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn){
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'login.html';
    });
  }

  // Login page
  const loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = 'dashboard.html';
    });
  }

  // Register page
  const registerForm = document.getElementById('registerForm');
  if (registerForm){
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;
      const res = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection('users').doc(res.user.uid).set({ email, role });
      window.location.href = 'dashboard.html';
    });
  }
})();