'use client';

import { useState, useRef, useCallback } from 'react';
import { CadenceData, Workflow } from '@/types';
import WorkflowRow from './WorkflowRow';

interface WorkflowPanelProps {
  cadenceKey: string;
  cadence: CadenceData;
  customWorkflows: Workflow[];
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
  onAddWorkflow: (cadenceKey: string, data: {
    name: string; who: string; systems: string; how: string;
    pain: string; hrs: string; err: string; opt: string;
  }) => void;
}

const EMPTY_ROW = { name: '', who: '', systems: '', how: '', pain: '', hrs: '', err: '', opt: '' };

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
  const [draft, setDraft] = useState({ ...EMPTY_ROW });
  const nameRef = useRef<HTMLInputElement>(null);

  const isDirty = draft.name.trim() !== '';

  const commitRow = useCallback(() => {
    if (!draft.name.trim()) return;
    onAddWorkflow(cadenceKey, { ...draft });
    setDraft({ ...EMPTY_ROW });
    // re-focus the name field for rapid entry
    setTimeout(() => nameRef.current?.focus(), 50);
  }, [draft, cadenceKey, onAddWorkflow]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isDirty) {
      e.preventDefault();
      commitRow();
    }
  }, [isDirty, commitRow]);

  const updateDraft = (field: string, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

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
            <WorkflowRow
              key={w.id}
              workflow={w}
              cadenceKey={cadenceKey}
              onToggleDo={onToggleDo}
              onToggleWish={onToggleWish}
              onUpdateMetric={onUpdateMetric}
            />
          ))}
          {/* Inline empty row for adding custom workflows */}
          <tr className="inline-add-row" onKeyDown={handleKeyDown}>
            <td className="toggle-cell">
              <span className="add-row-hint">+</span>
            </td>
            <td className="toggle-cell"></td>
            <td>
              <input
                ref={nameRef}
                type="text"
                className="inline-add-input name"
                placeholder="New workflow name…"
                value={draft.name}
                onChange={e => updateDraft('name', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="inline-add-input"
                placeholder="Who"
                value={draft.who}
                onChange={e => updateDraft('who', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="inline-add-input"
                placeholder="Systems"
                value={draft.systems}
                onChange={e => updateDraft('systems', e.target.value)}
              />
            </td>
            <td>
              <textarea
                className="inline-add-input textarea"
                placeholder="How it works…"
                value={draft.how}
                onChange={e => updateDraft('how', e.target.value)}
                rows={2}
              />
            </td>
            <td>
              <textarea
                className="inline-add-input textarea"
                placeholder="Pain points…"
                value={draft.pain}
                onChange={e => updateDraft('pain', e.target.value)}
                rows={2}
              />
            </td>
            <td>
              <input
                type="text"
                className="inline-add-input metric"
                placeholder="Hrs"
                value={draft.hrs}
                onChange={e => updateDraft('hrs', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="inline-add-input metric"
                placeholder="Err $"
                value={draft.err}
                onChange={e => updateDraft('err', e.target.value)}
              />
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="text"
                  className="inline-add-input metric"
                  placeholder="Opt $"
                  value={draft.opt}
                  onChange={e => updateDraft('opt', e.target.value)}
                />
                {isDirty && (
                  <button
                    className="inline-add-commit"
                    onClick={commitRow}
                    title="Add workflow (or press Enter)"
                  >
                    ↵
                  </button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
