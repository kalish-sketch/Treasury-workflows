'use client';

import { forwardRef, useImperativeHandle, useRef, useCallback, useState } from 'react';
import TagInput from './TagInput';
import { CompanyProfile as CompanyProfileType } from '@/types';

export interface CompanyProfileHandle {
  getProfile: () => CompanyProfileType;
}

const INDUSTRIES = [
  '', 'Manufacturing', 'Technology', 'Healthcare', 'Consumer / Retail',
  'Energy', 'Financial Services', 'Real Estate', 'Professional Services',
  'Transportation / Logistics', 'Other'
];

const ERPS = [
  '', 'SAP', 'Oracle', 'NetSuite', 'Microsoft Dynamics',
  'Sage Intacct', 'Workday', 'QuickBooks', 'Other'
];

const CompanyProfile = forwardRef<CompanyProfileHandle>(function CompanyProfile(_props, ref) {
  const companyRef = useRef<HTMLInputElement>(null);
  const revenueRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLSelectElement>(null);
  const entitiesRef = useRef<HTMLInputElement>(null);
  const countriesRef = useRef<HTMLInputElement>(null);
  const teamSizeRef = useRef<HTMLInputElement>(null);
  const numBanksRef = useRef<HTMLInputElement>(null);
  const numAccountsRef = useRef<HTMLInputElement>(null);
  const erpRef = useRef<HTMLSelectElement>(null);
  const tmsRef = useRef<HTMLInputElement>(null);
  const paymentVolRef = useRef<HTMLInputElement>(null);
  const facilitiesRef = useRef<HTMLInputElement>(null);

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [banks, setBanks] = useState<string[]>([]);
  const [otherSystems, setOtherSystems] = useState<string[]>([]);

  const getProfile = useCallback((): CompanyProfileType => ({
    company: companyRef.current?.value || '',
    revenue: revenueRef.current?.value || '',
    industry: industryRef.current?.value || '',
    entities: entitiesRef.current?.value || '',
    countries: countriesRef.current?.value || '',
    currencies,
    teamSize: teamSizeRef.current?.value || '',
    numBanks: numBanksRef.current?.value || '',
    banks,
    numAccounts: numAccountsRef.current?.value || '',
    erp: erpRef.current?.value || '',
    tms: tmsRef.current?.value || '',
    otherSystems,
    paymentVolume: paymentVolRef.current?.value || '',
    facilities: facilitiesRef.current?.value || '',
  }), [currencies, banks, otherSystems]);

  useImperativeHandle(ref, () => ({ getProfile }), [getProfile]);

  return (
    <div>
      <div className="note">
        Fill in your company details so we can calibrate the workflow metrics and agent recommendations to your specific environment.
      </div>
      <div className="profile-grid">
        <div className="profile-card">
          <h3>Company Details</h3>
          <div className="form-row">
            <label>Company Name</label>
            <input type="text" ref={companyRef} placeholder="Acme Corp" />
          </div>
          <div className="form-row">
            <label>Annual Revenue</label>
            <input type="text" ref={revenueRef} placeholder="$500M" />
          </div>
          <div className="form-row">
            <label>Industry</label>
            <select ref={industryRef}>
              {INDUSTRIES.map(i => (
                <option key={i} value={i}>{i || 'Select…'}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label># of Entities</label>
            <input type="number" ref={entitiesRef} placeholder="5" />
          </div>
          <div className="form-row">
            <label># of Countries</label>
            <input type="number" ref={countriesRef} placeholder="3" />
          </div>
          <div className="form-row">
            <label>Currencies Dealt In</label>
            <TagInput
              placeholder="Type & press Enter (e.g. USD, EUR)"
              tags={currencies}
              onTagsChange={setCurrencies}
            />
          </div>
          <div className="form-row">
            <label>Treasury Team Size</label>
            <input type="number" ref={teamSizeRef} placeholder="3" />
          </div>
        </div>

        <div className="profile-card">
          <h3>Banking & Systems</h3>
          <div className="form-row">
            <label># of Bank Relationships</label>
            <input type="number" ref={numBanksRef} placeholder="6" />
          </div>
          <div className="form-row">
            <label>Bank Names</label>
            <TagInput
              placeholder="Type & press Enter (e.g. JPM, BofA)"
              tags={banks}
              onTagsChange={setBanks}
            />
          </div>
          <div className="form-row">
            <label># of Bank Accounts</label>
            <input type="number" ref={numAccountsRef} placeholder="15" />
          </div>
          <div className="form-row">
            <label>ERP System</label>
            <select ref={erpRef}>
              {ERPS.map(e => (
                <option key={e} value={e}>{e || 'Select…'}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>TMS (if any)</label>
            <input type="text" ref={tmsRef} placeholder="None" />
          </div>
          <div className="form-row">
            <label>Other Systems</label>
            <TagInput
              placeholder="Type & press Enter (e.g. Bloomberg, Kyriba)"
              tags={otherSystems}
              onTagsChange={setOtherSystems}
            />
          </div>
          <div className="form-row">
            <label>Payment Volume / Mo</label>
            <input type="text" ref={paymentVolRef} placeholder="$50M" />
          </div>
          <div className="form-row">
            <label>Credit Facilities</label>
            <input type="text" ref={facilitiesRef} placeholder="$100M revolver" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default CompanyProfile;
