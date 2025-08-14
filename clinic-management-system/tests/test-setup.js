// Minimal environment shims for tests (no real Firestore).
export const fakeDb = { store: new Map(), counters: new Map() };
