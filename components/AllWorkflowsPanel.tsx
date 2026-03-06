'use client';

import { useState, Fragment } from 'react';
import { WorkflowDataMap, Workflow } from '@/types';

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

export default function AllWorkflowsPanel({
  workflowData,
  customWorkflows,
}: AllWorkflowsPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Flatten all workflows with their source cadence
  const allRows: { cadence: string; workflow: Workflow }[] = [];
  for (const cadence of CADENCE_ORDER) {
    const cd = workflowData[cadence];
    if (!cd) continue;
    for (const w of cd.workflows) {
      allRows.push({ cadence, workflow: w });
    }
    for (const w of (customWorkflows[cadence] || [])) {
      allRows.push({ cadence, workflow: w });
    }
  }

  return (
    <div className="cadence-section all-workflows">
      <div className="cadence-header">
        <span className="cadence-badge" style={{ background: '#1a1a2e' }}>All</span>
        <span className="cadence-title">All Workflows — Summary View</span>
      </div>
      <p className="note">
        This is a read-only overview. Edit workflows in their respective cadence tabs (Daily, Weekly, etc.).
      </p>
      <table>
        <colgroup>
          <col style={{ width: '3%' }} />
          <col style={{ width: '3%' }} />
          <col style={{ width: '5%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '20%' }} />
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
          {allRows.map(({ cadence, workflow: w }) => {
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
    </div>
  );
}
