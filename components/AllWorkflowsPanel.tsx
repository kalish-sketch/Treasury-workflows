'use client';

import { useState, useMemo, Fragment } from 'react';
import { WorkflowDataMap, Workflow } from '@/types';
import { parseNumeric } from '@/lib/parseNumeric';

interface AllWorkflowsPanelProps {
  workflowData: WorkflowDataMap;
  customWorkflows: Record<string, Workflow[]>;
}

const CADENCE_ORDER = ['daily', 'weekly', 'monthly', 'quarterly', 'annual'];
const CADENCE_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};
const CADENCE_COLORS: Record<string, string> = {
  daily: '#e74c3c', weekly: '#e67e22', monthly: '#3498db', quarterly: '#8e44ad', annual: '#16a085',
};

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

type SelectionFilter = 'all' | 'do' | 'wish' | 'selected' | 'unselected';

export default function AllWorkflowsPanel({
  workflowData,
  customWorkflows,
}: AllWorkflowsPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [cadenceFilter, setCadenceFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  // Flatten all workflows with their source cadence
  const allRows = useMemo(() => {
    const rows: { cadence: string; workflow: Workflow }[] = [];
    for (const cadence of CADENCE_ORDER) {
      const cd = workflowData[cadence];
      if (!cd) continue;
      for (const w of cd.workflows) rows.push({ cadence, workflow: w });
      for (const w of (customWorkflows[cadence] || [])) rows.push({ cadence, workflow: w });
    }
    return rows;
  }, [workflowData, customWorkflows]);

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allRows.forEach(r => cats.add(r.workflow.category || 'Uncategorized'));
    return Array.from(cats).sort();
  }, [allRows]);

  // Apply filters
  const filteredRows = useMemo(() => {
    return allRows.filter(r => {
      if (cadenceFilter !== 'all' && r.cadence !== cadenceFilter) return false;
      if (categoryFilter !== 'all' && (r.workflow.category || 'Uncategorized') !== categoryFilter) return false;
      if (selectionFilter === 'do' && !r.workflow.doToday) return false;
      if (selectionFilter === 'wish' && !r.workflow.wishToDo) return false;
      if (selectionFilter === 'selected' && !r.workflow.doToday && !r.workflow.wishToDo) return false;
      if (selectionFilter === 'unselected' && (r.workflow.doToday || r.workflow.wishToDo)) return false;
      return true;
    });
  }, [allRows, cadenceFilter, categoryFilter, selectionFilter]);

  // Group filtered rows by category
  const rowsByCategory = useMemo(() => {
    const map: Record<string, { cadence: string; workflow: Workflow }[]> = {};
    filteredRows.forEach(r => {
      const cat = r.workflow.category || 'Uncategorized';
      if (!map[cat]) map[cat] = [];
      map[cat].push(r);
    });
    return map;
  }, [filteredRows]);

  // Category-level metrics (from ALL rows, not filtered, for the dashboard)
  const categoryMetrics = useMemo(() => {
    const metrics: Record<string, { total: number; doCount: number; wishCount: number; doHrs: number; wishHrs: number; doErr: number; wishErr: number; doOpt: number; wishOpt: number }> = {};
    allRows.forEach(r => {
      const cat = r.workflow.category || 'Uncategorized';
      if (!metrics[cat]) metrics[cat] = { total: 0, doCount: 0, wishCount: 0, doHrs: 0, wishHrs: 0, doErr: 0, wishErr: 0, doOpt: 0, wishOpt: 0 };
      const m = metrics[cat];
      m.total++;
      if (r.workflow.doToday) {
        m.doCount++;
        m.doHrs += parseNumeric(r.workflow.hrs);
        m.doErr += parseNumeric(r.workflow.err);
        m.doOpt += parseNumeric(r.workflow.opt);
      }
      if (r.workflow.wishToDo) {
        m.wishCount++;
        m.wishHrs += parseNumeric(r.workflow.hrs);
        m.wishErr += parseNumeric(r.workflow.err);
        m.wishOpt += parseNumeric(r.workflow.opt);
      }
    });
    return metrics;
  }, [allRows]);

  // Grand totals
  const totals = useMemo(() => {
    let doCount = 0, wishCount = 0, doHrs = 0, wishHrs = 0, total = 0;
    allRows.forEach(r => {
      total++;
      if (r.workflow.doToday) { doCount++; doHrs += parseNumeric(r.workflow.hrs); }
      if (r.workflow.wishToDo) { wishCount++; wishHrs += parseNumeric(r.workflow.hrs); }
    });
    return { total, doCount, wishCount, doHrs, wishHrs };
  }, [allRows]);

  const sortedCategories = Object.keys(rowsByCategory).sort();

  return (
    <div className="cadence-section all-workflows">
      <div className="cadence-header">
        <span className="cadence-badge" style={{ background: '#1a1a2e' }}>All</span>
        <span className="cadence-title">All Workflows — Dashboard</span>
      </div>

      {/* ── Grand Totals ── */}
      <div className="all-wf-totals-bar">
        <div className="all-wf-total-item">
          <span className="all-wf-total-num">{totals.total}</span>
          <span className="all-wf-total-label">Total Workflows</span>
        </div>
        <div className="all-wf-total-item do">
          <span className="all-wf-total-num">{totals.doCount}</span>
          <span className="all-wf-total-label">✓ Do Today</span>
        </div>
        <div className="all-wf-total-item wish">
          <span className="all-wf-total-num">{totals.wishCount}</span>
          <span className="all-wf-total-label">★ Wish</span>
        </div>
        <div className="all-wf-total-item hrs">
          <span className="all-wf-total-num">{Math.round(totals.doHrs)}</span>
          <span className="all-wf-total-label">Do Hrs/Mo</span>
        </div>
        <div className="all-wf-total-item wish-hrs">
          <span className="all-wf-total-num">{Math.round(totals.wishHrs)}</span>
          <span className="all-wf-total-label">Wish Hrs/Mo</span>
        </div>
      </div>

      {/* ── Category Dashboard Cards ── */}
      <div className="all-wf-cat-grid">
        {categories.map(cat => {
          const m = categoryMetrics[cat];
          if (!m) return null;
          const selected = m.doCount + m.wishCount;
          const color = CATEGORY_COLORS[cat] || '#6b7280';
          return (
            <button
              key={cat}
              className={`all-wf-cat-card${categoryFilter === cat ? ' active' : ''}`}
              style={{ borderLeftColor: color }}
              onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              title={`Click to ${categoryFilter === cat ? 'clear' : 'filter by'} ${cat}`}
            >
              <div className="all-wf-cat-card-name">{cat}</div>
              <div className="all-wf-cat-card-stats">
                <span>{m.total} workflow{m.total !== 1 ? 's' : ''}</span>
                {selected > 0 && <span className="all-wf-cat-card-selected">{selected} selected</span>}
              </div>
              <div className="all-wf-cat-card-metrics">
                {m.doCount > 0 && (
                  <span className="all-wf-cat-metric do">✓ {m.doCount} · {Math.round(m.doHrs)} hrs</span>
                )}
                {m.wishCount > 0 && (
                  <span className="all-wf-cat-metric wish">★ {m.wishCount} · {Math.round(m.wishHrs)} hrs</span>
                )}
                {selected === 0 && <span className="all-wf-cat-metric none">No selections</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="all-wf-filter-bar">
        <label className="all-wf-filter-label">Filters:</label>
        <select value={cadenceFilter} onChange={e => setCadenceFilter(e.target.value)}>
          <option value="all">All Cadences</option>
          {CADENCE_ORDER.map(c => (
            <option key={c} value={c}>{CADENCE_LABELS[c]}</option>
          ))}
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={selectionFilter} onChange={e => setSelectionFilter(e.target.value as SelectionFilter)}>
          <option value="all">All Statuses</option>
          <option value="do">✓ Do Today</option>
          <option value="wish">★ Wish</option>
          <option value="selected">Any Selected</option>
          <option value="unselected">Not Selected</option>
        </select>
        {(cadenceFilter !== 'all' || categoryFilter !== 'all' || selectionFilter !== 'all') && (
          <button
            className="all-wf-clear-filters"
            onClick={() => { setCadenceFilter('all'); setCategoryFilter('all'); setSelectionFilter('all'); }}
          >
            Clear filters
          </button>
        )}
        <span className="all-wf-filter-count">
          Showing {filteredRows.length} of {allRows.length} workflows
        </span>
      </div>

      <p className="note">
        This is a read-only overview. Edit workflows in their respective cadence tabs (Daily, Weekly, etc.). Click a category card above to filter.
      </p>

      {/* ── Table grouped by Category ── */}
      {sortedCategories.map(cat => {
        const rows = rowsByCategory[cat];
        const isCollapsed = collapsedCategories.has(cat);
        const catColor = CATEGORY_COLORS[cat] || '#6b7280';
        const catM = categoryMetrics[cat];
        const catDoHrs = catM ? Math.round(catM.doHrs) : 0;
        const catWishHrs = catM ? Math.round(catM.wishHrs) : 0;

        return (
          <div key={cat} className="all-wf-category-group">
            <button className="all-wf-category-header" onClick={() => toggleCategoryCollapse(cat)}>
              <span className="all-wf-category-expand">{isCollapsed ? '▸' : '▾'}</span>
              <span className="ws-category-pill" style={{ background: catColor }}>{cat}</span>
              <span className="all-wf-category-count">{rows.length} workflow{rows.length !== 1 ? 's' : ''}</span>
              {catDoHrs > 0 && <span className="all-wf-category-hrs do">✓ {catDoHrs} hrs/mo</span>}
              {catWishHrs > 0 && <span className="all-wf-category-hrs wish">★ {catWishHrs} hrs/mo</span>}
            </button>
            {!isCollapsed && (
              <table>
                <colgroup>
                  <col style={{ width: '3%' }} />
                  <col style={{ width: '3%' }} />
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '7%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th title="We do this today">✓ Do</th>
                    <th title="We wish we could do this">★ Wish</th>
                    <th>Cadence</th>
                    <th>Workflow</th>
                    <th>Who</th>
                    <th>Systems</th>
                    <th>How It Actually Works</th>
                    <th>Pain Points</th>
                    <th>Hrs/Mo</th>
                    <th>Error Cost</th>
                    <th>$ Optimization</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ cadence, workflow: w }) => {
                    const rowKey = `${cadence}-${w.id}`;
                    const isExpanded = expandedIds.has(rowKey);
                    const hasSubs = w.subs && w.subs.length > 0;
                    const activeCadences = w.cadences || [cadence];

                    return (
                      <Fragment key={rowKey}>
                        <tr className={w.doToday || w.wishToDo ? '' : 'all-wf-unselected'}>
                          <td className="toggle-cell">
                            {w.doToday ? (
                              <span className="all-wf-check do">✓</span>
                            ) : (
                              <span className="all-wf-check empty">—</span>
                            )}
                          </td>
                          <td className="toggle-cell">
                            {w.wishToDo ? (
                              <span className="all-wf-check wish">★</span>
                            ) : (
                              <span className="all-wf-check empty">—</span>
                            )}
                          </td>
                          <td>
                            <span
                              className="cadence-badge-small"
                              style={{ background: CADENCE_COLORS[cadence] }}
                            >
                              {CADENCE_LABELS[cadence]}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {hasSubs && (
                                <button
                                  className="expand-btn"
                                  onClick={() => toggleExpand(rowKey)}
                                  title={isExpanded ? 'Collapse sub-workflows' : 'Expand sub-workflows'}
                                >
                                  {isExpanded ? '▾' : '▸'}
                                </button>
                              )}
                              <div>
                                <span className="workflow-name">{w.name}</span>
                                <br />
                                <span className="time-est">{w.timeEst || ''}</span>
                                {hasSubs && (
                                  <span className="time-est" style={{ marginLeft: '6px' }}>
                                    ({w.subs.length} sub-task{w.subs.length > 1 ? 's' : ''})
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td dangerouslySetInnerHTML={{ __html: w.who || '<span style="color:#9ca3af;font-size:10px">—</span>' }} />
                          <td dangerouslySetInnerHTML={{ __html: w.systems || '<span style="color:#9ca3af;font-size:10px">—</span>' }} />
                          <td className="all-wf-text">{w.how || '—'}</td>
                          <td className="all-wf-text pain-text">{w.pain || '—'}</td>
                          <td className="all-wf-metric hrs">{w.hrs || '—'}</td>
                          <td className="all-wf-metric err">{w.err || '—'}</td>
                          <td className="all-wf-metric opt">{w.opt || '—'}</td>
                          <td style={{ fontSize: '10px' }}>
                            {activeCadences.map(c => (
                              <span
                                key={c}
                                className="cadence-badge-small"
                                style={{ background: CADENCE_COLORS[c], marginRight: '2px', marginBottom: '2px' }}
                              >
                                {CADENCE_LABELS[c]?.charAt(0)}
                              </span>
                            ))}
                          </td>
                        </tr>
                        {isExpanded && hasSubs && w.subs.map(s => (
                          <tr key={`${rowKey}-${s.id}`} className="sub-row">
                            <td className="toggle-cell">
                              {s.doToday ? (
                                <span className="all-wf-check do" style={{ fontSize: '10px' }}>✓</span>
                              ) : (
                                <span className="all-wf-check empty" style={{ fontSize: '10px' }}>—</span>
                              )}
                            </td>
                            <td className="toggle-cell">
                              {s.wishToDo ? (
                                <span className="all-wf-check wish" style={{ fontSize: '10px' }}>★</span>
                              ) : (
                                <span className="all-wf-check empty" style={{ fontSize: '10px' }}>—</span>
                              )}
                            </td>
                            <td></td>
                            <td><span className="sub-name">{'\u21B3'} {s.name}</span></td>
                            <td colSpan={2}></td>
                            <td className="all-wf-text" style={{ fontSize: '10px' }}>{s.how || '—'}</td>
                            <td className="all-wf-text pain-text" style={{ fontSize: '10px' }}>{s.pain || '—'}</td>
                            <td colSpan={4}></td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
