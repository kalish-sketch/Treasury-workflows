'use client';

import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import Link from 'next/link';

interface AssessmentSummary {
  id: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

interface AssessmentFull {
  id: string;
  companyName: string;
  profile: Record<string, any>;
  workflowSelections: Record<string, any[]>;
  customWorkflows: Record<string, any[]>;
  createdAt: string;
  updatedAt: string;
}

type SortField = 'companyName' | 'createdAt';
type SortDir = 'asc' | 'desc';

const CADENCE_ORDER = ['daily', 'weekly', 'monthly', 'quarterly', 'annual'];
const CADENCE_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
  quarterly: 'Quarterly', annual: 'Annual',
};
const CADENCE_COLORS: Record<string, string> = {
  daily: '#e74c3c', weekly: '#e67e22', monthly: '#3498db', quarterly: '#8e44ad', annual: '#16a085',
};

function escapeCSV(val: string): string {
  if (!val) return '';
  const s = String(val).replace(/"/g, '""');
  return `"${s}"`;
}

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
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function formatCompact(val: number): string {
  if (val === 0) return '—';
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return val.toFixed(0);
}

function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

interface WorkflowEntry {
  name: string;
  doToday: boolean;
  wishToDo: boolean;
  hrs: string;
  errCost: string;
  optimization: string;
  who: string;
  systems: string;
  how: string;
  pain: string;
  cadences: string[];
  custom: boolean;
  subs: { id: string; name: string }[];
}

function collectAllWorkflows(a: AssessmentFull) {
  const all: { cadence: string; w: WorkflowEntry }[] = [];
  let doCount = 0, wishCount = 0, notSelectedCount = 0;
  let doHrs = 0, wishHrs = 0, doErr = 0, doOpt = 0;
  const doNames: string[] = [];
  const wishNames: string[] = [];
  const notSelectedNames: string[] = [];

  for (const cadence of CADENCE_ORDER) {
    const wfs = (a.workflowSelections || {})[cadence] || [];
    const customs = (a.customWorkflows || {})[cadence] || [];
    for (const w of [...(wfs as any[]), ...(customs as any[])]) {
      const entry: WorkflowEntry = {
        name: w.name,
        doToday: !!w.doToday,
        wishToDo: !!w.wishToDo,
        hrs: w.hrs || '',
        errCost: w.errCost || w.err || '',
        optimization: w.optimization || w.opt || '',
        who: stripHtmlTags(w.who || ''),
        systems: stripHtmlTags(w.systems || ''),
        how: w.how || '',
        pain: w.pain || '',
        cadences: w.cadences || [cadence],
        custom: !!w.custom,
        subs: w.subs || [],
      };
      all.push({ cadence, w: entry });

      if (entry.doToday) {
        doCount++; doNames.push(entry.name);
        doHrs += parseNumeric(entry.hrs);
        doErr += parseNumeric(entry.errCost);
        doOpt += parseNumeric(entry.optimization);
      }
      if (entry.wishToDo) {
        wishCount++; wishNames.push(entry.name);
        wishHrs += parseNumeric(entry.hrs);
      }
      if (!entry.doToday && !entry.wishToDo) {
        notSelectedCount++; notSelectedNames.push(entry.name);
      }
    }
  }

  return {
    all, doCount, wishCount, notSelectedCount,
    doHrs, wishHrs, doErr, doOpt,
    doNames, wishNames, notSelectedNames,
    totalCount: all.length,
  };
}

function flattenAssessmentToRows(a: AssessmentFull): Record<string, string>[] {
  const p = a.profile || {};
  const rows: Record<string, string>[] = [];

  const profileCols: Record<string, string> = {
    'Company': p.company || a.companyName || '',
    'Industry': p.industry || '',
    'Revenue': p.revenue || '',
    'Entities': p.entities || '',
    'Countries': p.countries || '',
    'Currencies': Array.isArray(p.currencies) ? p.currencies.join('; ') : '',
    'Team Size': p.teamSize || '',
    'Banks': Array.isArray(p.banks) ? p.banks.join('; ') : '',
    'Num Banks': p.numBanks || '',
    'Num Accounts': p.numAccounts || '',
    'ERP': p.erp || '',
    'TMS': p.tms || '',
    'Other Systems': Array.isArray(p.otherSystems) ? p.otherSystems.join('; ') : '',
    'Payment Volume': p.paymentVolume || '',
    'Facilities': p.facilities || '',
  };

  for (const cadence of CADENCE_ORDER) {
    const wfs = (a.workflowSelections || {})[cadence] || [];
    const customs = (a.customWorkflows || {})[cadence] || [];
    for (const w of [...(wfs as any[]), ...(customs as any[])]) {
      const row: Record<string, string> = {
        ...profileCols,
        'Cadence': CADENCE_LABELS[cadence] || cadence,
        'Workflow': w.name || '',
        'Custom': w.custom ? 'Yes' : '',
        'Do Today': w.doToday ? 'Yes' : '',
        'Wish To Do': w.wishToDo ? 'Yes' : '',
        'Who': stripHtmlTags(w.who || ''),
        'Systems': stripHtmlTags(w.systems || ''),
        'How It Works': stripHtmlTags(w.how || ''),
        'Pain Points': stripHtmlTags(w.pain || ''),
        'Hrs/Mo': w.hrs || '',
        'Error Cost': w.errCost || w.err || '',
        '$ Optimization': w.optimization || w.opt || '',
        'Assigned Cadences': (w.cadences || [cadence]).map((c: string) => CADENCE_LABELS[c] || c).join(', '),
        'Sub-Workflows': (w.subs || []).map((s: any) => s.name).join('; '),
        'Submitted': new Date(a.createdAt).toLocaleDateString(),
      };
      rows.push(row);
    }
  }

  return rows;
}

function generateCSV(rows: Record<string, string>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(h => escapeCSV(h)).join(','),
    ...rows.map(row => headers.map(h => escapeCSV(row[h])).join(',')),
  ];
  return lines.join('\n');
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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

// ── Main Backoffice Page ──

export default function BackofficePage() {
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
      const rows = flattenAssessmentToRows(full);
      const csv = generateCSV(rows);
      downloadCSV(csv, `${(full.companyName || 'assessment').replace(/\s+/g, '-').toLowerCase()}.csv`);
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
      const rows = details.flatMap(flattenAssessmentToRows);
      const csv = generateCSV(rows);
      downloadCSV(csv, `all-assessments-${new Date().toISOString().slice(0, 10)}.csv`);
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
        <h1>Backoffice — Assessment Reviews</h1>
        <div className="bar-actions">
          <Link href="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Back to Assessment
          </Link>
          <button
            className="btn btn-primary"
            onClick={exportAll}
            disabled={exporting || assessments.length === 0}
          >
            {exporting ? 'Exporting...' : 'Export All CSV'}
          </button>
        </div>
      </div>

      <div className="main-content">
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
                        Export CSV
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
      </div>
    </>
  );
}
