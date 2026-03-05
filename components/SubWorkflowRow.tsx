'use client';

import { SubWorkflow } from '@/types';

interface SubWorkflowRowProps {
  sub: SubWorkflow;
  cadenceKey: string;
  workflowId: string;
  onUpdateSub: (cadence: string, workflowId: string, subId: string, field: string, val: string) => void;
  onToggleSubDo: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
  onToggleSubWish: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
}

export default function SubWorkflowRow({ sub, cadenceKey, workflowId, onUpdateSub, onToggleSubDo, onToggleSubWish }: SubWorkflowRowProps) {
  return (
    <tr className="sub-row">
      <td className="toggle-cell">
        <input
          type="checkbox"
          className="toggle-cb"
          checked={sub.doToday || false}
          onChange={e => onToggleSubDo(cadenceKey, workflowId, sub.id, e.target.checked)}
          title="We do this today"
        />
      </td>
      <td className="toggle-cell">
        <input
          type="checkbox"
          className="toggle-cb wish-cb"
          checked={sub.wishToDo || false}
          onChange={e => onToggleSubWish(cadenceKey, workflowId, sub.id, e.target.checked)}
          title="We wish we could do this"
        />
      </td>
      <td><span className="sub-name">{'\u21B3'} {sub.name}</span></td>
      <td colSpan={2}></td>
      <td className="editable-text-cell">
        <textarea
          className="inline-textarea"
          defaultValue={sub.how}
          onBlur={e => onUpdateSub(cadenceKey, workflowId, sub.id, 'how', e.target.value)}
          rows={2}
        />
      </td>
      <td className="editable-text-cell">
        <textarea
          className="inline-textarea pain"
          defaultValue={sub.pain}
          onBlur={e => onUpdateSub(cadenceKey, workflowId, sub.id, 'pain', e.target.value)}
          rows={2}
        />
      </td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
}
