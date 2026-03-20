import { useMemo } from 'react';
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
  const parts = cleaned.match(/[\d.]+[KkMm]?/g);
  if (!parts || parts.length === 0) return 0;

  const toNum = (s: string): number => {
    const upper = s.toUpperCase();
    if (upper.endsWith('M')) return parseFloat(s) * 1_000_000;
    if (upper.endsWith('K')) return parseFloat(s) * 1_000;
    return parseFloat(s) || 0;
  };

  const nums = parts.map(toNum);
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

interface CategoryBucket {
  category: string;
  doBucket: BucketMetrics;
  wishBucket: BucketMetrics;
  total: number;
  notSelected: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cash Management': '#3498db',
  'Payment Operations': '#e67e22',
  'FX Management': '#8e44ad',
  'Risk & Compliance': '#e74c3c',
  'Reporting & Analysis': '#16a085',
  'Liquidity Management': '#2980b9',
  'Bank Relationship Management': '#d35400',
  'Strategic Planning': '#1a1a2e',
  'Fraud Prevention': '#c0392b',
  'Real-Time Treasury': '#27ae60',
  'Supply Chain Finance': '#f39c12',
  'Interest Rate Risk': '#8e44ad',
  'SOX Compliance & Controls': '#7f8c8d',
  'Bank Account Management (EBAM)': '#2c3e50',
  'Cross-Border Cash Management': '#16a085',
  'Commodity Risk': '#d4ac0d',
  'ESG / Sustainability': '#27ae60',
  'M&A Integration': '#6c3483',
  'Business Continuity': '#cb4335',
  'Shared Services & In-House Bank': '#5dade2',
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
  // Compute per-category and grand totals
  const { categoryBuckets, grandDo, grandWish, totalWorkflows, allSelected, relevantAgents } = useMemo(() => {
    const catMap: Record<string, CategoryBucket> = {};
    const gDo = emptyBucket();
    const gWish = emptyBucket();
    let total = 0;

    Object.keys(workflowData).forEach(cadence => {
      const all = [...workflowData[cadence].workflows, ...(customWorkflows[cadence] || [])];
      all.forEach(w => {
        total++;
        const cat = w.category || 'Uncategorized';
        if (!catMap[cat]) catMap[cat] = { category: cat, doBucket: emptyBucket(), wishBucket: emptyBucket(), total: 0, notSelected: [] };
        const cb = catMap[cat];
        cb.total++;

        if (w.doToday) {
          cb.doBucket.count++; cb.doBucket.hrs += parseNumeric(w.hrs); cb.doBucket.err += parseNumeric(w.err); cb.doBucket.opt += parseNumeric(w.opt); cb.doBucket.ids.push(w.id);
          gDo.count++; gDo.hrs += parseNumeric(w.hrs); gDo.err += parseNumeric(w.err); gDo.opt += parseNumeric(w.opt); gDo.ids.push(w.id);
        }
        if (w.wishToDo) {
          cb.wishBucket.count++; cb.wishBucket.hrs += parseNumeric(w.hrs); cb.wishBucket.err += parseNumeric(w.err); cb.wishBucket.opt += parseNumeric(w.opt); cb.wishBucket.ids.push(w.id);
          gWish.count++; gWish.hrs += parseNumeric(w.hrs); gWish.err += parseNumeric(w.err); gWish.opt += parseNumeric(w.opt); gWish.ids.push(w.id);
        }
        if (!w.doToday && !w.wishToDo) {
          cb.notSelected.push(w.name);
        }
      });
    });

    const allSel = [...new Set([...gDo.ids, ...gWish.ids])];
    const relAgents = agents.filter(a => a.workflows.some(wid => allSel.includes(wid)));

    // Sort categories: ones with selections first, then alphabetically
    const sorted = Object.values(catMap).sort((a, b) => {
      const aSelected = a.doBucket.count + a.wishBucket.count;
      const bSelected = b.doBucket.count + b.wishBucket.count;
      if (aSelected > 0 && bSelected === 0) return -1;
      if (bSelected > 0 && aSelected === 0) return 1;
      return a.category.localeCompare(b.category);
    });

    return { categoryBuckets: sorted, grandDo: gDo, grandWish: gWish, totalWorkflows: total, allSelected: allSel, relevantAgents: relAgents };
  }, [workflowData, customWorkflows, agents]);

  const hasSelections = allSelected.length > 0;

