'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { WORKFLOW_DATA } from '@/data/workflows';
import { AGENT_MAP } from '@/data/agents';
import { WorkflowDataMap, Workflow, Agent } from '@/types';
import TopBar from './TopBar';
import TabNav from './TabNav';
import CompanyProfile, { CompanyProfileHandle } from './CompanyProfile';
import WorkflowPanel from './WorkflowPanel';
import AllWorkflowsPanel from './AllWorkflowsPanel';
import SummaryPanel from './SummaryPanel';

function deepCloneWorkflowData(): WorkflowDataMap {
  const raw = JSON.parse(JSON.stringify(WORKFLOW_DATA)) as WorkflowDataMap;
  for (const [cadenceKey, cadence] of Object.entries(raw)) {
    for (const w of cadence.workflows) {
      w.subs = w.subs.map(s => ({ ...s, doToday: s.doToday ?? false, wishToDo: s.wishToDo ?? false }));
      w.cadences = w.cadences || [cadenceKey];
    }
  }
  return raw;
}

function addDefaultsToWorkflowData(raw: Record<string, any>): WorkflowDataMap {
  const result: WorkflowDataMap = {};
  for (const [key, cadence] of Object.entries(raw)) {
    result[key] = {
      label: cadence.label,
      tagline: cadence.tagline,
      color: cadence.color,
      workflows: cadence.workflows
        .map((w: any) => ({
          ...w,
          doToday: false,
          wishToDo: false,
          cadences: w.cadences || [key],
          subs: (w.subs || []).map((s: any) => ({ ...s, doToday: false, wishToDo: false })),
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
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
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
        w.id === id ? { ...w, doToday: val, ...(val ? { wishToDo: false } : {}) } : w
      )};
      next[cadence] = cadenceData;
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(w => w.id === id ? { ...w, doToday: val, ...(val ? { wishToDo: false } : {}) } : w) };
    });
  }, []);

  const toggleWish = useCallback((cadence: string, id: string, val: boolean) => {
    setWorkflowData(prev => {
      const next = { ...prev };
      const cadenceData = { ...next[cadence], workflows: next[cadence].workflows.map(w =>
        w.id === id ? { ...w, wishToDo: val, ...(val ? { doToday: false } : {}) } : w
      )};
      next[cadence] = cadenceData;
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(w => w.id === id ? { ...w, wishToDo: val, ...(val ? { doToday: false } : {}) } : w) };
    });
  }, []);

  const updateMetric = useCallback((cadence: string, id: string, field: string, val: string) => {
    setEditedFields(prev => {
      const next = new Set(prev);
      next.add(`${cadence}:${id}:${field}`);
      return next;
    });
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
      cadences: [cadenceKey],
    };

    setCustomWorkflows(prev => ({
      ...prev,
      [cadenceKey]: [...(prev[cadenceKey] || []), newWorkflow],
    }));
  }, []);

  const updateSub = useCallback((cadence: string, workflowId: string, subId: string, field: string, val: string) => {
    const updateSubs = (w: Workflow) => {
      if (w.id !== workflowId) return w;
      return { ...w, subs: w.subs.map(s => s.id === subId ? { ...s, [field]: val } : s) };
    };
    setWorkflowData(prev => {
      const next = { ...prev };
      next[cadence] = { ...next[cadence], workflows: next[cadence].workflows.map(updateSubs) };
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(updateSubs) };
    });
  }, []);

  const addSub = useCallback((cadence: string, workflowId: string, data: { name: string; how: string; pain: string }) => {
    const newSub = { id: 'sub_' + Date.now(), name: data.name, how: data.how, pain: data.pain, doToday: false, wishToDo: false };
    const appendSub = (w: Workflow) => {
      if (w.id !== workflowId) return w;
      return { ...w, subs: [...w.subs, newSub] };
    };
    setWorkflowData(prev => {
      const next = { ...prev };
      next[cadence] = { ...next[cadence], workflows: next[cadence].workflows.map(appendSub) };
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(appendSub) };
    });
  }, []);

  const toggleSubDo = useCallback((cadence: string, workflowId: string, subId: string, val: boolean) => {
    const update = (w: Workflow) => {
      if (w.id !== workflowId) return w;
      return { ...w, subs: w.subs.map(s => s.id === subId ? { ...s, doToday: val, ...(val ? { wishToDo: false } : {}) } : s) };
    };
    setWorkflowData(prev => {
      const next = { ...prev };
      next[cadence] = { ...next[cadence], workflows: next[cadence].workflows.map(update) };
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(update) };
    });
  }, []);

  const toggleSubWish = useCallback((cadence: string, workflowId: string, subId: string, val: boolean) => {
    const update = (w: Workflow) => {
      if (w.id !== workflowId) return w;
      return { ...w, subs: w.subs.map(s => s.id === subId ? { ...s, wishToDo: val, ...(val ? { doToday: false } : {}) } : s) };
    };
    setWorkflowData(prev => {
      const next = { ...prev };
      next[cadence] = { ...next[cadence], workflows: next[cadence].workflows.map(update) };
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(update) };
    });
  }, []);

  const updateCadences = useCallback((cadence: string, id: string, cadences: string[]) => {
    setWorkflowData(prev => {
      const next = { ...prev };
      next[cadence] = { ...next[cadence], workflows: next[cadence].workflows.map(w =>
        w.id === id ? { ...w, cadences } : w
      )};
      return next;
    });
    setCustomWorkflows(prev => {
      const arr = prev[cadence];
      if (!arr) return prev;
      return { ...prev, [cadence]: arr.map(w => w.id === id ? { ...w, cadences } : w) };
    });
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
    setEditedFields(new Set());
  }, []);

  const buildPayload = useCallback(() => {
    const profile = profileRef.current?.getProfile() || {
      company: '', revenue: '', industry: '', entities: '', countries: '',
      currencies: [], teamSize: '', numBanks: '', banks: [], numAccounts: '',
      erp: '', tms: '', otherSystems: [], paymentVolume: '', facilities: '',
    };

    // Helper: only include a field value if the user has confirmed/edited it
    const confirmedVal = (cadence: string, id: string, field: string, val: string) => {
      return editedFields.has(`${cadence}:${id}:${field}`) ? val : '';
    };

    const wfSelections: Record<string, unknown[]> = {};
    Object.keys(workflowData).forEach(cadence => {
      wfSelections[cadence] = workflowData[cadence].workflows.map(w => ({
        id: w.id, name: w.name, doToday: w.doToday, wishToDo: w.wishToDo,
        hrs: confirmedVal(cadence, w.id, 'hrs', w.hrs),
        errCost: confirmedVal(cadence, w.id, 'err', w.err),
        optimization: confirmedVal(cadence, w.id, 'opt', w.opt),
        how: confirmedVal(cadence, w.id, 'how', w.how),
        pain: confirmedVal(cadence, w.id, 'pain', w.pain),
        who: confirmedVal(cadence, w.id, 'who', w.who),
        systems: confirmedVal(cadence, w.id, 'systems', w.systems),
        cadences: w.cadences,
        subs: (w.subs || []).map(s => ({ id: s.id, name: s.name, how: s.how, pain: s.pain, doToday: s.doToday, wishToDo: s.wishToDo })),
      }));
    });

    const customWfs: Record<string, unknown[]> = {};
    Object.keys(customWorkflows).forEach(cadence => {
      customWfs[cadence] = (customWorkflows[cadence] || []).map(w => ({
        id: w.id, name: w.name, doToday: w.doToday, wishToDo: w.wishToDo,
        hrs: w.hrs, errCost: w.err, optimization: w.opt,
        how: w.how, pain: w.pain, who: w.who, systems: w.systems,
        cadences: w.cadences, custom: true, subs: [],
      }));
    });

    return {
      companyName: profile.company || '',
      profile,
      workflowSelections: wfSelections,
      customWorkflows: customWfs,
    };
  }, [workflowData, customWorkflows, editedFields]);

  const saveAssessment = useCallback(async () => {
    if (!profileRef.current?.validate()) {
      setActiveTab('profile');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }
      alert('Saved!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error saving: ${msg}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [buildPayload]);

  const submitAssessment = useCallback(async () => {
    if (!profileRef.current?.validate()) {
      setActiveTab('profile');
      return;
    }
    setSubmitting(true);
    try {
      const payload = buildPayload();
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }
      alert('Assessment submitted successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error submitting assessment: ${msg}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [buildPayload]);

  const printSummary = useCallback(() => {
    window.print();
  }, []);

  const companyName = useMemo(() => {
    return profileRef.current?.getProfile().company || 'Your Company';
  }, [activeTab]);

  const cadenceKeys = Object.keys(workflowData);

  // Derive linked workflows: for each tab, find workflows from OTHER cadences that include this tab
  const linkedWorkflowsByCadence = useMemo(() => {
    const result: Record<string, { workflow: Workflow; sourceCadence: string }[]> = {};
    for (const targetCadence of cadenceKeys) {
      const linked: { workflow: Workflow; sourceCadence: string }[] = [];
      for (const sourceCadence of cadenceKeys) {
        if (sourceCadence === targetCadence) continue;
        const allWfs = [
          ...workflowData[sourceCadence].workflows,
          ...(customWorkflows[sourceCadence] || []),
        ];
        for (const w of allWfs) {
          if (w.cadences && w.cadences.includes(targetCadence)) {
            linked.push({ workflow: w, sourceCadence });
          }
        }
      }
      result[targetCadence] = linked;
    }
    return result;
  }, [workflowData, customWorkflows, cadenceKeys]);

  return (
    <>
      <TopBar
        onReset={resetAll}
        onSave={saveAssessment}
        saving={saving}
        onSubmit={submitAssessment}
        submitting={submitting}
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
              linkedWorkflows={linkedWorkflowsByCadence[key] || []}
              allCadenceKeys={cadenceKeys}
              editedFields={editedFields}
              onToggleDo={toggleDo}
              onToggleWish={toggleWish}
              onUpdateMetric={updateMetric}
              onAddWorkflow={addWorkflow}
              onUpdateSub={updateSub}
              onToggleSubDo={toggleSubDo}
              onToggleSubWish={toggleSubWish}
              onAddSub={addSub}
              onUpdateCadences={updateCadences}
            />
          </div>
        ))}

        <div className="tab-panel" style={{ display: activeTab === 'all' ? 'block' : 'none' }}>
          <AllWorkflowsPanel
            workflowData={workflowData}
            customWorkflows={customWorkflows}
          />
        </div>

        <div className="tab-panel" style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
          <SummaryPanel
            workflowData={workflowData}
            customWorkflows={customWorkflows}
            agents={agents}
            companyName={companyName}
            onSubmit={submitAssessment}
            submitting={submitting}
            onPrint={printSummary}
          />
        </div>
      </div>
    </>
  );
}
