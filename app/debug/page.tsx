'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...');

  useEffect(() => {
    // 检查环境变量
    const vars = {
      API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
      MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✅ Set' : '❌ Missing',
    };
    setEnvVars(vars);

    // 检查 Firebase
    try {
      if (auth) {
        setFirebaseStatus('✅ Firebase initialized');
      } else {
        setFirebaseStatus('❌ Firebase not initialized');
      }
    } catch (error: any) {
      setFirebaseStatus(`❌ Error: ${error.message}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Firebase Debug Page</h1>

        {/* Firebase Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Firebase Status</h2>
          <div className="text-2xl">{firebaseStatus}</div>
        </div>

        {/* Environment Variables */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="font-mono text-sm">{key}</span>
                <span className={value.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Firebase Config (masked) */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Firebase Config (Masked)</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'AIzaSy...***' : 'Not set'}</div>
            <div>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set'}</div>
            <div>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}</div>
            <div>Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not set'}</div>
            <div>Messaging Sender ID: {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '289...359' : 'Not set'}</div>
            <div>App ID: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '1:289...cbf2' : 'Not set'}</div>
            <div>Measurement ID: {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'Not set'}</div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">🔧 Common Issues</h2>
          <ul className="space-y-3 text-gray-300">
            <li>
              <strong className="text-white">1. Unauthorized Domain:</strong>
              <br />
              Check Firebase Console → Authentication → Settings → Authorized domains
              <br />
              Add: <code className="bg-gray-700 px-2 py-1 rounded">zuhio-keyword-count-checker.pages.dev</code>
            </li>
            <li className="mt-4">
              <strong className="text-white">2. Missing Environment Variables:</strong>
              <br />
              Check Cloudflare Pages → Settings → Environment variables
              <br />
              Make sure all 7 variables are set for both Production and Preview
            </li>
            <li className="mt-4">
              <strong className="text-white">3. Google Sign-in Not Enabled:</strong>
              <br />
              Check Firebase Console → Authentication → Sign-in method
              <br />
              Enable Google provider
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <a href="/" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
            ← Back to Home
          </a>
          <a 
            href="https://console.firebase.google.com/project/zuhio-keyword-count-checker/authentication/providers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Open Firebase Console
          </a>
        </div>
      </div>
    </div>
  );
}
