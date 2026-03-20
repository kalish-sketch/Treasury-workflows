'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { CadenceData, Workflow } from '@/types';
import { parseNumeric } from '@/lib/parseNumeric';
import WorkflowRow from './WorkflowRow';

const CADENCE_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};
const CADENCE_COLORS: Record<string, string> = {
  daily: '#e74c3c', weekly: '#e67e22', monthly: '#3498db', quarterly: '#8e44ad', annual: '#16a085',
};

interface WorkflowPanelProps {
  cadenceKey: string;
  cadence: CadenceData;
  customWorkflows: Workflow[];
  linkedWorkflows: { workflow: Workflow; sourceCadence: string }[];
  allCadenceKeys: string[];
  editedFields?: Set<string>;
  onToggleDo: (cadence: string, id: string, val: boolean) => void;
  onToggleWish: (cadence: string, id: string, val: boolean) => void;
  onUpdateMetric: (cadence: string, id: string, field: string, val: string) => void;
  onAddWorkflow: (cadenceKey: string, data: {
    name: string; who: string; systems: string; how: string;
    pain: string; hrs: string; err: string; opt: string;
  }) => void;
  onUpdateSub: (cadence: string, workflowId: string, subId: string, field: string, val: string) => void;
  onToggleSubDo: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
  onToggleSubWish: (cadence: string, workflowId: string, subId: string, val: boolean) => void;
  onAddSub: (cadence: string, workflowId: string, data: { name: string; how: string; pain: string }) => void;
  onUpdateCadences: (cadence: string, id: string, cadences: string[]) => void;
}

const EMPTY_ROW = { name: '', who: '', systems: '', how: '', pain: '', hrs: '', err: '', opt: '' };

