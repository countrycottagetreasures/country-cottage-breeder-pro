import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQf8gs8ojrBjnWCZ8tYCaTpfMFsG279ds",
    authDomain: "country-cottage-breeder-pro.firebaseapp.com",
      projectId: "country-cottage-breeder-pro",
        storageBucket: "country-cottage-breeder-pro.firebasestorage.app",
          messagingSenderId: "379981043563",
            appId: "1:379981043563:web:e495ec52960b75a0841e2e"
            };

            const app = initializeApp(firebaseConfig);

            export const auth = getAuth(app);
            export const db = getFirestore(app);
            export default app;