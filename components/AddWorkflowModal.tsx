'use client';

import { useState } from 'react';

interface AddWorkflowModalProps {
  isOpen: boolean;
  cadenceKey: string;
  onClose: () => void;
  onSave: (cadenceKey: string, workflow: {
    name: string;
    who: string;
    systems: string;
    how: string;
    pain: string;
    hrs: string;
    err: string;
    opt: string;
  }) => void;
}

export default function AddWorkflowModal({
  isOpen,
  cadenceKey,
  onClose,
  onSave,
}: AddWorkflowModalProps) {
  const [name, setName] = useState('');
  const [who, setWho] = useState('');
  const [systems, setSystems] = useState('');
  const [how, setHow] = useState('');
  const [pain, setPain] = useState('');
  const [hrs, setHrs] = useState('');
  const [err, setErr] = useState('');
  const [opt, setOpt] = useState('');

  function handleSave() {
    if (!name.trim()) {
      alert('Please enter a workflow name');
      return;
    }
    onSave(cadenceKey, { name, who, systems, how, pain, hrs, err, opt });
    resetForm();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function resetForm() {
    setName('');
    setWho('');
    setSystems('');
    setHow('');
    setPain('');
    setHrs('');
    setErr('');
    setOpt('');
  }

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay${isOpen ? ' show' : ''}`}>
      <div className="modal">
        <h2>Add Custom Workflow</h2>
        <div className="form-row">
          <label>Workflow Name</label>
          <input type="text" placeholder="e.g. Cash Repatriation" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Who</label>
          <input type="text" placeholder="e.g. Treasurer, Tax" value={who} onChange={e => setWho(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Systems</label>
          <input type="text" placeholder="e.g. Excel, ERP, Bank portals" value={systems} onChange={e => setSystems(e.target.value)} />
        </div>
        <div className="form-row">
          <label>How It Works</label>
          <textarea placeholder="Describe the workflow steps…" value={how} onChange={e => setHow(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Pain Points</label>
          <textarea placeholder="What's painful about this workflow?" value={pain} onChange={e => setPain(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Hrs/Mo</label>
          <input type="text" placeholder="e.g. 5–10" value={hrs} onChange={e => setHrs(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Error Cost</label>
          <input type="text" placeholder="e.g. $100K–500K" value={err} onChange={e => setErr(e.target.value)} />
        </div>
        <div className="form-row">
          <label>$ Optimization</label>
          <input type="text" placeholder="e.g. $50K–200K/yr" value={opt} onChange={e => setOpt(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Add Workflow</button>
        </div>
      </div>
    </div>
  );
}
