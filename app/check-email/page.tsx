export default function CheckEmailPage() {
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
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#1a1a2e',
          marginBottom: 8,
        }}>
          Check your email
        </h1>
        <p style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
          lineHeight: 1.6,
        }}>
          We sent you a magic link. Click the link in your email to sign in and access your treasury workflow assessments.
        </p>
        <a
          href="/login"
          style={{
            fontSize: 13,
            color: '#666',
            textDecoration: 'underline',
          }}
        >
          Back to sign in
        </a>
      </div>
    </div>
  );
}
