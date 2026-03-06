interface TopBarProps {
  onReset: () => void;
  onSave: () => void;
  saving: boolean;
  onSubmit: () => void;
  submitting: boolean;
  onViewRecommendations: () => void;
}

export default function TopBar({ onReset, onSave, saving, onSubmit, submitting, onViewRecommendations }: TopBarProps) {
  return (
    <div className="top-bar">
      <h1>Treasurer Workflows — The World Before Nilus</h1>
      <div className="bar-actions">
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
