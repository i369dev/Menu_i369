'use client';
import React from 'react';
import App from './App';
import { ContentProvider } from './context/ContentContext';
import { FirebaseProvider } from '@/firebase';

export default function Page() {
  return (
    <FirebaseProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </FirebaseProvider>
  );
}
