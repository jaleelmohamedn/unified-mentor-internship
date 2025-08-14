// js/logger.js
window.logAction = async function(actionType, details){
  try{
    const user = (window.auth && window.auth.currentUser) ? window.auth.currentUser.email : 'anonymous';
    await window.db.collection('logs').add({
      actionType,
      details,
      user,
      timestamp: Date.now()
    });
  }catch(e){
    console.error('Log error', e);
  }
};