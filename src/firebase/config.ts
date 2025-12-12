
// @ts-nocheck
import { FirebaseOptions, initializeApp, getApps } from 'firebase/app';

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCQA1f2QqOlcv6_xrzde1XslG9zdcc8yN8",
  authDomain: "studio-3326036389-ccbc6.firebaseapp.com",
  projectId: "studio-3326036389-ccbc6",
  storageBucket: "studio-3326036389-ccbc6.appspot.com",
  messagingSenderId: "971594237624",
  appId: "1:971594237624:web:2937fbf2a675cc9f70964d"
};

function initializeFirebase() {
  if (getApps().length > 0) {
    return;
  }
  initializeApp(firebaseConfig);
}

initializeFirebase();
