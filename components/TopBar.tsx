import Link from 'next/link';

interface TopBarProps {
  onReset: () => void;
  onSubmit: () => void;
  submitting: boolean;
  onViewRecommendations: () => void;
}

export default function TopBar({ onReset, onSubmit, submitting, onViewRecommendations }: TopBarProps) {
  return (
    <div className="top-bar">
      <h1>Treasurer Workflows — The World Before Nilus</h1>
      <div className="bar-actions">
        <Link href="/backoffice" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
          Backoffice
        </Link>
        <button className="btn btn-secondary" onClick={onReset}>Reset All</button>
        <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
        <button className="btn btn-ghost" onClick={onViewRecommendations}>
          View Recommendations →
        </button>
      </div>
    </div>
  );
}
