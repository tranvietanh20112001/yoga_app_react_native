import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAsUmDZD0LMaNiQ4x6nO3oWzw2LimegW7c",
  authDomain: "yoga-app-b3e61.firebaseapp.com",
  projectId: "yoga-app-b3e61",
  storageBucket: "yoga-app-b3e61.firebasestorage.app",
  messagingSenderId: "909885777101",
  appId: "1:909885777101:web:da266a93ed98f9499df584"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
