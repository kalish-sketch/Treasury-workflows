'use client';

import { useState } from 'react';
import { Workflow } from '@/types';
import SubWorkflowRow from './SubWorkflowRow';

interface WorkflowRowProps {
  workflow: Workflow;
  cadenceKey: string;
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
}

export default function WorkflowRow({
  workflow: w,
  cadenceKey,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
}: WorkflowRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasSubs = w.subs && w.subs.length > 0;

  return (
    <>
      <tr>
        <td className="toggle-cell">
          <input
            type="checkbox"
            className="toggle-cb"
            checked={w.doToday}
            onChange={e => onToggleDo(cadenceKey, w.id, e.target.checked)}
            title="We do this today"
          />
        </td>
        <td className="toggle-cell">
          <input
            type="checkbox"
            className="toggle-cb wish-cb"
            checked={w.wishToDo}
            onChange={e => onToggleWish(cadenceKey, w.id, e.target.checked)}
            title="We wish we could do this"
          />
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {hasSubs && (
              <button
                className="expand-btn"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? 'Collapse sub-workflows' : 'Expand sub-workflows'}
              >
                {expanded ? '▾' : '▸'}
              </button>
            )}
            <div>
              <span className="workflow-name">{w.name}</span>
              <br />
              <span className="time-est">{w.timeEst || ''}</span>
            </div>
          </div>
        </td>
        <td dangerouslySetInnerHTML={{ __html: w.who }} />
        <td dangerouslySetInnerHTML={{ __html: w.systems }} />
        <td className="editable-text-cell">
          <textarea
            className="inline-textarea"
            defaultValue={w.how}
            onBlur={e => onUpdateMetric(cadenceKey, w.id, 'how', e.target.value)}
            rows={3}
          />
        </td>
        <td className="editable-text-cell pain-text">
          <textarea
            className="inline-textarea pain"
            defaultValue={w.pain}
            onBlur={e => onUpdateMetric(cadenceKey, w.id, 'pain', e.target.value)}
            rows={3}
          />
        </td>
        <td className="metric-cell hrs">
          <input
            type="text"
            defaultValue={w.hrs}
            onBlur={e => onUpdateMetric(cadenceKey, w.id, 'hrs', e.target.value)}
          />
        </td>
        <td className="metric-cell err">
          <input
            type="text"
            defaultValue={w.err}
            onBlur={e => onUpdateMetric(cadenceKey, w.id, 'err', e.target.value)}
          />
        </td>
        <td className="metric-cell opt">
          <input
            type="text"
            defaultValue={w.opt}
            onBlur={e => onUpdateMetric(cadenceKey, w.id, 'opt', e.target.value)}
          />
        </td>
      </tr>
      {expanded && hasSubs && w.subs.map(s => (
        <SubWorkflowRow key={s.id} sub={s} />
      ))}
    </>
  );
}
