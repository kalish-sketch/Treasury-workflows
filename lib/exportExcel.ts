// Excel export utility — generates multi-sheet .xlsx files mirroring the app's tab structure

export const CADENCE_ORDER = ['daily', 'weekly', 'monthly', 'quarterly', 'annual'];
export const CADENCE_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
  quarterly: 'Quarterly', annual: 'Annual',
};
export const CADENCE_COLORS: Record<string, string> = {
  daily: '#e74c3c', weekly: '#e67e22', monthly: '#3498db', quarterly: '#8e44ad', annual: '#16a085',
};

export interface AssessmentFull {
  id: string;
  companyName: string;
  profile: Record<string, any>;
  workflowSelections: Record<string, any[]>;
  customWorkflows: Record<string, any[]>;
  createdAt: string;
  updatedAt: string;
}

export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export function parseNumeric(val: string): number {
  if (!val || val === '\u2014' || val === '-') return 0;
  const cleaned = val.replace(/[,$\/yr\/mo\s]/g, '');
  const parts = cleaned.match(/[\d.]+[KkMm]?/g);
  if (!parts || parts.length === 0) return 0;
  const toNum = (s: string): number => {
    const upper = s.toUpperCase();
    if (upper.endsWith('M')) return parseFloat(s) * 1_000_000;
    if (upper.endsWith('K')) return parseFloat(s) * 1_000;
    return parseFloat(s) || 0;
  };
  const nums = parts.map(toNum);
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function formatCompact(val: number): string {
  if (val === 0) return '\u2014';
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return val.toFixed(0);
}

export interface WorkflowEntry {
  name: string;
  doToday: boolean;
  wishToDo: boolean;
  hrs: string;
  errCost: string;
  optimization: string;
  who: string;
  systems: string;
  how: string;
  pain: string;
  cadences: string[];
  custom: boolean;
  subs: { id: string; name: string; how?: string; pain?: string; doToday?: boolean; wishToDo?: boolean }[];
}

export function collectAllWorkflows(a: AssessmentFull) {
  const all: { cadence: string; w: WorkflowEntry }[] = [];
  let doCount = 0, wishCount = 0, notSelectedCount = 0;
  let doHrs = 0, wishHrs = 0, doErr = 0, doOpt = 0;
  const doNames: string[] = [];
  const wishNames: string[] = [];
  const notSelectedNames: string[] = [];

  for (const cadence of CADENCE_ORDER) {
    const wfs = (a.workflowSelections || {})[cadence] || [];
    const customs = (a.customWorkflows || {})[cadence] || [];
    for (const w of [...(wfs as any[]), ...(customs as any[])]) {
      const entry: WorkflowEntry = {
        name: w.name,
        doToday: !!w.doToday,
        wishToDo: !!w.wishToDo,
        hrs: w.hrs || '',
        errCost: w.errCost || w.err || '',
        optimization: w.optimization || w.opt || '',
        who: stripHtmlTags(w.who || ''),
        systems: stripHtmlTags(w.systems || ''),
        how: w.how || '',
        pain: w.pain || '',
        cadences: w.cadences || [cadence],
        custom: !!w.custom,
        subs: w.subs || [],
      };
      all.push({ cadence, w: entry });

      if (entry.doToday) {
        doCount++; doNames.push(entry.name);
        doHrs += parseNumeric(entry.hrs);
        doErr += parseNumeric(entry.errCost);
        doOpt += parseNumeric(entry.optimization);
      }
      if (entry.wishToDo) {
        wishCount++; wishNames.push(entry.name);
        wishHrs += parseNumeric(entry.hrs);
      }
      if (!entry.doToday && !entry.wishToDo) {
        notSelectedCount++; notSelectedNames.push(entry.name);
      }
    }
  }

  return {
    all, doCount, wishCount, notSelectedCount,
    doHrs, wishHrs, doErr, doOpt,
    doNames, wishNames, notSelectedNames,
    totalCount: all.length,
  };
}

// ── Excel workbook generation ──

const HEADER_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF1e293b' } };
const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
const SECTION_FONT = { bold: true, size: 12 };

function applyHeaderRow(ws: any, rowNum: number) {
  const row = ws.getRow(rowNum);
  row.eachCell((cell: any) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: 'middle', wrapText: true };
  });
  row.height = 24;
}

