'use client';

import { WorkflowDataMap, Workflow } from '@/types';
import WorkflowTagCell from './WorkflowTagCell';

interface AllWorkflowsPanelProps {
  workflowData: WorkflowDataMap;
  customWorkflows: Record<string, Workflow[]>;
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
  onUpdateCadences: (cadence: string, id: string, cadences: string[]) => void;
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
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
  onUpdateCadences,
}: AllWorkflowsPanelProps) {
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

  function handleCadenceToggle(sourceCadence: string, wId: string, currentCadences: string[] | undefined, toggledCadence: string, checked: boolean) {
    const current = currentCadences || [sourceCadence];
    let updated: string[];
    if (checked) {
      updated = [...new Set([...current, toggledCadence])];
    } else {
      updated = current.filter(c => c !== toggledCadence);
      // Ensure at least the source cadence remains
      if (updated.length === 0) updated = [sourceCadence];
    }
    onUpdateCadences(sourceCadence, wId, updated);
  }

  return (
    <div className="cadence-section all-workflows">
      <div className="cadence-header">
        <span className="cadence-badge" style={{ background: '#1a1a2e' }}>All</span>
        <span className="cadence-title">All Workflows — Frequency Overview</span>
      </div>
      <table>
        <colgroup>
          <col style={{ width: '2.5%' }} />
          <col style={{ width: '2.5%' }} />
          <col style={{ width: '5%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '5%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '18%' }} />
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
            const activeCadences = w.cadences || [cadence];
            return (
              <tr key={`${cadence}-${w.id}`}>
                <td className="toggle-cell">
                  <input
                    type="checkbox"
                    className="toggle-cb"
                    checked={w.doToday}
                    onChange={e => onToggleDo(cadence, w.id, e.target.checked)}
                    title="We do this today"
                  />
                </td>
                <td className="toggle-cell">
                  <input
                    type="checkbox"
                    className="toggle-cb wish-cb"
                    checked={w.wishToDo}
                    onChange={e => onToggleWish(cadence, w.id, e.target.checked)}
                    title="We wish we could do this"
                  />
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
                  <span className="workflow-name">{w.name}</span>
                  <br />
                  <span className="time-est">{w.timeEst || ''}</span>
                </td>
                <td>
                  <WorkflowTagCell
                    htmlContent={w.who}
                    type="who"
                    onChange={(html) => onUpdateMetric(cadence, w.id, 'who', html)}
                  />
                </td>
                <td>
                  <WorkflowTagCell
                    htmlContent={w.systems}
                    type="systems"
                    onChange={(html) => onUpdateMetric(cadence, w.id, 'systems', html)}
                  />
                </td>
                <td className="editable-text-cell">
                  <textarea
                    className="inline-textarea"
                    defaultValue={w.how}
                    onBlur={e => onUpdateMetric(cadence, w.id, 'how', e.target.value)}
                    rows={3}
                  />
                </td>
                <td className="editable-text-cell pain-text">
                  <textarea
                    className="inline-textarea pain"
                    defaultValue={w.pain}
                    onBlur={e => onUpdateMetric(cadence, w.id, 'pain', e.target.value)}
                    rows={3}
                  />
                </td>
                <td className="metric-cell hrs">
                  <input
                    type="text"
                    defaultValue={w.hrs}
                    onBlur={e => onUpdateMetric(cadence, w.id, 'hrs', e.target.value)}
                  />
                </td>
                <td className="metric-cell err">
                  <input
                    type="text"
                    defaultValue={w.err}
                    onBlur={e => onUpdateMetric(cadence, w.id, 'err', e.target.value)}
                  />
                </td>
                <td className="metric-cell opt">
                  <input
                    type="text"
                    defaultValue={w.opt}
                    onBlur={e => onUpdateMetric(cadence, w.id, 'opt', e.target.value)}
                  />
                </td>
                <td className="frequency-cell">
                  <div className="freq-checkboxes">
                    {CADENCE_ORDER.map(c => (
                      <label key={c} className="freq-label" title={CADENCE_LABELS[c]}>
                        <input
                          type="checkbox"
                          className="freq-cb"
                          checked={activeCadences.includes(c)}
                          onChange={e => handleCadenceToggle(cadence, w.id, w.cadences, c, e.target.checked)}
                        />
                        <span className="freq-abbr" style={{ color: CADENCE_COLORS[c] }}>
                          {CADENCE_LABELS[c].charAt(0)}
                        </span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
