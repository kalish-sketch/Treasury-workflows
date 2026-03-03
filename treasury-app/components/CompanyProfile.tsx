"use client";

import { CompanyProfile as ProfileType } from "@/data/types";
import TagInput from "./TagInput";

interface CompanyProfileProps {
  profile: ProfileType;
  onChange: (profile: ProfileType) => void;
}

const INDUSTRIES = [
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Consumer / Retail",
  "Energy",
  "Financial Services",
  "Real Estate",
  "Professional Services",
  "Transportation / Logistics",
  "Other",
];

const ERP_OPTIONS = [
  "SAP",
  "Oracle",
  "NetSuite",
  "Microsoft Dynamics",
  "Sage Intacct",
  "Workday",
  "QuickBooks",
  "Other",
];

export default function CompanyProfile({
  profile,
  onChange,
}: CompanyProfileProps) {
  const update = (field: keyof ProfileType, value: string | string[]) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div>
      <div className="note">
        Fill in your company details so we can calibrate the workflow metrics and
        agent recommendations to your specific environment.
      </div>
      <div className="profile-grid">
        <div className="profile-card">
          <h3>Company Details</h3>
          <div className="form-row">
            <label>Company Name</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className="form-row">
            <label>Annual Revenue</label>
            <input
              type="text"
              value={profile.revenue}
              onChange={(e) => update("revenue", e.target.value)}
              placeholder="$500M"
            />
          </div>
          <div className="form-row">
            <label>Industry</label>
            <select
              value={profile.industry}
              onChange={(e) => update("industry", e.target.value)}
            >
              <option value="">Select&hellip;</option>
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label># of Entities</label>
            <input
              type="number"
              value={profile.entities}
              onChange={(e) => update("entities", e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="form-row">
            <label># of Countries</label>
            <input
              type="number"
              value={profile.countries}
              onChange={(e) => update("countries", e.target.value)}
              placeholder="3"
            />
          </div>
          <div className="form-row">
            <label>Currencies Dealt In</label>
            <TagInput
              tags={profile.currencies}
              onChange={(tags) => update("currencies", tags)}
              placeholder="Type & press Enter (e.g. USD, EUR)"
            />
          </div>
          <div className="form-row">
            <label>Treasury Team Size</label>
            <input
              type="number"
              value={profile.teamSize}
              onChange={(e) => update("teamSize", e.target.value)}
              placeholder="3"
            />
          </div>
        </div>

        <div className="profile-card">
          <h3>Banking & Systems</h3>
          <div className="form-row">
            <label># of Bank Relationships</label>
            <input
              type="number"
              value={profile.numBanks}
              onChange={(e) => update("numBanks", e.target.value)}
              placeholder="6"
            />
          </div>
          <div className="form-row">
            <label>Bank Names</label>
            <TagInput
              tags={profile.banks}
              onChange={(tags) => update("banks", tags)}
              placeholder="Type & press Enter (e.g. JPM, BofA)"
            />
          </div>
          <div className="form-row">
            <label># of Bank Accounts</label>
            <input
              type="number"
              value={profile.numAccounts}
              onChange={(e) => update("numAccounts", e.target.value)}
              placeholder="15"
            />
          </div>
          <div className="form-row">
            <label>ERP System</label>
            <select
              value={profile.erp}
              onChange={(e) => update("erp", e.target.value)}
            >
              <option value="">Select&hellip;</option>
              {ERP_OPTIONS.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>TMS (if any)</label>
            <input
              type="text"
              value={profile.tms}
              onChange={(e) => update("tms", e.target.value)}
              placeholder="None"
            />
          </div>
          <div className="form-row">
            <label>Other Systems</label>
            <TagInput
              tags={profile.otherSystems}
              onChange={(tags) => update("otherSystems", tags)}
              placeholder="Type & press Enter (e.g. Bloomberg, Kyriba)"
            />
          </div>
          <div className="form-row">
            <label>Payment Volume / Mo</label>
            <input
              type="text"
              value={profile.paymentVolume}
              onChange={(e) => update("paymentVolume", e.target.value)}
              placeholder="$50M"
            />
          </div>
          <div className="form-row">
            <label>Credit Facilities</label>
            <input
              type="text"
              value={profile.facilities}
              onChange={(e) => update("facilities", e.target.value)}
              placeholder="$100M revolver"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
