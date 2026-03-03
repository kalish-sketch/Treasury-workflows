import { WorkflowDataMap, Workflow, Agent } from '@/types';
import { AGENT_MAP } from '@/data/agents';

interface SummaryPanelProps {
  workflowData: WorkflowDataMap;
  customWorkflows: Record<string, Workflow[]>;
  companyName: string;
  onExport: () => void;
  onPrint: () => void;
}

export default function SummaryPanel({
  workflowData,
  customWorkflows,
  companyName,
  onExport,
  onPrint,
}: SummaryPanelProps) {
  let totalDo = 0;
  let totalWish = 0;
  let totalWorkflows = 0;
  const doIds: string[] = [];
  const wishIds: string[] = [];

  Object.keys(workflowData).forEach(cadence => {
    const all = [...workflowData[cadence].workflows, ...(customWorkflows[cadence] || [])];
    all.forEach(w => {
      totalWorkflows++;
      if (w.doToday) { totalDo++; doIds.push(w.id); }
      if (w.wishToDo) { totalWish++; wishIds.push(w.id); }
    });
  });

  const allSelected = [...new Set([...doIds, ...wishIds])];
  const relevantAgents = AGENT_MAP.filter(a =>
    a.workflows.some(wid => allSelected.includes(wid))
  );

  return (
    <>
      <div className="summary-panel">
        <h2>Assessment Summary — {companyName || 'Your Company'}</h2>
        <div className="metrics-grid">
          <div className="metric-box gold">
            <div className="big">{totalDo}</div>
            <div className="label">Workflows Done Today</div>
          </div>
          <div className="metric-box green">
            <div className="big">{totalWish}</div>
            <div className="label">Workflows Wished For</div>
          </div>
          <div className="metric-box blue">
            <div className="big">{totalWorkflows}</div>
            <div className="label">Total Workflows Mapped</div>
          </div>
          <div className="metric-box red">
            <div className="big">{relevantAgents.length}</div>
            <div className="label">Recommended Agents</div>
          </div>
        </div>

        {allSelected.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            Go to each cadence tab and check &quot;✓ Do&quot; for workflows you perform today and
            &quot;★ Wish&quot; for workflows you wish you could do. Then come back here for
            personalized agent recommendations.
          </p>
        ) : (
          <div className="agent-recs">
            <h3>Recommended Nilus Agents</h3>
            {relevantAgents.map(a => {
              const matchedCount = a.workflows.filter(wid => allSelected.includes(wid)).length;
              return (
                <div key={a.name} className="agent-card">
                  <div style={{ flex: 1 }}>
                    <div className="agent-name">{a.name}</div>
                    <div className="agent-desc">{a.desc}</div>
                    <div className="agent-impact">Impact: {a.impact}</div>
                    <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '2px' }}>
                      {matchedCount} matching workflow{matchedCount > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="export-panel">
        <h3>Export & Share</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
          Export the full assessment (company profile + workflow selections + metrics) as JSON for implementation planning.
        </p>
        <button className="btn btn-primary" onClick={onExport}>Export Assessment JSON</button>
        <button className="btn btn-secondary" style={{ marginLeft: '8px' }} onClick={onPrint}>Print Summary</button>
      </div>
    </>
  );
}
