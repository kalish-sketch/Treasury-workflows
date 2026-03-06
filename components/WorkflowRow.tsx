'use client';

import { useState, useRef, useCallback } from 'react';
import { Workflow } from '@/types';
import SubWorkflowRow from './SubWorkflowRow';
import WorkflowTagCell from './WorkflowTagCell';

const CADENCE_LABELS: Record<string, string> = {
  daily: 'D', weekly: 'W', monthly: 'M', quarterly: 'Q', annual: 'A',
};
const CADENCE_COLORS: Record<string, string> = {
  daily: '#e74c3c', weekly: '#e67e22', monthly: '#3498db', quarterly: '#8e44ad', annual: '#16a085',
};
const CADENCE_FULL_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};

interface WorkflowRowProps {
  workflow: Workflow;
  cadenceKey: string;
  allCadenceKeys: string[];
  readOnly?: boolean;
  sourceCadence?: string;
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
  onUpdateSub: (cadence: string, workflowId: string, subId: string, field: string, val: string) => void;
  onToggleSubDo: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
  onToggleSubWish: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
  onAddSub: (cadence: string, workflowId: string, data: { name: string; how: string; pain: string }) => void;
  onUpdateCadences: (cadence: string, id: string, cadences: string[]) => void;
}

const EMPTY_SUB = { name: '', how: '', pain: '' };

