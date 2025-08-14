// js/firebase-config.js
// Add Firebase SDKs via script tags (example):
// <script src="https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.4/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.4/firebase-storage-compat.js"></script>

if (typeof firebase === 'undefined') { console.error('Firebase SDK not loaded. Add the <script> tags.'); }

// REPLACE with your Firebase project's config from console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  window.storage = firebase.storage();
}
