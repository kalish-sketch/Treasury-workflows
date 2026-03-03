import { Fragment } from 'react';
import { CadenceData, Workflow } from '@/types';
import WorkflowRow from './WorkflowRow';
import SubWorkflowRow from './SubWorkflowRow';

interface WorkflowPanelProps {
  cadenceKey: string;
  cadence: CadenceData;
  customWorkflows: Workflow[];
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
  onAddWorkflow: (cadenceKey: string) => void;
}

export default function WorkflowPanel({
  cadenceKey,
  cadence,
  customWorkflows,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
  onAddWorkflow,
}: WorkflowPanelProps) {
  const allWorkflows = [...cadence.workflows, ...customWorkflows];

  return (
    <div className={`cadence-section ${cadenceKey}`}>
      <div className="cadence-header">
        <span className="cadence-badge">{cadence.label}</span>
        <span className="cadence-title">{cadence.tagline}</span>
      </div>
      <table>
        <colgroup>
          <col style={{ width: '3%' }} />
          <col style={{ width: '3%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '8%' }} />
        </colgroup>
        <thead>
          <tr>
            <th title="We do this today">✓ Do</th>
            <th title="We wish we could do this">★ Wish</th>
            <th>Workflow</th>
            <th>Who</th>
            <th>Systems</th>
            <th>How It Actually Works</th>
            <th>Pain Points</th>
            <th>Hrs/Mo</th>
            <th>Error Cost</th>
            <th>$ Optimization</th>
          </tr>
        </thead>
        <tbody>
          {allWorkflows.map(w => (
            <Fragment key={w.id}>
              <WorkflowRow
                workflow={w}
                cadenceKey={cadenceKey}
                onToggleDo={onToggleDo}
                onToggleWish={onToggleWish}
                onUpdateMetric={onUpdateMetric}
              />
              {(w.subs || []).map(s => (
                <SubWorkflowRow key={s.id} sub={s} />
              ))}
            </Fragment>
          ))}
          <tr className="add-row" onClick={() => onAddWorkflow(cadenceKey)}>
            <td colSpan={10}>+ Add custom workflow…</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
