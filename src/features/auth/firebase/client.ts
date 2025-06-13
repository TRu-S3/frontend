import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCSEyLh1n3Hcy1Hj5kibunBjUgZrRMoUhI",
  authDomain: "zenn-ai-agent-hackathon-460205.firebaseapp.com",
  projectId: "zenn-ai-agent-hackathon-460205",
  storageBucket: "zenn-ai-agent-hackathon-460205.firebasestorage.app",
  messagingSenderId: "696136807010",
  appId: "1:696136807010:web:bb40b8f7f7f29bb660173b"
};

const app = getApps()?.length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Googleログイン機能
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()
    return { user: result.user, idToken }
  } catch (error) {
    console.error('Firebase Google sign in error:', error)
    throw error
  }
}

// ログアウト機能
export const firebaseSignOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Firebase sign out error:', error)
    throw error
  }
}
