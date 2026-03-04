import { WorkflowDataMap, Workflow } from '@/types';
import { AGENT_MAP } from '@/data/agents';

interface SummaryPanelProps {
  workflowData: WorkflowDataMap;
  customWorkflows: Record<string, Workflow[]>;
  companyName: string;
  onExport: () => void;
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

export default function SummaryPanel({
  workflowData,
  customWorkflows,
  companyName,
  onExport,
  onPrint,
}: SummaryPanelProps) {
  const doBucket = emptyBucket();
  const wishBucket = emptyBucket();
  let totalWorkflows = 0;

  Object.keys(workflowData).forEach(cadence => {
    const all = [...workflowData[cadence].workflows, ...(customWorkflows[cadence] || [])];
    all.forEach(w => {
      totalWorkflows++;
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
    });
  });

  const allSelected = [...new Set([...doBucket.ids, ...wishBucket.ids])];
  const relevantAgents = AGENT_MAP.filter(a =>
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

        {/* ── Overview ── */}
        <div className="metrics-grid" style={{ marginTop: '8px' }}>
          <div className="metric-box blue">
            <div className="big">{totalWorkflows}</div>
            <div className="label">Total Workflows Mapped</div>
          </div>
          <div className="metric-box red">
            <div className="big">{relevantAgents.length}</div>
            <div className="label">Recommended Agents</div>
          </div>
        </div>

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
        <h3>Export & Share</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
          Export the full assessment (company profile + workflow selections + metrics) as JSON for implementation planning.
        </p>
        <button className="btn btn-primary" onClick={onExport}>Export Assessment JSON</button>
        <button className="btn btn-secondary" style={{ marginLeft: '8px' }} onClick={onPrint}>Print Summary</button>
      </div>
    </>
  );
}
