export interface SubWorkflow {
  id: string;
  name: string;
  how: string;
  pain: string;
}

export interface WhoTag {
  label: string;
  className: string;
}

export interface SysTag {
  label: string;
}

export interface Workflow {
  id: string;
  name: string;
  timeEst: string;
  who: WhoTag[];
  systems: SysTag[];
  how: string;
  pain: string;
  hrs: string;
  err: string;
  opt: string;
  doToday: boolean;
  wishToDo: boolean;
  subs: SubWorkflow[];
  custom?: boolean;
}

export interface CadenceData {
  label: string;
  tagline: string;
  color: string;
  workflows: Workflow[];
}

export type CadenceKey = "daily" | "weekly" | "monthly" | "quarterly" | "annual";

export type WorkflowDataMap = Record<CadenceKey, CadenceData>;

export interface AgentRec {
  name: string;
  desc: string;
  workflows: string[];
  impact: string;
}

export interface CompanyProfile {
  company: string;
  revenue: string;
  industry: string;
  entities: string;
  countries: string;
  currencies: string[];
  teamSize: string;
  numBanks: string;
  banks: string[];
  numAccounts: string;
  erp: string;
  tms: string;
  otherSystems: string[];
  paymentVolume: string;
  facilities: string;
}
