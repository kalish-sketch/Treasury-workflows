'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { WORKFLOW_DATA } from '@/data/workflows';
import { AGENT_MAP } from '@/data/agents';
import { WorkflowDataMap, Workflow, Agent } from '@/types';
import TopBar from './TopBar';
import TabNav from './TabNav';
import CompanyProfile, { CompanyProfileHandle } from './CompanyProfile';
import WorkflowPanel from './WorkflowPanel';
import SummaryPanel from './SummaryPanel';

function deepCloneWorkflowData(): WorkflowDataMap {
  return JSON.parse(JSON.stringify(WORKFLOW_DATA));
}

function addDefaultsToWorkflowData(raw: Record<string, any>): WorkflowDataMap {
  const result: WorkflowDataMap = {};
  for (const [key, cadence] of Object.entries(raw)) {
    result[key] = {
      label: cadence.label,
      tagline: cadence.tagline,
      color: cadence.color,
      workflows: cadence.workflows.map((w: any) => ({
        ...w,
        doToday: false,
        wishToDo: false,
        subs: w.subs || [],
      })),
    };
  }
  return result;
}

export default function TreasuryApp() {
  const [activeTab, setActiveTab] = useState('profile');
  const [workflowData, setWorkflowData] = useState<WorkflowDataMap>(deepCloneWorkflowData);
  const [agents, setAgents] = useState<Agent[]>(AGENT_MAP);
  const [customWorkflows, setCustomWorkflows] = useState<Record<string, Workflow[]>>({});
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<CompanyProfileHandle>(null);

  // Try to fetch from API; if DB is empty or unavailable, keep static fallback
  useEffect(() => {
    async function fetchData() {
      try {
        const [wfRes, agRes] = await Promise.all([
          fetch('/api/workflows'),
          fetch('/api/agents'),
        ]);
        if (wfRes.ok) {
          const raw = await wfRes.json();
          if (Object.keys(raw).length > 0) {
            setWorkflowData(addDefaultsToWorkflowData(raw));
          }
        }
        if (agRes.ok) {
          const agentData = await agRes.json();
          if (agentData.length > 0) {
            setAgents(agentData);
          }
        }
      } catch (err) {
        console.error('API unavailable, using static data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const switchTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const toggleDo = useCallback((cadence: string, id: string, val: boolean) => {
    setWorkflowData(prev => {
      const next = { ...prev };
      const cadenceData = { ...next[cadence], workflows: next[cadence].workflows.map(w =>
        w.id === id ? { ...w, doToday: val } : w
      )};
      next[cadence] = cadenceData;
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(w => w.id === id ? { ...w, doToday: val } : w) };
    });
  }, []);

  const toggleWish = useCallback((cadence: string, id: string, val: boolean) => {
    setWorkflowData(prev => {
      const next = { ...prev };
      const cadenceData = { ...next[cadence], workflows: next[cadence].workflows.map(w =>
        w.id === id ? { ...w, wishToDo: val } : w
      )};
      next[cadence] = cadenceData;
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(w => w.id === id ? { ...w, wishToDo: val } : w) };
    });
  }, []);

  const updateMetric = useCallback((cadence: string, id: string, field: string, val: string) => {
    setWorkflowData(prev => {
      const next = { ...prev };
      const cadenceData = { ...next[cadence], workflows: next[cadence].workflows.map(w =>
        w.id === id ? { ...w, [field]: val } : w
      )};
      next[cadence] = cadenceData;
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(w => w.id === id ? { ...w, [field]: val } : w) };
    });
  }, []);

  const addWorkflow = useCallback((cadenceKey: string, data: {
    name: string; who: string; systems: string; how: string;
    pain: string; hrs: string; err: string; opt: string;
  }) => {
    const newId = 'custom_' + Date.now();
    const whoHtml = data.who
      ? data.who.split(',').map(w => `<span class="who-tag who-treasurer">${w.trim()}</span>`).join(' ')
      : '';
    const sysHtml = data.systems
      ? data.systems.split(',').map(s => `<span class="sys-tag">${s.trim()}</span>`).join(' ')
      : '';

    const newWorkflow: Workflow = {
      id: newId,
      name: data.name,
      timeEst: 'Custom',
      who: whoHtml,
      systems: sysHtml,
      how: data.how,
      pain: data.pain,
      hrs: data.hrs || '—',
      err: data.err || '—',
      opt: data.opt || '—',
      doToday: false,
      wishToDo: false,
      subs: [],
      custom: true,
    };

    setCustomWorkflows(prev => ({
      ...prev,
      [cadenceKey]: [...(prev[cadenceKey] || []), newWorkflow],
    }));
  }, []);

  const resetAll = useCallback(() => {
    if (!confirm('Reset all selections and custom values? This cannot be undone.')) return;
    // Try API first, fall back to static data
    fetch('/api/workflows')
      .then(r => r.json())
      .then(raw => {
        if (Object.keys(raw).length > 0) {
          setWorkflowData(addDefaultsToWorkflowData(raw));
        } else {
          setWorkflowData(deepCloneWorkflowData());
        }
      })
      .catch(() => {
        setWorkflowData(deepCloneWorkflowData());
      });
    setCustomWorkflows({});
  }, []);

  const exportJSON = useCallback(() => {
    const profile = profileRef.current?.getProfile() || {
      company: '', revenue: '', industry: '', entities: '', countries: '',
      currencies: [], teamSize: '', numBanks: '', banks: [], numAccounts: '',
      erp: '', tms: '', otherSystems: [], paymentVolume: '', facilities: '',
    };

    const workflows: Record<string, unknown[]> = {};
    Object.keys(workflowData).forEach(cadence => {
      const all = [...workflowData[cadence].workflows, ...(customWorkflows[cadence] || [])];
      workflows[cadence] = all.map(w => ({
        id: w.id, name: w.name, doToday: w.doToday, wishToDo: w.wishToDo,
        hrs: w.hrs, errCost: w.err, optimization: w.opt,
        how: w.how, pain: w.pain,
        custom: w.custom || false,
        subs: (w.subs || []).map(s => ({ id: s.id, name: s.name })),
      }));
    });

    const allSelected: string[] = [];
    Object.values(workflows).flat().forEach((w: any) => {
      if (w.doToday || w.wishToDo) allSelected.push(w.id);
    });
    const filteredAgents = agents
      .filter(a => a.workflows.some(wid => allSelected.includes(wid)))
      .map(a => ({ name: a.name, desc: a.desc, impact: a.impact }));

    const data = {
      exportDate: new Date().toISOString(),
      profile,
      workflows,
      recommendedAgents: filteredAgents,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile.company || 'company').replace(/\s+/g, '-').toLowerCase()}-treasury-assessment.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowData, customWorkflows, agents]);

  const printSummary = useCallback(() => {
    window.print();
  }, []);

  const companyName = useMemo(() => {
    return profileRef.current?.getProfile().company || 'Your Company';
  }, [activeTab]);

  const cadenceKeys = Object.keys(workflowData);

  return (
    <>
      <TopBar
        onReset={resetAll}
        onExport={exportJSON}
        onViewRecommendations={() => switchTab('summary')}
      />
      <div className="main-content">
        <TabNav activeTab={activeTab} onTabChange={switchTab} />

        <div className="tab-panel" style={{ display: activeTab === 'profile' ? 'block' : 'none' }}>
          <CompanyProfile ref={profileRef} />
        </div>

        {cadenceKeys.map(key => (
          <div key={key} className="tab-panel" style={{ display: activeTab === key ? 'block' : 'none' }}>
            <WorkflowPanel
              cadenceKey={key}
              cadence={workflowData[key]}
              customWorkflows={customWorkflows[key] || []}
              onToggleDo={toggleDo}
              onToggleWish={toggleWish}
              onUpdateMetric={updateMetric}
              onAddWorkflow={addWorkflow}
            />
          </div>
        ))}

        <div className="tab-panel" style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
          <SummaryPanel
            workflowData={workflowData}
            customWorkflows={customWorkflows}
            agents={agents}
            companyName={companyName}
            onExport={exportJSON}
            onPrint={printSummary}
          />
        </div>
      </div>
    </>
  );
}
