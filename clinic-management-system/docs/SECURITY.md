# Security & Rules (Sample)

Use Firebase Firestore security rules (adapt per needs):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isDoctor() { return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor'; }
    function isReceptionist() { return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'receptionist'; }

    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    match /patients/{id} {
      allow read: if isDoctor() || isReceptionist();
      allow create, update: if isReceptionist() || isDoctor();
    }

    match /queue/{doc} {
      allow read, write: if isSignedIn();
    }

    match /prescriptions/{doc} {
      allow create: if isDoctor();
      allow read: if isDoctor() || isReceptionist();
    }

    match /billing/{id} {
      allow read, write: if isReceptionist() || isDoctor();
    }

    match /logs/{doc} {
      allow create: if isSignedIn();  // write-only
      allow read: if false;
    }

    match /counters/{id} {
      allow read, write: if isReceptionist();
    }
  }
}
```
