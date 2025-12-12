'use client';
// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function initializeFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const app = initializeFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