  return (
    <>
      <div className="summary-panel">
        <h2>Assessment Summary — {companyName || 'Your Company'}</h2>

        {/* ── Grand Totals ── */}
        <div className="metrics-grid">
          <div className="metric-box gold">
            <div className="big">{totalWorkflows}</div>
            <div className="label">Total Workflows</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{allSelected.length}</div>
            <div className="label">Total Selected</div>
          </div>
          <div className="metric-box green">
            <div className="big">{grandDo.count + grandWish.count > 0 ? Math.round(grandDo.hrs + grandWish.hrs) : '—'}</div>
            <div className="label">Total Hrs/Mo (All Selected)</div>
          </div>
          <div className="metric-box red">
            <div className="big">{relevantAgents.length}</div>
            <div className="label">Recommended Agents</div>
          </div>
        </div>

        {/* ── Do Today ── */}
        <h3 className="summary-section-title do-title">✓ Workflows Done Today — {grandDo.count} workflows · {Math.round(grandDo.hrs)} hrs/mo</h3>
        <div className="metrics-grid">
          <div className="metric-box gold">
            <div className="big">{grandDo.count}</div>
            <div className="label">Workflows</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{grandDo.hrs > 0 ? Math.round(grandDo.hrs) : '—'}</div>
            <div className="label">Total Hrs/Mo</div>
          </div>
          <div className="metric-box red">
            <div className="big">{grandDo.err > 0 ? formatCompact(grandDo.err) : '—'}</div>
            <div className="label">Error Cost Exposure</div>
          </div>
          <div className="metric-box green">
            <div className="big">{grandDo.opt > 0 ? formatCompact(grandDo.opt) : '—'}</div>
            <div className="label">$ Optimization Potential</div>
          </div>
        </div>

        {/* ── Wish ── */}
        <h3 className="summary-section-title wish-title">★ Workflows Wished For — {grandWish.count} workflows · {Math.round(grandWish.hrs)} hrs/mo</h3>
        <div className="metrics-grid">
          <div className="metric-box gold">
            <div className="big">{grandWish.count}</div>
            <div className="label">Workflows</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{grandWish.hrs > 0 ? Math.round(grandWish.hrs) : '—'}</div>
            <div className="label">Total Hrs/Mo</div>
          </div>
          <div className="metric-box red">
            <div className="big">{grandWish.err > 0 ? formatCompact(grandWish.err) : '—'}</div>
            <div className="label">Error Cost Exposure</div>
          </div>
          <div className="metric-box green">
            <div className="big">{grandWish.opt > 0 ? formatCompact(grandWish.opt) : '—'}</div>
            <div className="label">$ Optimization Potential</div>
          </div>
        </div>

        {/* ── Category Breakdown ── */}
        <h3 className="summary-section-title" style={{ color: '#60a5fa' }}>Breakdown by Category</h3>
        <div className="summary-cat-grid">
          {categoryBuckets.map(cb => {
            const selected = cb.doBucket.count + cb.wishBucket.count;
            const color = CATEGORY_COLORS[cb.category] || '#6b7280';
            const totalHrs = Math.round(cb.doBucket.hrs + cb.wishBucket.hrs);
            return (
              <div key={cb.category} className="summary-cat-card" style={{ borderLeftColor: color }}>
                <div className="summary-cat-card-header">
                  <span className="summary-cat-card-name">{cb.category}</span>
                  <span className="summary-cat-card-badge">{cb.total} total</span>
                </div>
                <div className="summary-cat-card-body">
                  {cb.doBucket.count > 0 && (
                    <div className="summary-cat-row do">
                      <span>✓ Do: {cb.doBucket.count}</span>
                      <span>{Math.round(cb.doBucket.hrs)} hrs/mo</span>
                      {cb.doBucket.err > 0 && <span className="err">{formatCompact(cb.doBucket.err)} err</span>}
                      {cb.doBucket.opt > 0 && <span className="opt">{formatCompact(cb.doBucket.opt)} opt</span>}
                    </div>
                  )}
                  {cb.wishBucket.count > 0 && (
                    <div className="summary-cat-row wish">
                      <span>★ Wish: {cb.wishBucket.count}</span>
                      <span>{Math.round(cb.wishBucket.hrs)} hrs/mo</span>
                      {cb.wishBucket.err > 0 && <span className="err">{formatCompact(cb.wishBucket.err)} err</span>}
                      {cb.wishBucket.opt > 0 && <span className="opt">{formatCompact(cb.wishBucket.opt)} opt</span>}
                    </div>
                  )}
                  {selected === 0 && (
                    <div className="summary-cat-row none">No workflows selected</div>
                  )}
                  {selected > 0 && totalHrs > 0 && (
                    <div className="summary-cat-total">
                      {totalHrs} total hrs/mo across {selected} workflow{selected !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                {cb.notSelected.length > 0 && (
                  <div className="summary-cat-not-selected">
                    <span className="summary-cat-not-selected-label">{cb.notSelected.length} not selected:</span>{' '}
                    {cb.notSelected.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Agent Recommendations ── */}
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
