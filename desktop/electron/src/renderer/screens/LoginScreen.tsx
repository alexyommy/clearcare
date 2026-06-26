import React, { useState } from 'react';
import { useAppStore } from '../store/store';

export default function LoginScreen() {
  const signIn = useAppStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const ok = signIn(email, password);
    if (!ok) setError('Invalid email or password.');
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', backgroundColor: '#F8FAFB',
    }}>
      <div style={{ width: 420, padding: 40 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, backgroundColor: '#1A5276',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 28, marginBottom: 12,
          }} aria-hidden="true">♥</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A5276', margin: 0 }}>CareConnect</h1>
          <p style={{ color: '#757575', fontSize: 15, marginTop: 4 }}>Desktop — Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: '#FDEDED', borderLeft: '4px solid #C0392B',
              borderRadius: 6, padding: 12, marginBottom: 16, color: '#C0392B', fontSize: 14, fontWeight: 600,
            }}
          >{error}</div>
        )}

        {/* Demo hint */}
        <div style={{ backgroundColor: '#EBF5FB', borderRadius: 6, padding: 12, marginBottom: 20, textAlign: 'center' }}>
          <span style={{ fontSize: 13, color: '#154360' }}>Demo: demo@careconnect.com / demo123</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#424242', marginBottom: 6 }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8,
                border: '1.5px solid #E0E0E0', fontSize: 15, color: '#212121',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#424242', marginBottom: 6 }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8,
                border: '1.5px solid #E0E0E0', fontSize: 15, color: '#212121',
                outline: 'none',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '14px 0', borderRadius: 8, border: 'none',
              backgroundColor: '#1A5276', color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', marginTop: 8,
            }}
          >Sign In</button>
        </form>
      </div>
    </div>
  );
}
