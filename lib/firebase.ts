// Firebase 配置
// 需要在 Firebase 控制台创建项目并启用 Google Authentication
// 1. 访问 https://console.firebase.google.com
// 2. 创建新项目
// 3. 启用 Authentication > Google 登录
// 4. 复制配置并替换下面的占位符

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBgP_Oy5KTYfsEyNiXrtXwSAp1tztOuDyM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "zuhio-keyword-count-checker.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zuhio-keyword-count-checker",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "zuhio-keyword-count-checker.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "289541466359",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:289541466359:web:e6105f849bd6a5df90cbf2",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CTZEVL2EWZ",
};

// 初始化 Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google 登录
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    return { user: null, error: error.message };
  }
};

// 登出
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// 监听认证状态
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// 导出 googleProvider 和 auth
export { auth, googleProvider };
export default app;
