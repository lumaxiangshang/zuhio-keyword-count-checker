'use client';

import { useState, useEffect } from 'react';

export default function TestPayPalButton() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    console.log('=== TEST COMPONENT: Fetching config ===');
    
    fetch('/api/paypal/config')
      .then(res => {
        console.log('=== TEST COMPONENT: Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('=== TEST COMPONENT: Response data:', data);
        if (data.clientId) {
          setClientId(data.clientId);
          setStatus('✅ Client ID loaded successfully!');
        } else {
          setStatus('❌ Client ID is empty in response');
        }
      })
      .catch(err => {
        console.error('=== TEST COMPONENT: Error:', err);
        setStatus('❌ Error: ' + err.message);
      });
  }, []);

  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-bold mb-2">🧪 PayPal Config Test</h3>
      <p className="text-sm mb-4">{status}</p>
      {clientId && (
        <div className="bg-white p-3 rounded font-mono text-xs break-all">
          <div className="text-gray-500 mb-1">Client ID:</div>
          {clientId}
        </div>
      )}
    </div>
  );
}
