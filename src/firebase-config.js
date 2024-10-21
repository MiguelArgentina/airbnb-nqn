// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeFirestore, enablePersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsHHZq4i2nKOrnIc-YtcGN-SkjKMiImIw",
    authDomain: "airbnb-nqn.firebaseapp.com",
    projectId: "airbnb-nqn",
    storageBucket: "airbnb-nqn.appspot.com",
    messagingSenderId: "916106504361",
    appId: "1:916106504361:web:9e058f6a191016ed9f21b8",
    measurementId: "G-VKN7WNB8EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
// Initialize Firebase Analytics
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        console.log("Analytics supported:", supported); // Log the support status
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

const db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Helps with certain network issues
});

console.log("Firestore initialized");

export { app, analytics, db };
