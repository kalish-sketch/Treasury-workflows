import { Workflow } from '@/types';

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
  return (
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
        <span className="workflow-name">{w.name}</span>
        <br />
        <span className="time-est">{w.timeEst || ''}</span>
      </td>
      <td dangerouslySetInnerHTML={{ __html: w.who }} />
      <td dangerouslySetInnerHTML={{ __html: w.systems }} />
      <td style={{ fontSize: '11px' }}>{w.how}</td>
      <td className="pain-text">{w.pain}</td>
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
  );
}