export default function WorkflowRow({
  workflow: w,
  cadenceKey,
  allCadenceKeys,
  readOnly = false,
  sourceCadence,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
  onUpdateSub,
  onToggleSubDo,
  onToggleSubWish,
  onAddSub,
  onUpdateCadences,
}: WorkflowRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [subDraft, setSubDraft] = useState({ ...EMPTY_SUB });
  const subNameRef = useRef<HTMLInputElement>(null);
  const hasSubs = w.subs && w.subs.length > 0;
  const subDirty = subDraft.name.trim() !== '';

  const activeCadences = w.cadences || [cadenceKey];

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

  const toggleCadence = (c: string) => {
    if (c === cadenceKey) return; // can't remove source cadence
    const current = [...activeCadences];
    const idx = current.indexOf(c);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(c);
    }
    onUpdateCadences(cadenceKey, w.id, current);
  };

  const colCount = 11; // total columns with Freq

  return (
    <>
      <tr className={readOnly ? 'linked-row' : ''}>
        <td className="toggle-cell">
          {readOnly ? (
            <span className="all-wf-check" style={{ fontSize: '10px', color: w.doToday ? '#22c55e' : '#9ca3af' }}>
              {w.doToday ? '✓' : '—'}
            </span>
          ) : (
            <input
              type="checkbox"
              className="toggle-cb"
              checked={w.doToday}
              onChange={e => onToggleDo(cadenceKey, w.id, e.target.checked)}
              title="We do this today"
            />
          )}
        </td>
        <td className="toggle-cell">
          {readOnly ? (
            <span className="all-wf-check" style={{ fontSize: '10px', color: w.wishToDo ? '#f59e0b' : '#9ca3af' }}>
              {w.wishToDo ? '★' : '—'}
            </span>
          ) : (
            <input
              type="checkbox"
              className="toggle-cb wish-cb"
              checked={w.wishToDo}
              onChange={e => onToggleWish(cadenceKey, w.id, e.target.checked)}
              title="We wish we could do this"
            />
          )}
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
              {readOnly && sourceCadence && (
                <span
                  className="cadence-badge-small"
                  style={{ background: CADENCE_COLORS[sourceCadence], marginLeft: '6px', fontSize: '8px' }}
                >
                  From {CADENCE_FULL_LABELS[sourceCadence]}
                </span>
              )}
              <br />
              <span className="time-est">{w.timeEst || ''}</span>
            </div>
          </div>
        </td>
        <td>
          {readOnly ? (
            <div dangerouslySetInnerHTML={{ __html: w.who || '<span style="color:#9ca3af;font-size:10px">—</span>' }} />
          ) : (
            <WorkflowTagCell
              htmlContent={w.who}
              type="who"
              onChange={(html) => onUpdateMetric(cadenceKey, w.id, 'who', html)}
            />
          )}
        </td>
        <td>
          {readOnly ? (
            <div dangerouslySetInnerHTML={{ __html: w.systems || '<span style="color:#9ca3af;font-size:10px">—</span>' }} />
          ) : (
            <WorkflowTagCell
              htmlContent={w.systems}
              type="systems"
              onChange={(html) => onUpdateMetric(cadenceKey, w.id, 'systems', html)}
            />
          )}
        </td>
        <td className="editable-text-cell">
          {readOnly ? (
            <div className="all-wf-text" style={{ fontSize: '11px' }}>{w.how || '—'}</div>
          ) : (
            <textarea
              className="inline-textarea"
              defaultValue={w.how}
              onBlur={e => onUpdateMetric(cadenceKey, w.id, 'how', e.target.value)}
              rows={3}
            />
          )}
        </td>
        <td className="editable-text-cell pain-text">
          {readOnly ? (
            <div className="all-wf-text pain-text" style={{ fontSize: '11px' }}>{w.pain || '—'}</div>
          ) : (
            <textarea
              className="inline-textarea pain"
              defaultValue={w.pain}
              onBlur={e => onUpdateMetric(cadenceKey, w.id, 'pain', e.target.value)}
              rows={3}
            />
          )}
        </td>
        <td className="metric-cell hrs">
          {readOnly ? (
            <span style={{ fontSize: '11px' }}>{w.hrs || '—'}</span>
          ) : (
            <input
              type="text"
              defaultValue={w.hrs}
              onBlur={e => onUpdateMetric(cadenceKey, w.id, 'hrs', e.target.value)}
            />
          )}
        </td>
        <td className="metric-cell err">
          {readOnly ? (
            <span style={{ fontSize: '11px' }}>{w.err || '—'}</span>
          ) : (
            <input
              type="text"
              defaultValue={w.err}
              onBlur={e => onUpdateMetric(cadenceKey, w.id, 'err', e.target.value)}
            />
          )}
        </td>
        <td className="metric-cell opt">
          {readOnly ? (
            <span style={{ fontSize: '11px' }}>{w.opt || '—'}</span>
          ) : (
            <input
              type="text"
              defaultValue={w.opt}
              onBlur={e => onUpdateMetric(cadenceKey, w.id, 'opt', e.target.value)}
            />
          )}
        </td>
        <td className="freq-cell">
          {readOnly ? (
            <span
              className="cadence-badge-small"
              style={{ background: CADENCE_COLORS[sourceCadence || cadenceKey], fontSize: '9px' }}
            >
              {CADENCE_FULL_LABELS[sourceCadence || cadenceKey]}
            </span>
          ) : (
            <div className="freq-pills">
              {allCadenceKeys.map(c => {
                const isSource = c === cadenceKey;
                const isActive = activeCadences.includes(c);
                return (
                  <button
                    key={c}
                    className={`freq-pill ${isActive ? 'freq-pill-active' : ''} ${isSource ? 'freq-pill-source' : ''}`}
                    style={isActive ? { background: CADENCE_COLORS[c], borderColor: CADENCE_COLORS[c] } : {}}
                    onClick={() => toggleCadence(c)}
                    disabled={isSource}
                    title={isSource ? `Source cadence (${CADENCE_FULL_LABELS[c]})` : `Toggle ${CADENCE_FULL_LABELS[c]}`}
                  >
                    {CADENCE_LABELS[c]}
                  </button>
                );
              })}
            </div>
          )}
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
              readOnly={readOnly}
              onUpdateSub={onUpdateSub}
              onToggleSubDo={onToggleSubDo}
              onToggleSubWish={onToggleSubWish}
              colCount={colCount}
            />
          ))}
          {/* Inline add sub-workflow row — only for editable rows */}
          {!readOnly && (
            <tr className="sub-row inline-add-row" onKeyDown={handleSubKeyDown}>
              <td className="toggle-cell"><span className="add-row-hint">+</span></td>
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
              <td></td>
            </tr>
          )}
        </>
      )}
    </>
  );
}
