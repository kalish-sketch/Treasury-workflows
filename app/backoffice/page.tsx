'use client';

import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import Link from 'next/link';
import {
  CADENCE_ORDER, CADENCE_LABELS, CADENCE_COLORS,
  stripHtmlTags, parseNumeric, formatCompact,
  collectAllWorkflows, exportSingleAssessment, exportAllAssessments,
  type AssessmentFull,
} from '@/lib/exportExcel';

interface AssessmentSummary {
  id: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

type SortField = 'companyName' | 'createdAt';
type SortDir = 'asc' | 'desc';

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
            {exporting ? 'Exporting...' : 'Export All Excel'}
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
      </div>
    </>
  );
}
