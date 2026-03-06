import { WorkflowDataMap, Workflow, Agent } from '@/types';

interface SummaryPanelProps {
  workflowData: WorkflowDataMap;
  customWorkflows: Record<string, Workflow[]>;
  agents: Agent[];
  companyName: string;
  onSubmit: () => void;
  submitting: boolean;
  onPrint: () => void;
}

/** Parse a string like "20–40", "$50K–100K/yr", "5", "$2M" into a number (takes midpoint of ranges). */
function parseNumeric(val: string): number {
  if (!val || val === '—' || val === '-') return 0;
  const cleaned = val.replace(/[,$\/yr\/mo\s]/g, '');
  // Extract all numbers with optional K/M suffix
  const parts = cleaned.match(/[\d.]+[KkMm]?/g);
  if (!parts || parts.length === 0) return 0;

  const toNum = (s: string): number => {
    const upper = s.toUpperCase();
    if (upper.endsWith('M')) return parseFloat(s) * 1_000_000;
    if (upper.endsWith('K')) return parseFloat(s) * 1_000;
    return parseFloat(s) || 0;
  };

  const nums = parts.map(toNum);
  // Return midpoint for ranges, or single value
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

function formatCompact(val: number): string {
  if (val === 0) return '—';
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return val.toFixed(0);
}

interface BucketMetrics {
  count: number;
  hrs: number;
  err: number;
  opt: number;
  ids: string[];
}

function emptyBucket(): BucketMetrics {
  return { count: 0, hrs: 0, err: 0, opt: 0, ids: [] };
}

const CADENCE_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};

const CADENCE_COLORS: Record<string, string> = {
  daily: '#e74c3c', weekly: '#e67e22', monthly: '#3498db', quarterly: '#8e44ad', annual: '#16a085',
};

export default function SummaryPanel({
  workflowData,
  customWorkflows,
  agents,
  companyName,
  onSubmit,
  submitting,
  onPrint,
}: SummaryPanelProps) {
  const doBucket = emptyBucket();
  const wishBucket = emptyBucket();
  let totalWorkflows = 0;

  // Track not-selected workflows grouped by cadence
  const notSelectedByCadence: Record<string, string[]> = {};
  let notSelectedCount = 0;

  Object.keys(workflowData).forEach(cadence => {
    const all = [...workflowData[cadence].workflows, ...(customWorkflows[cadence] || [])];
    notSelectedByCadence[cadence] = [];
    all.forEach(w => {
      totalWorkflows++;
      const isSelected = w.doToday || w.wishToDo;
      if (w.doToday) {
        doBucket.count++;
        doBucket.hrs += parseNumeric(w.hrs);
        doBucket.err += parseNumeric(w.err);
        doBucket.opt += parseNumeric(w.opt);
        doBucket.ids.push(w.id);
      }
      if (w.wishToDo) {
        wishBucket.count++;
        wishBucket.hrs += parseNumeric(w.hrs);
        wishBucket.err += parseNumeric(w.err);
        wishBucket.opt += parseNumeric(w.opt);
        wishBucket.ids.push(w.id);
      }
      if (!isSelected) {
        notSelectedCount++;
        notSelectedByCadence[cadence].push(w.name);
      }
    });
  });

  const allSelected = [...new Set([...doBucket.ids, ...wishBucket.ids])];
  const relevantAgents = agents.filter(a =>
    a.workflows.some(wid => allSelected.includes(wid))
  );

  const hasSelections = allSelected.length > 0;

  return (
    <>
      <div className="summary-panel">
        <h2>Assessment Summary — {companyName || 'Your Company'}</h2>

        {/* ── Do Today Section ── */}
        <h3 className="summary-section-title do-title">✓ Workflows Done Today</h3>
        <div className="metrics-grid">
          <div className="metric-box gold">
            <div className="big">{doBucket.count}</div>
            <div className="label">Workflows</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{doBucket.hrs > 0 ? Math.round(doBucket.hrs) : '—'}</div>
            <div className="label">Total Hrs/Mo</div>
          </div>
          <div className="metric-box red">
            <div className="big">{doBucket.err > 0 ? formatCompact(doBucket.err) : '—'}</div>
            <div className="label">Error Cost Exposure</div>
          </div>
          <div className="metric-box green">
            <div className="big">{doBucket.opt > 0 ? formatCompact(doBucket.opt) : '—'}</div>
            <div className="label">$ Optimization Potential</div>
          </div>
        </div>

        {/* ── Wish Section ── */}
        <h3 className="summary-section-title wish-title">★ Workflows Wished For</h3>
        <div className="metrics-grid">
          <div className="metric-box gold">
            <div className="big">{wishBucket.count}</div>
            <div className="label">Workflows</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{wishBucket.hrs > 0 ? Math.round(wishBucket.hrs) : '—'}</div>
            <div className="label">Total Hrs/Mo</div>
          </div>
          <div className="metric-box red">
            <div className="big">{wishBucket.err > 0 ? formatCompact(wishBucket.err) : '—'}</div>
            <div className="label">Error Cost Exposure</div>
          </div>
          <div className="metric-box green">
            <div className="big">{wishBucket.opt > 0 ? formatCompact(wishBucket.opt) : '—'}</div>
            <div className="label">$ Optimization Potential</div>
          </div>
        </div>

        {/* ── Not Selected Section ── */}
        <h3 className="summary-section-title not-selected-title">Not Selected</h3>
        <div className="metrics-grid" style={{ marginBottom: '12px' }}>
          <div className="metric-box" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="big" style={{ color: '#94a3b8' }}>{notSelectedCount}</div>
            <div className="label">Workflows Not Selected</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{totalWorkflows}</div>
            <div className="label">Total Workflows Available</div>
          </div>
          <div className="metric-box gold">
            <div className="big">{allSelected.length}</div>
            <div className="label">Total Selected</div>
          </div>
          <div className="metric-box red">
            <div className="big">{relevantAgents.length}</div>
            <div className="label">Recommended Agents</div>
          </div>
        </div>

        {notSelectedCount > 0 && (
          <div className="not-selected-list">
            {Object.entries(notSelectedByCadence).map(([cadence, names]) => {
              if (names.length === 0) return null;
              return (
                <div key={cadence} className="not-selected-cadence">
                  <span
                    className="cadence-badge-small"
                    style={{ background: CADENCE_COLORS[cadence] || '#666' }}
                  >
                    {CADENCE_LABELS[cadence] || cadence}
                  </span>
                  <span className="not-selected-names">
                    {names.join(', ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!hasSelections ? (
          <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            Go to each cadence tab and check &quot;✓ Do&quot; for workflows you perform today and
            &quot;★ Wish&quot; for workflows you wish you could do. Then come back here for
            personalized agent recommendations.
          </p>
        ) : (
          <div className="agent-recs">
            <h3>Recommended Nilus Agents</h3>
            {relevantAgents.map(a => {
              const matchedCount = a.workflows.filter(wid => allSelected.includes(wid)).length;
              return (
                <div key={a.name} className="agent-card">
                  <div style={{ flex: 1 }}>
                    <div className="agent-name">{a.name}</div>
                    <div className="agent-desc">{a.desc}</div>
                    <div className="agent-impact">Impact: {a.impact}</div>
                    <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '2px' }}>
                      {matchedCount} matching workflow{matchedCount > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="export-panel">
        <h3>Submit & Share</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
          Submit the full assessment (company profile + workflow selections + metrics) for review.
        </p>
        <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
        <button className="btn btn-secondary" style={{ marginLeft: '8px' }} onClick={onPrint}>Print Summary</button>
      </div>
    </>
  );
}
