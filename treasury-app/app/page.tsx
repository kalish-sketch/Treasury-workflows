"use client";

import { useState, useCallback } from "react";
import {
  CadenceKey,
  Workflow,
  CompanyProfile as ProfileType,
} from "@/data/types";
import { WORKFLOW_DATA } from "@/data/workflows";
import { AGENT_MAP } from "@/data/agents";
import TopBar from "@/components/TopBar";
import TabNav, { TabId } from "@/components/TabNav";
import CompanyProfile from "@/components/CompanyProfile";
import WorkflowTable from "@/components/WorkflowTable";
import SummaryPanel from "@/components/SummaryPanel";
import AddWorkflowModal from "@/components/AddWorkflowModal";

function deepCloneWorkflows() {
  const clone: typeof WORKFLOW_DATA = {} as typeof WORKFLOW_DATA;
  for (const key of Object.keys(WORKFLOW_DATA) as CadenceKey[]) {
    clone[key] = {
      ...WORKFLOW_DATA[key],
      workflows: WORKFLOW_DATA[key].workflows.map((w) => ({
        ...w,
        subs: [...w.subs],
      })),
    };
  }
  return clone;
}

const INITIAL_PROFILE: ProfileType = {
  company: "",
  revenue: "",
  industry: "",
  entities: "",
  countries: "",
  currencies: [],
  teamSize: "",
  numBanks: "",
  banks: [],
  numAccounts: "",
  erp: "",
  tms: "",
  otherSystems: [],
  paymentVolume: "",
  facilities: "",
};

