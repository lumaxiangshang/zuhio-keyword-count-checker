'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface GoogleLoginProps {
  onLoginSuccess?: (user: any) => void;
}

export default function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 监听 Firebase 认证状态
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // 如果用户已登录，同步到数据库
      if (firebaseUser) {
        syncUserToDatabase(firebaseUser);
      } else {
        setDbUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 同步用户到数据库
  const syncUserToDatabase = async (firebaseUser: User) => {
    if (!firebaseUser.email) return;

    setSyncing(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDbUser(data.user);
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        console.log('User synced to database:', data.user);
      } else {
        console.error('Failed to sync user:', data.error);
        setError(data.error);
      }
    } catch (err: any) {
      console.error('Sync error:', err);
      setError('Failed to sync user data');
    } finally {
      setSyncing(false);
    }
  };

  // Google 登录
  const handleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user.email);
      // syncUserToDatabase 会在 onAuthStateChanged 中自动调用
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized. Please contact support.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  // 登出
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
      console.log('User signed out');
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {/* 用户信息 */}
        <div className="hidden md:flex items-center gap-2 text-white/80">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-8 h-8 rounded-full border-2 border-white/30"
            />
          )}
          <div className="text-sm">
            <div className="font-medium">
              {user.displayName || user.email?.split('@')[0]}
            </div>
            {dbUser && (
              <div className="text-xs text-white/60">
                {dbUser.credits} credits • {dbUser.subscriptionPlan}
              </div>
            )}
          </div>
        </div>
        
        {/* 登出按钮 */}
        <button
          onClick={handleSignOut}
          disabled={syncing}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Google 登录按钮 */}
      <button
        onClick={handleSignIn}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-medium transition-colors shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>
      
      {/* 错误提示 */}
      {error && (
        <div className="text-xs text-red-300 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
