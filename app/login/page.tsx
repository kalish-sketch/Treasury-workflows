'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      await signIn('resend', { email, callbackUrl: '/' });
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
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
        {(error || authError) && (
          <div style={{
            background: '#fef2f2',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error || (authError === 'Configuration'
              ? 'Authentication is not configured yet. Please contact the administrator to set up AUTH_SECRET and AUTH_RESEND_KEY.'
              : 'Sign in failed. Please try again.'
            )}
          </div>
        )}
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
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <p style={{ color: '#666' }}>Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