function buildCompanyProfileSheet(ws: any, profile: Record<string, any>, companyName: string) {
  ws.columns = [
    { header: 'Field', key: 'field', width: 25 },
    { header: 'Value', key: 'value', width: 45 },
  ];
  applyHeaderRow(ws, 1);

  const fields: [string, string][] = [
    ['Company', profile.company || companyName || ''],
    ['Industry', profile.industry || ''],
    ['Revenue', profile.revenue || ''],
    ['Entities', profile.entities || ''],
    ['Countries', profile.countries || ''],
    ['Currencies', Array.isArray(profile.currencies) ? profile.currencies.join(', ') : ''],
    ['Team Size', profile.teamSize || ''],
    ['Banks', Array.isArray(profile.banks) ? profile.banks.join(', ') : ''],
    ['Num Banks', profile.numBanks || ''],
    ['Num Accounts', profile.numAccounts || ''],
    ['ERP', profile.erp || ''],
    ['TMS', profile.tms || ''],
    ['Other Systems', Array.isArray(profile.otherSystems) ? profile.otherSystems.join(', ') : ''],
    ['Payment Volume', profile.paymentVolume || ''],
    ['Credit Facilities', profile.facilities || ''],
  ];

  for (const [field, value] of fields) {
    const row = ws.addRow({ field, value });
    row.getCell(1).font = { bold: true };
  }

  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

function buildCadenceSheet(ws: any, cadence: string, assessment: AssessmentFull) {
  const columns = [
    { header: 'Do Today', key: 'doToday', width: 10 },
    { header: 'Wish To Do', key: 'wishToDo', width: 11 },
    { header: 'Workflow', key: 'workflow', width: 35 },
    { header: 'Who', key: 'who', width: 20 },
    { header: 'Systems', key: 'systems', width: 20 },
    { header: 'How It Actually Works', key: 'how', width: 35 },
    { header: 'Pain Points', key: 'pain', width: 30 },
    { header: 'Hrs/Mo', key: 'hrs', width: 12 },
    { header: 'Error Cost', key: 'errCost', width: 14 },
    { header: '$ Optimization', key: 'opt', width: 14 },
    { header: 'Frequency', key: 'freq', width: 22 },
  ];
  ws.columns = columns;
  applyHeaderRow(ws, 1);

  const wfs = (assessment.workflowSelections || {})[cadence] || [];
  const customs = (assessment.customWorkflows || {})[cadence] || [];

  for (const w of [...(wfs as any[]), ...(customs as any[])]) {
    const freqLabel = (w.cadences || [cadence])
      .map((c: string) => CADENCE_LABELS[c] || c).join(', ');

    ws.addRow({
      doToday: w.doToday ? '\u2713' : '',
      wishToDo: w.wishToDo ? '\u2605' : '',
      workflow: w.name || '',
      who: stripHtmlTags(w.who || ''),
      systems: stripHtmlTags(w.systems || ''),
      how: stripHtmlTags(w.how || ''),
      pain: stripHtmlTags(w.pain || ''),
      hrs: w.hrs || '',
      errCost: w.errCost || w.err || '',
      opt: w.optimization || w.opt || '',
      freq: freqLabel,
    });

    // Sub-workflows
    const subs = w.subs || [];
    for (const s of subs) {
      const subRow = ws.addRow({
        doToday: s.doToday ? '\u2713' : '',
        wishToDo: s.wishToDo ? '\u2605' : '',
        workflow: `  \u21B3 ${s.name || ''}`,
        who: '',
        systems: '',
        how: stripHtmlTags(s.how || ''),
        pain: stripHtmlTags(s.pain || ''),
        hrs: '',
        errCost: '',
        opt: '',
        freq: '',
      });
      subRow.eachCell((cell: any) => {
        cell.font = { color: { argb: 'FF94a3b8' }, size: 10 };
      });
    }
  }

  // Set tab color
  ws.properties.tabColor = { argb: 'FF' + (CADENCE_COLORS[cadence] || '666666').replace('#', '') };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

function buildSummarySheet(ws: any, assessment: AssessmentFull) {
  ws.columns = [
    { header: '', key: 'label', width: 30 },
    { header: '', key: 'value', width: 20 },
    { header: '', key: 'extra', width: 40 },
  ];

  const stats = collectAllWorkflows(assessment);
  let rowNum = 1;

  // ── Workflows Done Today ──
  const doHeader = ws.addRow({ label: '\u2713 Workflows Done Today', value: '', extra: '' });
  doHeader.getCell(1).font = { ...SECTION_FONT, color: { argb: 'FF22c55e' } };
  doHeader.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0f172a' } };
  rowNum++;

  const doMetrics: [string, string][] = [
    ['Workflows', String(stats.doCount)],
    ['Total Hrs/Mo', stats.doHrs > 0 ? String(Math.round(stats.doHrs)) : '\u2014'],
    ['Error Cost Exposure', stats.doErr > 0 ? formatCompact(stats.doErr) : '\u2014'],
    ['$ Optimization Potential', stats.doOpt > 0 ? formatCompact(stats.doOpt) : '\u2014'],
  ];
  for (const [label, value] of doMetrics) {
    const r = ws.addRow({ label: `  ${label}`, value, extra: '' });
    r.getCell(1).font = { bold: true };
    rowNum++;
  }

  // Workflow names
  if (stats.doNames.length > 0) {
    ws.addRow({ label: '  Workflow names', value: '', extra: stats.doNames.join(', ') });
    rowNum++;
  }

  ws.addRow({ label: '', value: '', extra: '' }); rowNum++; // spacer

  // ── Workflows Wished For ──
  const wishHeader = ws.addRow({ label: '\u2605 Workflows Wished For', value: '', extra: '' });
  wishHeader.getCell(1).font = { ...SECTION_FONT, color: { argb: 'FFf59e0b' } };
  wishHeader.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0f172a' } };
  rowNum++;

  const wishMetrics: [string, string][] = [
    ['Workflows', String(stats.wishCount)],
    ['Total Hrs/Mo', stats.wishHrs > 0 ? String(Math.round(stats.wishHrs)) : '\u2014'],
  ];
  for (const [label, value] of wishMetrics) {
    const r = ws.addRow({ label: `  ${label}`, value, extra: '' });
    r.getCell(1).font = { bold: true };
    rowNum++;
  }

  if (stats.wishNames.length > 0) {
    ws.addRow({ label: '  Workflow names', value: '', extra: stats.wishNames.join(', ') });
    rowNum++;
  }

  ws.addRow({ label: '', value: '', extra: '' }); rowNum++; // spacer

  // ── Not Selected ──
  const nsHeader = ws.addRow({ label: 'Not Selected', value: '', extra: '' });
  nsHeader.getCell(1).font = { ...SECTION_FONT, color: { argb: 'FF94a3b8' } };
  nsHeader.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0f172a' } };
  rowNum++;

  const nsMetrics: [string, string][] = [
    ['Workflows Not Selected', String(stats.notSelectedCount)],
    ['Total Workflows Available', String(stats.totalCount)],
    ['Total Selected', String(stats.doCount + stats.wishCount)],
  ];
  for (const [label, value] of nsMetrics) {
    const r = ws.addRow({ label: `  ${label}`, value, extra: '' });
    r.getCell(1).font = { bold: true };
    rowNum++;
  }

  // Not-selected by cadence
  if (stats.notSelectedNames.length > 0) {
    ws.addRow({ label: '', value: '', extra: '' }); rowNum++;
    const detailHeader = ws.addRow({ label: '  Not-selected workflows by cadence', value: '', extra: '' });
    detailHeader.getCell(1).font = { bold: true, italic: true };
    rowNum++;

    for (const cadence of CADENCE_ORDER) {
      const cadenceWfs = stats.all
        .filter(e => e.cadence === cadence && !e.w.doToday && !e.w.wishToDo)
        .map(e => e.w.name);
      if (cadenceWfs.length > 0) {
        ws.addRow({ label: `    ${CADENCE_LABELS[cadence]}`, value: '', extra: cadenceWfs.join(', ') });
        rowNum++;
      }
    }
  }

  ws.addRow({ label: '', value: '', extra: '' }); rowNum++; // spacer

  // ── Submitted ──
  ws.addRow({ label: 'Submitted', value: new Date(assessment.createdAt).toLocaleDateString(), extra: '' });

  ws.properties.tabColor = { argb: 'FF1e293b' };
}

function truncateSheetName(company: string, suffix: string): string {
  const maxLen = 31;
  const sep = ' - ';
  const available = maxLen - sep.length - suffix.length;
  const truncated = company.length > available ? company.slice(0, available) : company;
  return `${truncated}${sep}${suffix}`;
}

async function generateWorkbook(assessment: AssessmentFull) {
  const ExcelJS = await import('exceljs');
  const wb = new ExcelJS.Workbook();

  // Sheet 1: Company Profile
  const profileWs = wb.addWorksheet('Company Profile', {
    properties: { tabColor: { argb: 'FF334155' } },
  });
  buildCompanyProfileSheet(profileWs, assessment.profile || {}, assessment.companyName);

  // Sheets 2-6: Cadence tabs
  for (const cadence of CADENCE_ORDER) {
    const ws = wb.addWorksheet(CADENCE_LABELS[cadence]);
    buildCadenceSheet(ws, cadence, assessment);
  }

  // Sheet 7: Summary
  const summaryWs = wb.addWorksheet('Summary');
  buildSummarySheet(summaryWs, assessment);

  return wb;
}

async function downloadExcel(wb: any, filename: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportSingleAssessment(assessment: AssessmentFull) {
  const wb = await generateWorkbook(assessment);
  const name = (assessment.companyName || 'assessment').replace(/\s+/g, '-').toLowerCase();
  await downloadExcel(wb, `${name}.xlsx`);
}

export async function exportAllAssessments(assessments: AssessmentFull[]) {
  const ExcelJS = await import('exceljs');
  const wb = new ExcelJS.Workbook();

  for (const assessment of assessments) {
    const company = (assessment.companyName || 'Unknown').replace(/[\\/*?[\]:]/g, '');

    // Company Profile sheet
    const profileWs = wb.addWorksheet(truncateSheetName(company, 'Profile'), {
      properties: { tabColor: { argb: 'FF334155' } },
    });
    buildCompanyProfileSheet(profileWs, assessment.profile || {}, assessment.companyName);

    // Cadence sheets
    for (const cadence of CADENCE_ORDER) {
      const ws = wb.addWorksheet(truncateSheetName(company, CADENCE_LABELS[cadence]));
      buildCadenceSheet(ws, cadence, assessment);
    }

    // Summary sheet
    const summaryWs = wb.addWorksheet(truncateSheetName(company, 'Summary'));
    buildSummarySheet(summaryWs, assessment);
  }

  const date = new Date().toISOString().slice(0, 10);
  await downloadExcel(wb, `all-assessments-${date}.xlsx`);
}