export default function WorkflowPanel({
  cadenceKey,
  cadence,
  customWorkflows,
  linkedWorkflows,
  allCadenceKeys,
  onToggleDo,
  onToggleWish,
  onUpdateMetric,
  onAddWorkflow,
  onUpdateSub,
  onToggleSubDo,
  onToggleSubWish,
  onAddSub,
  onUpdateCadences,
  editedFields,
}: WorkflowPanelProps) {
  const allWorkflows = [...cadence.workflows, ...customWorkflows];
  const allWithLinked = [...allWorkflows, ...linkedWorkflows.map(l => l.workflow)];
  const doCount = allWithLinked.filter(w => w.doToday).length;
  const wishCount = allWithLinked.filter(w => w.wishToDo).length;
  const [draft, setDraft] = useState({ ...EMPTY_ROW });
  const nameRef = useRef<HTMLInputElement>(null);

  // ── Filter & Sort state ──
  const [filterDo, setFilterDo] = useState<'all' | 'yes' | 'no'>('all');
  const [filterWish, setFilterWish] = useState<'all' | 'yes' | 'no'>('all');
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterWho, setFilterWho] = useState('');
  const [filterSystems, setFilterSystems] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allWorkflows.forEach(w => cats.add(w.category || 'Uncategorized'));
    return Array.from(cats).sort();
  }, [allWorkflows]);

  const hasActiveFilters = filterDo !== 'all' || filterWish !== 'all' || filterText !== '' || filterCategory !== 'all' || filterWho !== '' || filterSystems !== '';

  const clearFilters = () => {
    setFilterDo('all'); setFilterWish('all'); setFilterText(''); setFilterCategory('all'); setFilterWho(''); setFilterSystems('');
  };

  const displayWorkflows = useMemo(() => {
    let list = [...allWorkflows];

    // Apply filters
    if (filterDo !== 'all') list = list.filter(w => filterDo === 'yes' ? w.doToday : !w.doToday);
    if (filterWish !== 'all') list = list.filter(w => filterWish === 'yes' ? w.wishToDo : !w.wishToDo);
    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      list = list.filter(w => w.name.toLowerCase().includes(q));
    }
    if (filterCategory !== 'all') list = list.filter(w => (w.category || 'Uncategorized') === filterCategory);
    if (filterWho.trim()) {
      const q = filterWho.toLowerCase();
      list = list.filter(w => stripHtml(w.who || '').toLowerCase().includes(q));
    }
    if (filterSystems.trim()) {
      const q = filterSystems.toLowerCase();
      list = list.filter(w => stripHtml(w.systems || '').toLowerCase().includes(q));
    }

    // Apply sort
    if (sortField) {
      list.sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case 'name': cmp = a.name.localeCompare(b.name); break;
          case 'category': cmp = (a.category || 'Uncategorized').localeCompare(b.category || 'Uncategorized'); break;
          case 'hrs': cmp = parseNumeric(a.hrs) - parseNumeric(b.hrs); break;
          case 'err': cmp = parseNumeric(a.err) - parseNumeric(b.err); break;
          case 'opt': cmp = parseNumeric(a.opt) - parseNumeric(b.opt); break;
        }
        return sortDir === 'desc' ? -cmp : cmp;
      });
    }

    return list;
  }, [allWorkflows, filterDo, filterWish, filterText, filterCategory, filterWho, filterSystems, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (sortField !== field) { setSortField(field); setSortDir('asc'); }
    else if (sortDir === 'asc') { setSortDir('desc'); }
    else { setSortField(null); setSortDir('asc'); }
  };

  const sortIndicator = (field: string) => {
    if (sortField === field) return sortDir === 'asc' ? ' ▲' : ' ▼';
    return ' ⇅';
  };

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
      <div className="selection-counts" style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: 600, padding: '6px 4px' }}>
        <span style={{ color: '#22c55e' }}>✓ Do: {doCount}</span>
        <span style={{ color: '#f59e0b' }}>★ Wish: {wishCount}</span>
        {hasActiveFilters && (
          <span style={{ color: '#6b7280' }}>
            Showing {displayWorkflows.length} of {allWorkflows.length}
          </span>
        )}
      </div>
      <table>
        <colgroup>
          <col style={{ width: '3%' }} />
          <col style={{ width: '3%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '4%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '5%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '7%' }} />
        </colgroup>
        <thead>
          <tr>
            <th title="We do this today">✓ Do</th>
            <th title="We wish we could do this">★ Wish</th>
            <th className="th-sortable" onClick={() => handleSort('name')}>Workflow<span className="sort-indicator">{sortIndicator('name')}</span></th>
            <th className="th-sortable" onClick={() => handleSort('category')}>Category<span className="sort-indicator">{sortIndicator('category')}</span></th>
            <th>Subs</th>
            <th>Who</th>
            <th>Systems</th>
            <th>How It Actually Works</th>
            <th>Pain Points</th>
            <th className="th-sortable" onClick={() => handleSort('hrs')}>Hrs/Mo<span className="sort-indicator">{sortIndicator('hrs')}</span></th>
            <th className="th-sortable" onClick={() => handleSort('err')}>Error Cost<span className="sort-indicator">{sortIndicator('err')}</span></th>
            <th className="th-sortable" onClick={() => handleSort('opt')}>$ Optimization<span className="sort-indicator">{sortIndicator('opt')}</span></th>
            <th>Freq</th>
          </tr>
          <tr className="filter-row">
            <td>
              <select value={filterDo} onChange={e => setFilterDo(e.target.value as 'all' | 'yes' | 'no')}>
                <option value="all">All</option>
                <option value="yes">✓</option>
                <option value="no">—</option>
              </select>
            </td>
            <td>
              <select value={filterWish} onChange={e => setFilterWish(e.target.value as 'all' | 'yes' | 'no')}>
                <option value="all">All</option>
                <option value="yes">★</option>
                <option value="no">—</option>
              </select>
            </td>
            <td>
              <input type="text" placeholder="Search…" value={filterText} onChange={e => setFilterText(e.target.value)} />
            </td>
            <td>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </td>
            <td></td>
            <td>
              <input type="text" placeholder="Search…" value={filterWho} onChange={e => setFilterWho(e.target.value)} />
            </td>
            <td>
              <input type="text" placeholder="Search…" value={filterSystems} onChange={e => setFilterSystems(e.target.value)} />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters} title="Clear all filters">
                  Clear
                </button>
              )}
            </td>
          </tr>
        </thead>
        <tbody>
          {displayWorkflows.length === 0 && hasActiveFilters && (
            <tr>
              <td colSpan={13} style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>
                No workflows match the current filters.{' '}
                <button onClick={clearFilters} style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
                  Clear filters
                </button>
              </td>
            </tr>
          )}
          {displayWorkflows.map(w => (
            <WorkflowRow
              key={w.id}
              workflow={w}
              cadenceKey={cadenceKey}
              allCadenceKeys={allCadenceKeys}
              editedFields={editedFields}
              onToggleDo={onToggleDo}
              onToggleWish={onToggleWish}
              onUpdateMetric={onUpdateMetric}
              onUpdateSub={onUpdateSub}
              onToggleSubDo={onToggleSubDo}
              onToggleSubWish={onToggleSubWish}
              onAddSub={onAddSub}
              onUpdateCadences={onUpdateCadences}
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
            <td></td>{/* category */}
            <td></td>{/* subs */}
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
            <td></td>
          </tr>

          {/* Linked workflows from other cadences */}
          {linkedWorkflows.length > 0 && (
            <>
              <tr className="linked-divider-row">
                <td colSpan={13}>
                  Linked from other cadences
                </td>
              </tr>
              {linkedWorkflows.map(({ workflow: w, sourceCadence }) => (
                <WorkflowRow
                  key={`linked-${sourceCadence}-${w.id}`}
                  workflow={w}
                  cadenceKey={sourceCadence}
                  allCadenceKeys={allCadenceKeys}
                  readOnly
                  sourceCadence={sourceCadence}
                  onToggleDo={onToggleDo}
                  onToggleWish={onToggleWish}
                  onUpdateMetric={onUpdateMetric}
                  onUpdateSub={onUpdateSub}
                  onToggleSubDo={onToggleSubDo}
                  onToggleSubWish={onToggleSubWish}
                  onAddSub={onAddSub}
                  onUpdateCadences={onUpdateCadences}
                />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