const CADENCE_KEYS: CadenceKey[] = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "annual",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [workflowData, setWorkflowData] = useState(() =>
    deepCloneWorkflows()
  );
  const [customWorkflows, setCustomWorkflows] = useState<
    Record<string, Workflow[]>
  >({});
  const [profile, setProfile] = useState<ProfileType>(INITIAL_PROFILE);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCadence, setModalCadence] = useState<CadenceKey | null>(null);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  const handleToggleDo = useCallback(
    (cadence: CadenceKey, id: string, val: boolean) => {
      setWorkflowData((prev) => {
        const next = { ...prev };
        next[cadence] = {
          ...next[cadence],
          workflows: next[cadence].workflows.map((w) =>
            w.id === id ? { ...w, doToday: val } : w
          ),
        };
        return next;
      });
      setCustomWorkflows((prev) => {
        if (!prev[cadence]) return prev;
        return {
          ...prev,
          [cadence]: prev[cadence].map((w) =>
            w.id === id ? { ...w, doToday: val } : w
          ),
        };
      });
    },
    []
  );

  const handleToggleWish = useCallback(
    (cadence: CadenceKey, id: string, val: boolean) => {
      setWorkflowData((prev) => {
        const next = { ...prev };
        next[cadence] = {
          ...next[cadence],
          workflows: next[cadence].workflows.map((w) =>
            w.id === id ? { ...w, wishToDo: val } : w
          ),
        };
        return next;
      });
      setCustomWorkflows((prev) => {
        if (!prev[cadence]) return prev;
        return {
          ...prev,
          [cadence]: prev[cadence].map((w) =>
            w.id === id ? { ...w, wishToDo: val } : w
          ),
        };
      });
    },
    []
  );

  const handleUpdateMetric = useCallback(
    (
      cadence: CadenceKey,
      id: string,
      field: "hrs" | "err" | "opt",
      val: string
    ) => {
      setWorkflowData((prev) => {
        const next = { ...prev };
        next[cadence] = {
          ...next[cadence],
          workflows: next[cadence].workflows.map((w) =>
            w.id === id ? { ...w, [field]: val } : w
          ),
        };
        return next;
      });
      setCustomWorkflows((prev) => {
        if (!prev[cadence]) return prev;
        return {
          ...prev,
          [cadence]: prev[cadence].map((w) =>
            w.id === id ? { ...w, [field]: val } : w
          ),
        };
      });
    },
    []
  );

  const handleAddWorkflow = useCallback((cadence: CadenceKey) => {
    setModalCadence(cadence);
    setModalOpen(true);
  }, []);

  const handleSaveWorkflow = useCallback(
    (
      cadence: CadenceKey,
      data: {
        name: string;
        who: string;
        systems: string;
        how: string;
        pain: string;
        hrs: string;
        err: string;
        opt: string;
      }
    ) => {
      const newId = "custom_" + Date.now();
      const whoTags = data.who
        .split(",")
        .filter((w) => w.trim())
        .map((w) => ({ label: w.trim(), className: "who-treasurer" }));
      const sysTags = data.systems
        .split(",")
        .filter((s) => s.trim())
        .map((s) => ({ label: s.trim() }));

      const newWorkflow: Workflow = {
        id: newId,
        name: data.name,
        timeEst: "Custom",
        who: whoTags,
        systems: sysTags,
        how: data.how,
        pain: data.pain,
        hrs: data.hrs || "\u2014",
        err: data.err || "\u2014",
        opt: data.opt || "\u2014",
        doToday: false,
        wishToDo: false,
        subs: [],
        custom: true,
      };

      setCustomWorkflows((prev) => ({
        ...prev,
        [cadence]: [...(prev[cadence] || []), newWorkflow],
      }));
      setModalOpen(false);
    },
    []
  );

  const handleReset = useCallback(() => {
    if (
      !confirm("Reset all selections and custom values? This cannot be undone.")
    )
      return;
    setWorkflowData(deepCloneWorkflows());
    setCustomWorkflows({});
  }, []);

  const handleExport = useCallback(() => {
    const workflows: Record<string, unknown[]> = {};
    (Object.keys(workflowData) as CadenceKey[]).forEach((cadence) => {
      const all = [
        ...workflowData[cadence].workflows,
        ...(customWorkflows[cadence] || []),
      ];
      workflows[cadence] = all.map((w) => ({
        id: w.id,
        name: w.name,
        doToday: w.doToday,
        wishToDo: w.wishToDo,
        hrs: w.hrs,
        errCost: w.err,
        optimization: w.opt,
        custom: w.custom || false,
        subs: (w.subs || []).map((s) => ({ id: s.id, name: s.name })),
      }));
    });

    const allSelected: string[] = [];
    Object.values(workflows)
      .flat()
      .forEach((w: unknown) => {
        const wf = w as { doToday: boolean; wishToDo: boolean; id: string };
        if (wf.doToday || wf.wishToDo) allSelected.push(wf.id);
      });

    const agents = AGENT_MAP.filter((a) =>
      a.workflows.some((wid) => allSelected.includes(wid))
    ).map((a) => ({ name: a.name, desc: a.desc, impact: a.impact }));

    const data = {
      exportDate: new Date().toISOString(),
      profile,
      workflows,
      recommendedAgents: agents,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(profile.company || "company").replace(/\s+/g, "-").toLowerCase()}-treasury-assessment.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowData, customWorkflows, profile]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <TopBar
        onReset={handleReset}
        onExport={handleExport}
        onViewRecommendations={() => setActiveTab("summary")}
      />
      <div className="main-content">
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "profile" && (
          <CompanyProfile profile={profile} onChange={setProfile} />
        )}

        {CADENCE_KEYS.map(
          (cadence) =>
            activeTab === cadence && (
              <WorkflowTable
                key={cadence}
                cadenceKey={cadence}
                label={workflowData[cadence].label}
                tagline={workflowData[cadence].tagline}
                workflows={[
                  ...workflowData[cadence].workflows,
                  ...(customWorkflows[cadence] || []),
                ]}
                onToggleDo={handleToggleDo}
                onToggleWish={handleToggleWish}
                onUpdateMetric={handleUpdateMetric}
                onAddWorkflow={handleAddWorkflow}
              />
            )
        )}

        {activeTab === "summary" && (
          <SummaryPanel
            workflowData={workflowData}
            customWorkflows={customWorkflows}
            companyName={profile.company}
            onExport={handleExport}
            onPrint={handlePrint}
          />
        )}
      </div>

      <AddWorkflowModal
        isOpen={modalOpen}
        cadence={modalCadence}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveWorkflow}
      />
    </>
  );
}
