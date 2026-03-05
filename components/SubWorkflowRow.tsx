'use client';

import { SubWorkflow } from '@/types';

interface SubWorkflowRowProps {
  sub: SubWorkflow;
  cadenceKey: string;
  workflowId: string;
  onUpdateSub: (cadence: string, workflowId: string, subId: string, field: string, val: string) => void;
}

export default function SubWorkflowRow({ sub, cadenceKey, workflowId, onUpdateSub }: SubWorkflowRowProps) {
  return (
    <tr className="sub-row">
      <td></td>
      <td></td>
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
