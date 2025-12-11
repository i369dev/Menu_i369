'use client';
import React from 'react';
import App from './App';
import { ContentProvider } from './context/ContentContext';

export default function Page() {
  return (
    <ContentProvider>
      <App />
    </ContentProvider>
  );
}
