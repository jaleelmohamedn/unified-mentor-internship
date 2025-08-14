// js/utils.js
window.Utils = {
  toArrayCSV(str){ return (str||'').split(',').map(s => s.trim()).filter(Boolean); },
  isTimeRangeValid(start, end){ return start < end; },
  durationMinutes(start, end){
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh*60+em) - (sh*60+sm);
  }
};