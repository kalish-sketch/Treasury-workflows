'use client';

import { useSession, signOut } from 'next-auth/react';

interface TopBarProps {
  onReset: () => void;
  onSave: () => void;
  saving: boolean;
  onSubmit: () => void;
  submitting: boolean;
  onViewRecommendations: () => void;
}

export default function TopBar({ onReset, onSave, saving, onSubmit, submitting, onViewRecommendations }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <div className="top-bar">
      <h1>Treasurer Workflows — The World Before Nilus</h1>
      <div className="bar-actions">
        {session?.user ? (
          <>
            <span style={{ fontSize: 12, color: '#cbd5e1', alignSelf: 'center' }}>
              {session.user.email}
            </span>
            <a href="/dashboard" className="btn btn-link">My Assessments</a>
            <button
              className="btn btn-link"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </button>
          </>
        ) : (
          <a href="/login" className="btn btn-link">Sign In</a>
        )}
        <a href="https://www.nilus.com" target="_blank" rel="noopener noreferrer" className="btn btn-link">nilus.com</a>
        <a href="https://academy.nilus.com/" target="_blank" rel="noopener noreferrer" className="btn btn-link">Academy</a>
        <button className="btn btn-save" onClick={onSave} disabled={saving || submitting}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button className="btn btn-secondary" onClick={onReset}>Reset All</button>
        <button className="btn btn-primary" onClick={onSubmit} disabled={submitting || saving}>
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
        <button className="btn btn-ghost" onClick={onViewRecommendations}>
          View Recommendations →
        </button>
      </div>
    </div>
  );
}
