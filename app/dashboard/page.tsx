import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { assessments } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import SignOutButton from './SignOutButton';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  let userAssessments: { id: string; companyName: string; createdAt: Date; updatedAt: Date }[] = [];

  try {
    userAssessments = await getDb()
      .select({
        id: assessments.id,
        companyName: assessments.companyName,
        createdAt: assessments.createdAt,
        updatedAt: assessments.updatedAt,
      })
      .from(assessments)
      .where(eq(assessments.userId, session.userId))
      .orderBy(desc(assessments.updatedAt));
  } catch {
    // DB may not be available — show empty state
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{
        background: '#1a1a2e',
        color: '#fff',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>My Assessments</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{session.email}</span>
          <a href="/" style={{
            padding: '8px 18px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            background: '#fbbf24',
            color: '#1a1a2e',
            textDecoration: 'none',
          }}>
            New Assessment
          </a>
          <SignOutButton />
        </div>
      </div>

      <div style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto' }}>
        {userAssessments.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>
              No assessments yet
            </h2>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
              Start a new treasury workflow assessment to see it here.
            </p>
            <a href="/" style={{
              padding: '10px 24px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              background: '#fbbf24',
              color: '#1a1a2e',
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              Start Assessment
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {userAssessments.map((a) => (
              <a
                key={a.id}
                href={`/?id=${a.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: 10,
                  padding: '16px 24px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>
                    {a.companyName || 'Untitled Assessment'}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    Created {new Date(a.createdAt).toLocaleDateString()}
                    {' · '}
                    Updated {new Date(a.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600 }}>
                  Edit →
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
