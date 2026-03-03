"use client";

import { CadenceKey, Workflow, SubWorkflow } from "@/data/types";

interface WorkflowTableProps {
  cadenceKey: CadenceKey;
  label: string;
  tagline: string;
  workflows: Workflow[];
  onToggleDo: (cadence: CadenceKey, id: string, val: boolean) => void;
  onToggleWish: (cadence: CadenceKey, id: string, val: boolean) => void;
  onUpdateMetric: (
    cadence: CadenceKey,
    id: string,
    field: "hrs" | "err" | "opt",
    val: string
  ) => void;
  onAddWorkflow: (cadence: CadenceKey) => void;
}

function SubRow({ sub }: { sub: SubWorkflow }) {
  return (
    <tr className="sub-row">
      <td></td>
      <td></td>
      <td>
        <span className="sub-name">&darr; {sub.name}</span>
      </td>
      <td colSpan={2}></td>
      <td style={{ fontSize: "11px" }}>{sub.how}</td>
      <td className="pain-text">{sub.pain}</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
}

function WorkflowRow({
  workflow,
  cadenceKey,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
}: {
  workflow: Workflow;
  cadenceKey: CadenceKey;
  onToggleDo: (cadence: CadenceKey, id: string, val: boolean) => void;
  onToggleWish: (cadence: CadenceKey, id: string, val: boolean) => void;
  onUpdateMetric: (
    cadence: CadenceKey,
    id: string,
    field: "hrs" | "err" | "opt",
    val: string
  ) => void;
}) {
  return (
    <tr>
      <td className="toggle-cell">
        <input
          type="checkbox"
          className="toggle-cb"
          checked={workflow.doToday}
          onChange={(e) => onToggleDo(cadenceKey, workflow.id, e.target.checked)}
          title="We do this today"
        />
      </td>
      <td className="toggle-cell">
        <input
          type="checkbox"
          className="toggle-cb wish-cb"
          checked={workflow.wishToDo}
          onChange={(e) =>
            onToggleWish(cadenceKey, workflow.id, e.target.checked)
          }
          title="We wish we could do this"
        />
      </td>
      <td>
        <span className="workflow-name">{workflow.name}</span>
        <br />
        <span className="time-est">{workflow.timeEst}</span>
      </td>
      <td>
        {workflow.who.map((w, i) => (
          <span key={i} className={`who-tag ${w.className}`}>
            {w.label}
          </span>
        ))}
      </td>
      <td>
        {workflow.systems.map((s, i) => (
          <span key={i} className="sys-tag">
            {s.label}
          </span>
        ))}
      </td>
      <td style={{ fontSize: "11px" }}>{workflow.how}</td>
      <td className="pain-text">{workflow.pain}</td>
      <td className="metric-cell hrs">
        <input
          type="text"
          value={workflow.hrs}
          onChange={(e) =>
            onUpdateMetric(cadenceKey, workflow.id, "hrs", e.target.value)
          }
        />
      </td>
      <td className="metric-cell err">
        <input
          type="text"
          value={workflow.err}
          onChange={(e) =>
            onUpdateMetric(cadenceKey, workflow.id, "err", e.target.value)
          }
        />
      </td>
      <td className="metric-cell opt">
        <input
          type="text"
          value={workflow.opt}
          onChange={(e) =>
            onUpdateMetric(cadenceKey, workflow.id, "opt", e.target.value)
          }
        />
      </td>
    </tr>
  );
}

export default function WorkflowTable({
  cadenceKey,
  label,
  tagline,
  workflows,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
  onAddWorkflow,
}: WorkflowTableProps) {
  return (
    <div className={`cadence-section ${cadenceKey}`}>
      <div className="cadence-header">
        <span className="cadence-badge">{label}</span>
        <span className="cadence-title">{tagline}</span>
      </div>
      <table>
        <colgroup>
          <col style={{ width: "3%" }} />
          <col style={{ width: "3%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead>
          <tr>
            <th title="We do this today">&#10003; Do</th>
            <th title="We wish we could do this">&#9733; Wish</th>
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
          {workflows.flatMap((w) => [
            <WorkflowRow
              key={w.id}
              workflow={w}
              cadenceKey={cadenceKey}
              onToggleDo={onToggleDo}
              onToggleWish={onToggleWish}
              onUpdateMetric={onUpdateMetric}
            />,
            ...(w.subs || []).map((s) => <SubRow key={s.id} sub={s} />),
          ])}
          <tr className="add-row" onClick={() => onAddWorkflow(cadenceKey)}>
            <td colSpan={10}>+ Add custom workflow&hellip;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
