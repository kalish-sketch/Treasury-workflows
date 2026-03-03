"use client";

import { WorkflowDataMap, CadenceKey, Workflow, AgentRec } from "@/data/types";
import { AGENT_MAP } from "@/data/agents";

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

  (Object.keys(workflowData) as CadenceKey[]).forEach((cadence) => {
    const all = [
      ...workflowData[cadence].workflows,
      ...(customWorkflows[cadence] || []),
    ];
    all.forEach((w) => {
      totalWorkflows++;
      if (w.doToday) {
        totalDo++;
        doIds.push(w.id);
      }
      if (w.wishToDo) {
        totalWish++;
        wishIds.push(w.id);
      }
    });
  });

  const allSelected = [...new Set([...doIds, ...wishIds])];
  const relevantAgents = AGENT_MAP.filter((a) =>
    a.workflows.some((wid) => allSelected.includes(wid))
  );

  const displayName = companyName || "Your Company";

  return (
    <div>
      <div className="summary-panel">
        <h2>Assessment Summary &mdash; {displayName}</h2>
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
          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Go to each cadence tab and check &ldquo;&#10003; Do&rdquo; for
            workflows you perform today and &ldquo;&#9733; Wish&rdquo; for
            workflows you wish you could do. Then come back here for
            personalized agent recommendations.
          </p>
        ) : (
          <div className="agent-recs">
            <h3>Recommended Nilus Agents</h3>
            {relevantAgents.map((agent) => {
              const matchedCount = agent.workflows.filter((wid) =>
                allSelected.includes(wid)
              ).length;
              return (
                <div key={agent.name} className="agent-card">
                  <div style={{ flex: 1 }}>
                    <div className="agent-name">{agent.name}</div>
                    <div className="agent-desc">{agent.desc}</div>
                    <div className="agent-impact">Impact: {agent.impact}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#60a5fa",
                        marginTop: "2px",
                      }}
                    >
                      {matchedCount} matching workflow
                      {matchedCount > 1 ? "s" : ""}
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
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
          Export the full assessment (company profile + workflow selections +
          metrics) as JSON for implementation planning.
        </p>
        <button className="btn btn-primary" onClick={onExport}>
          Export Assessment JSON
        </button>
        <button
          className="btn btn-secondary"
          style={{ marginLeft: "8px", color: "#1a1a2e" }}
          onClick={onPrint}
        >
          Print Summary
        </button>
      </div>
    </div>
  );
}
