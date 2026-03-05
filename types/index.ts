export interface SubWorkflow {
  id: string;
  name: string;
  how: string;
  pain: string;
  doToday?: boolean;
  wishToDo?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  timeEst: string;
  who: string;
  systems: string;
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

export type WorkflowDataMap = Record<string, CadenceData>;

export interface Agent {
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
