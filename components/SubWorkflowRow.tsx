'use client';

import { SubWorkflow } from '@/types';

interface SubWorkflowRowProps {
  sub: SubWorkflow;
  cadenceKey: string;
  workflowId: string;
  readOnly?: boolean;
  colCount?: number;
  onUpdateSub: (cadence: string, workflowId: string, subId: string, field: string, val: string) => void;
  onToggleSubDo: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
  onToggleSubWish: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
}

export default function SubWorkflowRow({ sub, cadenceKey, workflowId, readOnly, colCount = 10, onUpdateSub, onToggleSubDo, onToggleSubWish }: SubWorkflowRowProps) {
  const trailingCols = colCount - 7; // 7 = do + wish + name + who/sys(2) + how + pain
  return (
    <tr className={`sub-row ${readOnly ? 'linked-row' : ''}`}>
      <td className="toggle-cell">
        {readOnly ? (
          <span className="all-wf-check" style={{ fontSize: '10px', color: sub.doToday ? '#22c55e' : '#9ca3af' }}>
            {sub.doToday ? '✓' : '—'}
          </span>
        ) : (
          <input
            type="checkbox"
            className="toggle-cb"
            checked={sub.doToday || false}
            onChange={e => onToggleSubDo(cadenceKey, workflowId, sub.id, e.target.checked)}
            title="We do this today"
          />
        )}
      </td>
      <td className="toggle-cell">
        {readOnly ? (
          <span className="all-wf-check" style={{ fontSize: '10px', color: sub.wishToDo ? '#f59e0b' : '#9ca3af' }}>
            {sub.wishToDo ? '★' : '—'}
          </span>
        ) : (
          <input
            type="checkbox"
            className="toggle-cb wish-cb"
            checked={sub.wishToDo || false}
            onChange={e => onToggleSubWish(cadenceKey, workflowId, sub.id, e.target.checked)}
            title="We wish we could do this"
          />
        )}
      </td>
      <td><span className="sub-name">{'\u21B3'} {sub.name}</span></td>
      <td colSpan={2}></td>
      <td className="editable-text-cell">
        {readOnly ? (
          <div className="all-wf-text" style={{ fontSize: '10px' }}>{sub.how || '—'}</div>
        ) : (
          <textarea
            className="inline-textarea"
            defaultValue={sub.how}
            onBlur={e => onUpdateSub(cadenceKey, workflowId, sub.id, 'how', e.target.value)}
            rows={2}
          />
        )}
      </td>
      <td className="editable-text-cell">
        {readOnly ? (
          <div className="all-wf-text pain-text" style={{ fontSize: '10px' }}>{sub.pain || '—'}</div>
        ) : (
          <textarea
            className="inline-textarea pain"
            defaultValue={sub.pain}
            onBlur={e => onUpdateSub(cadenceKey, workflowId, sub.id, 'pain', e.target.value)}
            rows={2}
          />
        )}
      </td>
      {Array.from({ length: trailingCols }).map((_, i) => (
        <td key={i}></td>
      ))}
    </tr>
  );
}
