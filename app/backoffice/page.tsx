'use client';

import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import Link from 'next/link';
import {
  CADENCE_ORDER, CADENCE_LABELS, CADENCE_COLORS,
  stripHtmlTags, parseNumeric, formatCompact,
  collectAllWorkflows, exportSingleAssessment, exportAllAssessments,
  type AssessmentFull,
} from '@/lib/exportExcel';
import { WORKFLOW_DATA } from '@/data/workflows';

interface AssessmentSummary {
  id: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

type SortField = 'companyName' | 'createdAt';
type SortDir = 'asc' | 'desc';
type BackofficeTab = 'assessments' | 'workflows' | 'users';
type WsSortField = 'name' | 'category' | 'cadence';

// ── Category color map ──
const CATEGORY_COLORS: Record<string, string> = {
  'Cash Management': '#3b82f6',
  'Payment Operations': '#ef4444',
  'FX Management': '#8b5cf6',
  'Risk & Compliance': '#f59e0b',
  'Liquidity Management': '#06b6d4',
  'Bank Relationship Management': '#10b981',
  'Reporting & Analysis': '#6366f1',
  'Strategic Planning': '#0ea5e9',
  'Fraud Prevention': '#dc2626',
  'SOX Compliance & Controls': '#d97706',
  'Bank Account Management (EBAM)': '#059669',
  'Supply Chain Finance': '#7c3aed',
  'Interest Rate Risk': '#2563eb',
  'Real-Time Treasury': '#0891b2',
  'ESG / Sustainability': '#16a34a',
  'Commodity Risk': '#ea580c',
  'Cross-Border Cash Management': '#4f46e5',
  'M&A Integration': '#9333ea',
  'Business Continuity': '#b91c1c',
  'Shared Services & In-House Bank': '#0d9488',
};

// ── Flat workflow type for the selector ──
interface FlatWorkflow {
  id: string;
  name: string;
  cadence: string;
  category: string;
  visible: boolean;
  timeEst: string;
  subsCount: number;
  subs: Array<{ id: string; name: string; how: string; pain: string }>;
}

// ── Workflow Selector Tab ──

function WorkflowSelectorTab() {
  const [workflows, setWorkflows] = useState<FlatWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cadenceFilter, setCadenceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<WsSortField>('cadence');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Load workflows — try API with includeHidden, fallback to static
  useEffect(() => {
    async function load() {
      let flat: FlatWorkflow[] = [];
      try {
        const res = await fetch('/api/workflows?includeHidden=true');
        if (res.ok) {
          const data = await res.json();
          if (Object.keys(data).length > 0) {
            for (const [cadence, cData] of Object.entries(data) as any) {
              for (const w of cData.workflows) {
                flat.push({
                  id: w.id || w.key,
                  name: w.name,
                  cadence,
                  category: w.category || 'Uncategorized',
                  visible: w.visible ?? true,
                  timeEst: w.timeEst || '',
                  subsCount: (w.subs || []).length,
                  subs: w.subs || [],
                });
              }
            }
          }
        }
      } catch {
        // fallback
      }
      // Fallback to static data
      if (flat.length === 0) {
        for (const [cadence, cData] of Object.entries(WORKFLOW_DATA)) {
          for (const w of cData.workflows) {
            flat.push({
              id: w.id,
              name: w.name,
              cadence,
              category: w.category || 'Uncategorized',
              visible: w.visible ?? true,
              timeEst: w.timeEst || '',
              subsCount: (w.subs || []).length,
              subs: w.subs || [],
            });
          }
        }
      }
      setWorkflows(flat);
      setLoading(false);
    }
    load();
  }, []);

  // Derived: categories list
  const categories = useMemo(() => {
    const cats = new Set(workflows.map(w => w.category));
    return ['All', ...Array.from(cats).sort()];
  }, [workflows]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let result = workflows;
    if (categoryFilter !== 'All') result = result.filter(w => w.category === categoryFilter);
    if (cadenceFilter !== 'All') result = result.filter(w => w.cadence === cadenceFilter.toLowerCase());
    if (statusFilter === 'Visible') result = result.filter(w => w.visible);
    if (statusFilter === 'Hidden') result = result.filter(w => !w.visible);

    const cadenceOrder: Record<string, number> = { daily: 0, weekly: 1, monthly: 2, quarterly: 3, annual: 4 };
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      else cmp = (cadenceOrder[a.cadence] ?? 99) - (cadenceOrder[b.cadence] ?? 99);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [workflows, categoryFilter, cadenceFilter, statusFilter, sortField, sortDir]);

  // Stats
  const stats = useMemo(() => ({
    total: workflows.length,
    visible: workflows.filter(w => w.visible).length,
    hidden: workflows.filter(w => !w.visible).length,
  }), [workflows]);

  const toggleSort = useCallback((field: WsSortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        return field;
      }
      setSortDir('asc');
      return field;
    });
  }, []);

  const sortIndicator = (field: WsSortField) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' \u25B2' : ' \u25BC';
  };

  const toggleVisibility = useCallback(async (id: string) => {
    const wf = workflows.find(w => w.id === id);
    if (!wf) return;
    const newVal = !wf.visible;
    // Optimistic update
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, visible: newVal } : w));
    try {
      await fetch('/api/workflows/visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: [{ key: id, visible: newVal }] }),
      });
    } catch {
      // Revert on failure
      setWorkflows(prev => prev.map(w => w.id === id ? { ...w, visible: !newVal } : w));
    }
  }, [workflows]);

  const bulkToggle = useCallback(async (visible: boolean) => {
    const ids = filtered.map(w => w.id);
    if (ids.length === 0) return;
    setSaving(true);
    // Optimistic
    setWorkflows(prev => prev.map(w => ids.includes(w.id) ? { ...w, visible } : w));
    try {
      await fetch('/api/workflows/visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: ids.map(key => ({ key, visible })) }),
      });
    } catch {
      // Revert
      setWorkflows(prev => prev.map(w => ids.includes(w.id) ? { ...w, visible: !visible } : w));
    } finally {
      setSaving(false);
    }
  }, [filtered]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  if (loading) {
    return <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading workflows...</p>;
  }

  return (
    <>
      {/* Stats bar */}
      <div className="ws-stats">
        <span><strong>{stats.total}</strong> Total</span>
        <span style={{ color: '#10b981' }}><strong>{stats.visible}</strong> Visible (Front Book)</span>
        <span style={{ color: '#94a3b8' }}><strong>{stats.hidden}</strong> Hidden</span>
      </div>

      {/* Filter bar */}
      <div className="ws-filter-bar">
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={cadenceFilter} onChange={e => setCadenceFilter(e.target.value)}>
          {['All', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All', 'Visible', 'Hidden'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="ws-bulk-actions">
          <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => bulkToggle(true)} disabled={saving}>
            Show All ({filtered.length})
          </button>
          <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => bulkToggle(false)} disabled={saving}>
            Hide All ({filtered.length})
          </button>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6b7280' }}>
          Showing {filtered.length} of {stats.total}
        </span>
      </div>

      {/* Master table */}
      <table className="bo-table">
        <thead>
          <tr>
            <th style={{ width: '28px' }}></th>
            <th style={{ width: '50px' }}>ID</th>
            <th className="bo-sort-header" onClick={() => toggleSort('name')}>
              Name{sortIndicator('name')}
            </th>
            <th className="bo-sort-header" onClick={() => toggleSort('category')}>
              Category{sortIndicator('category')}
            </th>
            <th className="bo-sort-header" onClick={() => toggleSort('cadence')}>
              Cadence{sortIndicator('cadence')}
            </th>
            <th>Time Est</th>
            <th style={{ width: '40px' }}>Subs</th>
            <th style={{ width: '80px', textAlign: 'center' }}>Front Book</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(w => (
            <Fragment key={w.id}>
              <tr
                className={w.visible ? '' : 'ws-hidden-row'}
                style={{ cursor: w.subsCount > 0 ? 'pointer' : 'default' }}
                onClick={() => w.subsCount > 0 && toggleExpand(w.id)}
              >
                <td style={{ textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>
                  {w.subsCount > 0 ? (expandedIds.has(w.id) ? '\u25BC' : '\u25B6') : ''}
                </td>
                <td style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>{w.id}</td>
                <td><span className="bo-wf-name">{w.name}</span></td>
                <td>
                  <span
                    className="ws-category-pill"
                    style={{ background: CATEGORY_COLORS[w.category] || '#6b7280' }}
                  >
                    {w.category}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      display: 'inline-block', padding: '1px 6px', borderRadius: '8px',
                      fontSize: '9px', fontWeight: 600, color: '#fff',
                      background: CADENCE_COLORS[w.cadence] || '#666',
                    }}
                  >
                    {CADENCE_LABELS[w.cadence] || w.cadence}
                  </span>
                </td>
                <td style={{ fontSize: '11px', color: '#6b7280' }}>{w.timeEst}</td>
                <td style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280' }}>{w.subsCount || ''}</td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="ws-visible-toggle"
                    checked={w.visible}
                    onChange={(e) => { e.stopPropagation(); toggleVisibility(w.id); }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              </tr>
              {expandedIds.has(w.id) && w.subs.map(sub => (
                <tr key={sub.id} className="sub-row">
                  <td></td>
                  <td style={{ fontSize: '9px', color: '#9ca3af', fontFamily: 'monospace' }}>{sub.id}</td>
                  <td colSpan={4} style={{ fontSize: '11px', paddingLeft: '24px' }}>
                    <strong>{sub.name}</strong>
                    {sub.how && <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{sub.how}</div>}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ── Detail View ──

function DetailView({ detail }: { detail: AssessmentFull }) {
  const p = detail.profile || {};
  const stats = collectAllWorkflows(detail);

  return (
    <div className="bo-detail">
      {/* Summary Section */}
      <div className="bo-detail-section">
        <h4>Summary</h4>
        <div className="bo-summary-grid">
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#fbbf24' }}>{stats.doCount}</div>
            <div className="bo-summary-label">Do Today</div>
          </div>
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#10b981' }}>{stats.wishCount}</div>
            <div className="bo-summary-label">Wish To Do</div>
          </div>
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#94a3b8' }}>{stats.notSelectedCount}</div>
            <div className="bo-summary-label">Not Selected</div>
          </div>
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#60a5fa' }}>{stats.totalCount}</div>
            <div className="bo-summary-label">Total</div>
          </div>
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#60a5fa' }}>{stats.doHrs > 0 ? Math.round(stats.doHrs) : '—'}</div>
            <div className="bo-summary-label">Hrs/Mo (Do)</div>
          </div>
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#ef4444' }}>{stats.doErr > 0 ? formatCompact(stats.doErr) : '—'}</div>
            <div className="bo-summary-label">Error Cost</div>
          </div>
          <div className="bo-summary-box">
            <div className="bo-summary-num" style={{ color: '#10b981' }}>{stats.doOpt > 0 ? formatCompact(stats.doOpt) : '—'}</div>
            <div className="bo-summary-label">Optimization</div>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="bo-detail-section">
        <h4>Company Profile</h4>
        <div className="bo-detail-grid">
          {[
            ['Company', p.company], ['Industry', p.industry], ['Revenue', p.revenue],
            ['Entities', p.entities], ['Countries', p.countries],
            ['Currencies', Array.isArray(p.currencies) ? p.currencies.join(', ') : ''],
            ['Team Size', p.teamSize], ['Banks', Array.isArray(p.banks) ? p.banks.join(', ') : ''],
            ['Num Accounts', p.numAccounts], ['ERP', p.erp], ['TMS', p.tms],
            ['Other Systems', Array.isArray(p.otherSystems) ? p.otherSystems.join(', ') : ''],
            ['Payment Volume', p.paymentVolume], ['Facilities', p.facilities],
          ].map(([label, val]) => (
            <div key={label as string} className="bo-detail-field">
              <span className="bo-detail-label">{label}</span>
              <span className="bo-detail-value">{(val as string) || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Workflows Table */}
      <div className="bo-detail-section">
        <h4>All Workflows</h4>
        <table className="bo-all-wf-table">
          <thead>
            <tr>
              <th>Cadence</th>
              <th>Workflow</th>
              <th>Status</th>
              <th>Who</th>
              <th>Systems</th>
              <th>Hrs/Mo</th>
              <th>Error Cost</th>
              <th>Optimization</th>
              <th>Frequencies</th>
            </tr>
          </thead>
          <tbody>
            {stats.all.map(({ cadence, w }, i) => (
              <tr key={i}>
                <td>
                  <span
                    style={{
                      display: 'inline-block', padding: '1px 6px', borderRadius: '8px',
                      fontSize: '9px', fontWeight: 600, color: '#fff',
                      background: CADENCE_COLORS[cadence] || '#666',
                    }}
                  >
                    {CADENCE_LABELS[cadence]}
                  </span>
                </td>
                <td><span className="bo-wf-name">{w.name}</span></td>
                <td>
                  {w.doToday && <span className="bo-tag bo-tag-do">Do Today</span>}
                  {w.wishToDo && <span className="bo-tag bo-tag-wish">Wish</span>}
                  {!w.doToday && !w.wishToDo && <span style={{ color: '#9ca3af', fontSize: '10px' }}>—</span>}
                </td>
                <td style={{ fontSize: '10px' }}>{w.who || '—'}</td>
                <td style={{ fontSize: '10px' }}>{w.systems || '—'}</td>
                <td style={{ fontSize: '11px', fontWeight: 600, color: '#1e40af' }}>{w.hrs || '—'}</td>
                <td style={{ fontSize: '11px', color: '#b91c1c' }}>{w.errCost || '—'}</td>
                <td style={{ fontSize: '11px', color: '#047857' }}>{w.optimization || '—'}</td>
                <td style={{ fontSize: '10px' }}>
                  {w.cadences.map(c => CADENCE_LABELS[c] || c).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Not Selected Workflows */}
      {stats.notSelectedCount > 0 && (
        <div className="bo-detail-section">
          <h4>Not Selected Workflows ({stats.notSelectedCount})</h4>
          <ul className="bo-wf-list">
            {stats.notSelectedNames.map((name, i) => (
              <li key={i}>
                <span className="bo-wf-name" style={{ color: '#9ca3af' }}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Custom Workflows */}
      {Object.entries(detail.customWorkflows || {}).some(([, wfs]) => (wfs as any[]).length > 0) && (
        <div className="bo-detail-section">
          <h4>Custom Workflows</h4>
          {Object.entries(detail.customWorkflows || {}).map(([cadence, wfs]) => {
            if (!(wfs as any[]).length) return null;
            return (
              <div key={cadence}>
                <h5 style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{CADENCE_LABELS[cadence] || cadence}</h5>
                <ul className="bo-wf-list">
                  {(wfs as any[]).map((w: any) => (
                    <li key={w.id}>
                      <span className="bo-wf-name">{w.name}</span>
                      {w.doToday && <span className="bo-tag bo-tag-do">Do Today</span>}
                      {w.wishToDo && <span className="bo-tag bo-tag-wish">Wish To Do</span>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Users Tab ──

interface UserInfo {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  companies: string[];
  assessmentCount: number;
  lastActivity: string | null;
}

function UsersTab() {
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setUserList(data);
      })
      .catch(err => console.error('Failed to load users:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading users...</p>;
  }

  if (userList.length === 0) {
    return <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No users have signed up yet.</p>;
  }

  return (
    <>
      <div className="ws-stats">
        <span><strong>{userList.length}</strong> Total Users</span>
        <span style={{ color: '#10b981' }}><strong>{userList.filter(u => u.assessmentCount > 0).length}</strong> With Assessments</span>
        <span style={{ color: '#94a3b8' }}><strong>{userList.filter(u => u.assessmentCount === 0).length}</strong> No Assessments</span>
      </div>
      <table className="bo-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Companies</th>
            <th>Assessments</th>
            <th>Signed Up</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(u => (
            <tr key={u.id}>
              <td style={{ fontWeight: 600 }}>{u.email || '—'}</td>
              <td>
                {u.companies.length > 0
                  ? u.companies.map((c, i) => (
                    <span key={i} style={{
                      display: 'inline-block',
                      padding: '1px 8px',
                      borderRadius: 3,
                      fontSize: 11,
                      fontWeight: 600,
                      background: '#e0e7ff',
                      color: '#3730a3',
                      marginRight: 4,
                      marginBottom: 2,
                    }}>
                      {c}
                    </span>
                  ))
                  : <span style={{ color: '#9ca3af', fontSize: 11 }}>No assessments</span>
                }
              </td>
              <td style={{ textAlign: 'center', fontWeight: 600 }}>{u.assessmentCount}</td>
              <td style={{ fontSize: 12, color: '#6b7280' }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
              </td>
              <td style={{ fontSize: 12, color: '#6b7280' }}>
                {u.lastActivity ? new Date(u.lastActivity).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ── Main Backoffice Page ──

export default function BackofficePage() {
  const [activeTab, setActiveTab] = useState<BackofficeTab>('assessments');
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<AssessmentFull | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch('/api/assessments')
      .then(r => r.json())
      .then(data => setAssessments(data))
      .catch(err => console.error('Failed to load assessments:', err))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    return [...assessments].sort((a, b) => {
      if (sortField === 'companyName') {
        const cmp = (a.companyName || '').localeCompare(b.companyName || '');
        return sortDir === 'asc' ? cmp : -cmp;
      }
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? da - db : db - da;
    });
  }, [assessments, sortField, sortDir]);

  const toggleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        return field;
      }
      setSortDir('asc');
      return field;
    });
  }, []);

  const toggleExpand = useCallback(async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedDetail(null);
      return;
    }
    setExpandedId(id);
    setExpandedDetail(null);
    try {
      const res = await fetch(`/api/assessments?id=${id}`);
      if (res.ok) {
        setExpandedDetail(await res.json());
      }
    } catch (err) {
      console.error('Failed to load detail:', err);
    }
  }, [expandedId]);

  const exportSingle = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/assessments?id=${id}`);
      if (!res.ok) return;
      const full: AssessmentFull = await res.json();
      await exportSingleAssessment(full);
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, []);

  const exportAll = useCallback(async () => {
    setExporting(true);
    try {
      const details = await Promise.all(
        assessments.map(a =>
          fetch(`/api/assessments?id=${a.id}`).then(r => r.json())
        )
      );
      await exportAllAssessments(details);
    } catch (err) {
      console.error('Export all failed:', err);
    } finally {
      setExporting(false);
    }
  }, [assessments]);

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' \u25B2' : ' \u25BC';
  };

  return (
    <>
      <div className="top-bar">
        <h1>Backoffice</h1>
        <div className="bar-actions">
          <Link href="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Back to Assessment
          </Link>
          {activeTab === 'assessments' && (
            <button
              className="btn btn-primary"
              onClick={exportAll}
              disabled={exporting || assessments.length === 0}
            >
              {exporting ? 'Exporting...' : 'Export All Excel'}
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="bo-tabs">
        <button
          className={`bo-tab ${activeTab === 'assessments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessments')}
        >
          Assessments
        </button>
        <button
          className={`bo-tab ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflows')}
        >
          Workflow Selector
        </button>
        <button
          className={`bo-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      <div className="main-content">
        {activeTab === 'users' ? (
          <UsersTab />
        ) : activeTab === 'assessments' ? (
          <>
            {loading ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading assessments...</p>
            ) : assessments.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
                No assessments submitted yet. Go to the <Link href="/" style={{ color: '#fbbf24' }}>assessment page</Link> to submit one.
              </p>
            ) : (
              <table className="bo-table">
                <thead>
                  <tr>
                    <th className="bo-sort-header" onClick={() => toggleSort('companyName')}>
                      Company{sortIndicator('companyName')}
                    </th>
                    <th className="bo-sort-header" onClick={() => toggleSort('createdAt')}>
                      Submitted{sortIndicator('createdAt')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(a => (
                    <Fragment key={a.id}>
                      <tr className="bo-clickable-row" onClick={() => toggleExpand(a.id)}>
                        <td>{a.companyName || '(unnamed)'}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '4px 12px', fontSize: '12px' }}
                            onClick={(e) => { e.stopPropagation(); exportSingle(a.id); }}
                          >
                            Export Excel
                          </button>
                        </td>
                      </tr>
                      {expandedId === a.id && (
                        <tr className="bo-detail-row">
                          <td colSpan={3}>
                            {expandedDetail ? (
                              <DetailView detail={expandedDetail} />
                            ) : (
                              <p style={{ color: '#94a3b8', padding: '12px' }}>Loading details...</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <WorkflowSelectorTab />
        )}
      </div>
    </>
  );
}
