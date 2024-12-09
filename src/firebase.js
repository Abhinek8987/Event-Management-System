// Import the necessary functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEZ0nyVlnnMpQMS-zoBqCVZjDyAVZXWo4",
  authDomain: "even-2a95e.firebaseapp.com",
  projectId: "even-2a95e",
  storageBucket: "even-2a95e.firebasestorage.app",
  messagingSenderId: "410118032567",
  appId: "1:410118032567:web:6ff26e8a8f1ab7b6119132",
  measurementId: "G-SY3GZWRG95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Export the necessary Firebase functions and instances
export { 
  app, 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  db, 
  setDoc, 
  doc, 
  getDoc, 
  analytics 
};
