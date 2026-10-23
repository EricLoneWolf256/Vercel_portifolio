import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

function createAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Replace literal \n from env string with actual newlines
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

let appInstance: App | null = null
let dbInstance: Firestore | null = null

// Lazy singletons — constructing the Admin SDK app validates the service
// account eagerly and throws if the env vars aren't set yet (e.g. during
// `next build`/`next dev` before the owner has configured Firebase). Route
// Handlers in particular get imported at build time to inspect their
// exports, so an eager throw here would crash the whole build. Calling
// these inside a function body instead defers that to actual request time.
export function getAdminApp(): App {
  if (!appInstance) appInstance = createAdminApp()
  return appInstance
}

export function getAdminDb(): Firestore {
  if (!dbInstance) dbInstance = getFirestore(getAdminApp())
  return dbInstance
}
