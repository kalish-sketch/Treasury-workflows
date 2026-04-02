'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await signIn('resend', { email, callbackUrl: '/dashboard' });
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 40,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        maxWidth: 420,
        width: '100%',
      }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#1a1a2e',
          marginBottom: 8,
        }}>
          Sign in to your assessment
        </h1>
        <p style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
        }}>
          Enter your email and we&apos;ll send you a magic link to access your treasury workflow assessments.
        </p>
        <form onSubmit={handleSubmit}>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#666',
            marginBottom: 6,
          }}>
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 14,
              fontFamily: 'inherit',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 18px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
              background: '#fbbf24',
              color: '#1a1a2e',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'underline' }}>
            Back to assessment
          </a>
        </div>
      </div>
    </div>
  );
}
