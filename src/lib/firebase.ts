import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Singleton — safe for Next.js hot-reload in development
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db: Firestore = getFirestore(app)

export { app, db }

// `getAuth()` validates the API key eagerly (unlike Firestore, which only
// connects lazily) and throws if it's missing/malformed — which happens on
// every server-rendered page before an owner has filled in real Firebase
// credentials. Lazy-initialize it so only admin login/logout code (which
// runs client-side, inside an event handler) ever touches it.
let authInstance: Auth | null = null
export function getFirebaseAuth(): Auth {
  if (!authInstance) authInstance = getAuth(app)
  return authInstance
}
