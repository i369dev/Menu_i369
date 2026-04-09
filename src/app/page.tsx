
'use client';
import React from 'react';
import App from './App';
import { FirebaseProvider } from '@/firebase';

export default function Page() {
  return (
    <FirebaseProvider>
        <App />
    </FirebaseProvider>
  );
}
