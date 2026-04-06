'use client';

import { forwardRef, useImperativeHandle, useRef, useCallback, useState } from 'react';
import TagInput from './TagInput';
import { CompanyProfile as CompanyProfileType } from '@/types';

export interface CompanyProfileHandle {
  getProfile: () => CompanyProfileType;
  setProfile: (p: CompanyProfileType) => void;
  validate: () => boolean;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!companyRef.current?.value?.trim()) newErrors.company = 'Required';
    if (!revenueRef.current?.value?.trim()) newErrors.revenue = 'Required';
    if (!industryRef.current?.value) newErrors.industry = 'Required';
    if (!entitiesRef.current?.value?.trim()) newErrors.entities = 'Required';
    if (!countriesRef.current?.value?.trim()) newErrors.countries = 'Required';
    if (currencies.length === 0) newErrors.currencies = 'Required';
    if (!teamSizeRef.current?.value?.trim()) newErrors.teamSize = 'Required';
    if (!numBanksRef.current?.value?.trim()) newErrors.numBanks = 'Required';
    if (banks.length === 0) newErrors.banks = 'Required';
    if (!numAccountsRef.current?.value?.trim()) newErrors.numAccounts = 'Required';
    if (!erpRef.current?.value) newErrors.erp = 'Required';
    if (!tmsRef.current?.value?.trim()) newErrors.tms = 'Required';
    if (!paymentVolRef.current?.value?.trim()) newErrors.paymentVolume = 'Required';
    if (!facilitiesRef.current?.value?.trim()) newErrors.facilities = 'Required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Focus the first errored field
      const firstKey = Object.keys(newErrors)[0];
      const refMap: Record<string, React.RefObject<HTMLInputElement | HTMLSelectElement | null>> = {
        company: companyRef, revenue: revenueRef, industry: industryRef,
        entities: entitiesRef, countries: countriesRef, teamSize: teamSizeRef,
        numBanks: numBanksRef, numAccounts: numAccountsRef, erp: erpRef,
        tms: tmsRef, paymentVolume: paymentVolRef, facilities: facilitiesRef,
      };
      refMap[firstKey]?.current?.focus();
      return false;
    }
    return true;
  }, [currencies, banks]);

  const setProfile = useCallback((p: CompanyProfileType) => {
    if (companyRef.current) companyRef.current.value = p.company || '';
    if (revenueRef.current) revenueRef.current.value = p.revenue || '';
    if (industryRef.current) industryRef.current.value = p.industry || '';
    if (entitiesRef.current) entitiesRef.current.value = p.entities || '';
    if (countriesRef.current) countriesRef.current.value = p.countries || '';
    if (teamSizeRef.current) teamSizeRef.current.value = p.teamSize || '';
    if (numBanksRef.current) numBanksRef.current.value = p.numBanks || '';
    if (numAccountsRef.current) numAccountsRef.current.value = p.numAccounts || '';
    if (erpRef.current) erpRef.current.value = p.erp || '';
    if (tmsRef.current) tmsRef.current.value = p.tms || '';
    if (paymentVolRef.current) paymentVolRef.current.value = p.paymentVolume || '';
    if (facilitiesRef.current) facilitiesRef.current.value = p.facilities || '';
    setCurrencies(p.currencies || []);
    setBanks(p.banks || []);
    setOtherSystems(p.otherSystems || []);
  }, []);

  useImperativeHandle(ref, () => ({ getProfile, setProfile, validate }), [getProfile, setProfile, validate]);

  const clearError = (key: string) => {
    if (errors[key]) setErrors(prev => { const { [key]: _, ...rest } = prev; return rest; });
  };

  const req = <span className="required">*</span>;

  return (
    <div>
      <div className="note">
        Fill in your company details so we can calibrate the workflow metrics and agent recommendations to your specific environment.
        All fields are required.
      </div>
      <div className="profile-grid">
        <div className="profile-card">
          <h3>Company Details</h3>
          <div className={`form-row${errors.company ? ' form-row-error' : ''}`}>
            <label>Company Name {req}</label>
            <input type="text" ref={companyRef} placeholder="Acme Corp" onChange={() => clearError('company')} />
            {errors.company && <span className="field-error">{errors.company}</span>}
          </div>
          <div className={`form-row${errors.revenue ? ' form-row-error' : ''}`}>
            <label>Annual Revenue {req}</label>
            <input type="text" ref={revenueRef} placeholder="$500M" onChange={() => clearError('revenue')} />
            {errors.revenue && <span className="field-error">{errors.revenue}</span>}
          </div>
          <div className={`form-row${errors.industry ? ' form-row-error' : ''}`}>
            <label>Industry {req}</label>
            <select ref={industryRef} onChange={() => clearError('industry')}>
              {INDUSTRIES.map(i => (
                <option key={i} value={i}>{i || 'Select…'}</option>
              ))}
            </select>
            {errors.industry && <span className="field-error">{errors.industry}</span>}
          </div>
          <div className={`form-row${errors.entities ? ' form-row-error' : ''}`}>
            <label># of Entities {req}</label>
            <input type="number" ref={entitiesRef} placeholder="5" onChange={() => clearError('entities')} />
            {errors.entities && <span className="field-error">{errors.entities}</span>}
          </div>
          <div className={`form-row${errors.countries ? ' form-row-error' : ''}`}>
            <label># of Countries {req}</label>
            <input type="number" ref={countriesRef} placeholder="3" onChange={() => clearError('countries')} />
            {errors.countries && <span className="field-error">{errors.countries}</span>}
          </div>
          <div className={`form-row${errors.currencies ? ' form-row-error' : ''}`}>
            <label>Currencies Dealt In {req}</label>
            <TagInput
              placeholder="Type & press Enter (e.g. USD, EUR)"
              tags={currencies}
              onTagsChange={(tags) => { setCurrencies(tags); if (tags.length > 0) clearError('currencies'); }}
            />
            {errors.currencies && <span className="field-error">{errors.currencies}</span>}
          </div>
          <div className={`form-row${errors.teamSize ? ' form-row-error' : ''}`}>
            <label>Treasury Team Size {req}</label>
            <input type="number" ref={teamSizeRef} placeholder="3" onChange={() => clearError('teamSize')} />
            {errors.teamSize && <span className="field-error">{errors.teamSize}</span>}
          </div>
        </div>

        <div className="profile-card">
          <h3>Banking & Systems</h3>
          <div className={`form-row${errors.numBanks ? ' form-row-error' : ''}`}>
            <label># of Bank Relationships {req}</label>
            <input type="number" ref={numBanksRef} placeholder="6" onChange={() => clearError('numBanks')} />
            {errors.numBanks && <span className="field-error">{errors.numBanks}</span>}
          </div>
          <div className={`form-row${errors.banks ? ' form-row-error' : ''}`}>
            <label>Bank Names {req}</label>
            <TagInput
              placeholder="Type & press Enter (e.g. JPM, BofA)"
              tags={banks}
              onTagsChange={(tags) => { setBanks(tags); if (tags.length > 0) clearError('banks'); }}
            />
            {errors.banks && <span className="field-error">{errors.banks}</span>}
          </div>
          <div className={`form-row${errors.numAccounts ? ' form-row-error' : ''}`}>
            <label># of Bank Accounts {req}</label>
            <input type="number" ref={numAccountsRef} placeholder="15" onChange={() => clearError('numAccounts')} />
            {errors.numAccounts && <span className="field-error">{errors.numAccounts}</span>}
          </div>
          <div className={`form-row${errors.erp ? ' form-row-error' : ''}`}>
            <label>ERP System {req}</label>
            <select ref={erpRef} onChange={() => clearError('erp')}>
              {ERPS.map(e => (
                <option key={e} value={e}>{e || 'Select…'}</option>
              ))}
            </select>
            {errors.erp && <span className="field-error">{errors.erp}</span>}
          </div>
          <div className={`form-row${errors.tms ? ' form-row-error' : ''}`}>
            <label>TMS (if any) {req}</label>
            <input type="text" ref={tmsRef} placeholder="None" onChange={() => clearError('tms')} />
            {errors.tms && <span className="field-error">{errors.tms}</span>}
          </div>
          <div className="form-row">
            <label>Other Systems</label>
            <TagInput
              placeholder="Type & press Enter (e.g. Bloomberg, Kyriba)"
              tags={otherSystems}
              onTagsChange={setOtherSystems}
            />
          </div>
          <div className={`form-row${errors.paymentVolume ? ' form-row-error' : ''}`}>
            <label>Payment Volume / Mo {req}</label>
            <input type="text" ref={paymentVolRef} placeholder="$50M" onChange={() => clearError('paymentVolume')} />
            {errors.paymentVolume && <span className="field-error">{errors.paymentVolume}</span>}
          </div>
          <div className={`form-row${errors.facilities ? ' form-row-error' : ''}`}>
            <label>Credit Facilities {req}</label>
            <input type="text" ref={facilitiesRef} placeholder="$100M revolver" onChange={() => clearError('facilities')} />
            {errors.facilities && <span className="field-error">{errors.facilities}</span>}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CompanyProfile;
