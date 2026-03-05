'use client';

import { useState, useRef, useCallback } from 'react';
import { Workflow } from '@/types';
import SubWorkflowRow from './SubWorkflowRow';

interface WorkflowRowProps {
  workflow: Workflow;
  cadenceKey: string;
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
  onUpdateSub: (cadence: string, workflowId: string, subId: string, field: string, val: string) => void;
  onAddSub: (cadence: string, workflowId: string, data: { name: string; how: string; pain: string }) => void;
}

const EMPTY_SUB = { name: '', how: '', pain: '' };

export default function WorkflowRow({
  workflow: w,
  cadenceKey,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
  onUpdateSub,
  onAddSub,
}: WorkflowRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [subDraft, setSubDraft] = useState({ ...EMPTY_SUB });
  const subNameRef = useRef<HTMLInputElement>(null);
  const hasSubs = w.subs && w.subs.length > 0;
  const subDirty = subDraft.name.trim() !== '';

  const commitSub = useCallback(() => {
    if (!subDraft.name.trim()) return;
    onAddSub(cadenceKey, w.id, { ...subDraft });
    setSubDraft({ ...EMPTY_SUB });
    setTimeout(() => subNameRef.current?.focus(), 50);
  }, [subDraft, cadenceKey, w.id, onAddSub]);

  const handleSubKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && subDirty) {
      e.preventDefault();
      commitSub();
    }
  }, [subDirty, commitSub]);

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
            <button
              className="expand-btn"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Collapse sub-workflows' : 'Expand sub-workflows'}
            >
              {expanded ? '▾' : '▸'}
            </button>
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
      {expanded && (
        <>
          {hasSubs && w.subs.map(s => (
            <SubWorkflowRow
              key={s.id}
              sub={s}
              cadenceKey={cadenceKey}
              workflowId={w.id}
              onUpdateSub={onUpdateSub}
            />
          ))}
          {/* Inline add sub-workflow row */}
          <tr className="sub-row inline-add-row" onKeyDown={handleSubKeyDown}>
            <td></td>
            <td></td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>{'\u21B3'}</span>
                <input
                  ref={subNameRef}
                  type="text"
                  className="inline-add-input name"
                  placeholder="New sub-workflow…"
                  value={subDraft.name}
                  onChange={e => setSubDraft(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </td>
            <td colSpan={2}></td>
            <td>
              <textarea
                className="inline-add-input textarea"
                placeholder="How it works…"
                value={subDraft.how}
                onChange={e => setSubDraft(prev => ({ ...prev, how: e.target.value }))}
                rows={2}
              />
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <textarea
                  className="inline-add-input textarea"
                  placeholder="Pain points…"
                  value={subDraft.pain}
                  onChange={e => setSubDraft(prev => ({ ...prev, pain: e.target.value }))}
                  rows={2}
                />
                {subDirty && (
                  <button
                    className="inline-add-commit"
                    onClick={commitSub}
                    title="Add sub-workflow (or press Enter)"
                  >
                    ↵
                  </button>
                )}
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </>
      )}
    </>
  );
}
