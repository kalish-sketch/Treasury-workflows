"use client";

interface TopBarProps {
  onReset: () => void;
  onExport: () => void;
  onViewRecommendations: () => void;
}

export default function TopBar({
  onReset,
  onExport,
  onViewRecommendations,
}: TopBarProps) {
  return (
    <div className="top-bar">
      <h1>Treasurer Workflows &mdash; The World Before Nilus</h1>
      <div className="bar-actions">
        <button className="btn btn-secondary" onClick={onReset}>
          Reset All
        </button>
        <button className="btn btn-ghost" onClick={onExport}>
          Export JSON
        </button>
        <button className="btn btn-primary" onClick={onViewRecommendations}>
          View Recommendations &rarr;
        </button>
      </div>
    </div>
  );
}
