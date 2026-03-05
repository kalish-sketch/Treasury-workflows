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

function escapeCSV(val: string): string {
  if (!val) return '';
  const s = String(val).replace(/"/g, '""');
  return `"${s}"`;
}

function flattenAssessmentToRow(a: AssessmentFull) {
  const p = a.profile || {};
  let doCount = 0;
  let wishCount = 0;
  const doNames: string[] = [];
  const wishNames: string[] = [];

  for (const wfs of Object.values(a.workflowSelections || {})) {
    for (const w of (wfs as any[])) {
      if (w.doToday) { doCount++; doNames.push(w.name); }
      if (w.wishToDo) { wishCount++; wishNames.push(w.name); }
    }
  }
  for (const wfs of Object.values(a.customWorkflows || {})) {
    for (const w of (wfs as any[])) {
      if (w.doToday) { doCount++; doNames.push(w.name); }
      if (w.wishToDo) { wishCount++; wishNames.push(w.name); }
    }
  }

  return {
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
    'Workflows Do Today': String(doCount),
    'Workflows Wish To Do': String(wishCount),
    'Do Today Names': doNames.join('; '),
    'Wish To Do Names': wishNames.join('; '),
    'Submitted': new Date(a.createdAt).toLocaleDateString(),
  };
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
  const cadenceLabels: Record<string, string> = {
    daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
    quarterly: 'Quarterly', annual: 'Annual',
  };

  return (
    <div className="bo-detail">
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

      {/* Workflow Selections */}
      {Object.entries(detail.workflowSelections || {}).map(([cadence, wfs]) => {
        const selected = (wfs as any[]).filter((w: any) => w.doToday || w.wishToDo);
        if (selected.length === 0) return null;
        return (
          <div key={cadence} className="bo-detail-section">
            <h4>{cadenceLabels[cadence] || cadence} Workflows</h4>
            <ul className="bo-wf-list">
              {selected.map((w: any) => (
                <li key={w.id}>
                  <span className="bo-wf-name">{w.name}</span>
                  {w.doToday && <span className="bo-tag bo-tag-do">Do Today</span>}
                  {w.wishToDo && <span className="bo-tag bo-tag-wish">Wish To Do</span>}
                  {w.hrs && w.hrs !== '—' && <span className="bo-wf-meta">{w.hrs} hrs/mo</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Custom Workflows */}
      {Object.entries(detail.customWorkflows || {}).some(([, wfs]) => (wfs as any[]).length > 0) && (
        <div className="bo-detail-section">
          <h4>Custom Workflows</h4>
          {Object.entries(detail.customWorkflows || {}).map(([cadence, wfs]) => {
            if (!(wfs as any[]).length) return null;
            return (
              <div key={cadence}>
                <h5 style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{cadenceLabels[cadence] || cadence}</h5>
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
      const row = flattenAssessmentToRow(full);
      const csv = generateCSV([row]);
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
      const rows = details.map(flattenAssessmentToRow);
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
