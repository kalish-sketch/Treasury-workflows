"use client";

import { useState } from "react";
import { CadenceKey } from "@/data/types";

interface AddWorkflowModalProps {
  isOpen: boolean;
  cadence: CadenceKey | null;
  onClose: () => void;
  onSave: (
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
  ) => void;
}

export default function AddWorkflowModal({
  isOpen,
  cadence,
  onClose,
  onSave,
}: AddWorkflowModalProps) {
  const [name, setName] = useState("");
  const [who, setWho] = useState("");
  const [systems, setSystems] = useState("");
  const [how, setHow] = useState("");
  const [pain, setPain] = useState("");
  const [hrs, setHrs] = useState("");
  const [err, setErr] = useState("");
  const [opt, setOpt] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a workflow name");
      return;
    }
    if (!cadence) return;
    onSave(cadence, {
      name: name.trim(),
      who,
      systems,
      how,
      pain,
      hrs,
      err,
      opt,
    });
    setName("");
    setWho("");
    setSystems("");
    setHow("");
    setPain("");
    setHrs("");
    setErr("");
    setOpt("");
  };

  const handleClose = () => {
    setName("");
    setWho("");
    setSystems("");
    setHow("");
    setPain("");
    setHrs("");
    setErr("");
    setOpt("");
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? "show" : ""}`}>
      <div className="modal">
        <h2>Add Custom Workflow</h2>
        <div className="form-row">
          <label>Workflow Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cash Repatriation"
          />
        </div>
        <div className="form-row">
          <label>Who</label>
          <input
            type="text"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            placeholder="e.g. Treasurer, Tax"
          />
        </div>
        <div className="form-row">
          <label>Systems</label>
          <input
            type="text"
            value={systems}
            onChange={(e) => setSystems(e.target.value)}
            placeholder="e.g. Excel, ERP, Bank portals"
          />
        </div>
        <div className="form-row">
          <label>How It Works</label>
          <textarea
            value={how}
            onChange={(e) => setHow(e.target.value)}
            placeholder="Describe the workflow steps..."
          />
        </div>
        <div className="form-row">
          <label>Pain Points</label>
          <textarea
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            placeholder="What's painful about this workflow?"
          />
        </div>
        <div className="form-row">
          <label>Hrs/Mo</label>
          <input
            type="text"
            value={hrs}
            onChange={(e) => setHrs(e.target.value)}
            placeholder="e.g. 5–10"
          />
        </div>
        <div className="form-row">
          <label>Error Cost</label>
          <input
            type="text"
            value={err}
            onChange={(e) => setErr(e.target.value)}
            placeholder="e.g. $100K–500K"
          />
        </div>
        <div className="form-row">
          <label>$ Optimization</label>
          <input
            type="text"
            value={opt}
            onChange={(e) => setOpt(e.target.value)}
            placeholder="e.g. $50K–200K/yr"
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" style={{ color: "#1a1a2e" }} onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Add Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
