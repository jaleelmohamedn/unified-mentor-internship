export function nonEmpty(str){ return typeof str === 'string' && str.trim().length > 0; }
export function isPhone(str){ return /^[0-9]{10}$/.test(String(str||'')); }
export function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n); }
