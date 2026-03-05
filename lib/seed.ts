/**
 * Seed script: loads workflow & agent data from static files into Neon.
 *
 * Usage:
 *   DATABASE_URL=... npx tsx lib/seed.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

// ── Static data (same as data/workflows.ts & data/agents.ts) ──

const CADENCES = [
  { key: 'daily', label: 'Daily', tagline: 'Every Morning by 9 AM', color: '#e74c3c', sortOrder: 0 },
  { key: 'weekly', label: 'Weekly', tagline: 'Usually Monday or Friday', color: '#e67e22', sortOrder: 1 },
  { key: 'monthly', label: 'Monthly', tagline: 'Month-End Close (Days 1–10 of Next Month)', color: '#3498db', sortOrder: 2 },
  { key: 'quarterly', label: 'Quarterly', tagline: 'Calendar Quarter-End + Board Cycle', color: '#8e44ad', sortOrder: 3 },
  { key: 'annual', label: 'Annual', tagline: 'Year-End & Strategic Planning', color: '#16a085', sortOrder: 4 },
];

interface RawSub { id: string; name: string; how: string; pain: string }
interface RawWorkflow {
  id: string; name: string; timeEst: string; who: string; systems: string;
  how: string; pain: string; hrs: string; err: string; opt: string;
  subs: RawSub[];
}

const WORKFLOWS: Record<string, RawWorkflow[]> = {
  daily: [
    { id:"d1", name:"Cash Position Report", timeEst:"~45–90 min/day",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span>',
      systems:'<span class="sys-tag">Bank portals (×5–10)</span> <span class="sys-tag">Excel</span> <span class="sys-tag">SWIFT / BAI files</span>',
      how:"Log into each bank portal separately. Download prior-day closing balances (BAI2/MT940 files). Copy into master Excel workbook with one tab per bank. Formulas roll up to consolidated position. Manually adjust for known items not yet reflected. Convert foreign balances at daily rates.",
      pain:"First hour of every day is data collection. Each bank has different portal, format, and posting time. Copy-paste errors are common. No intraday visibility.",
      hrs:"20–40", err:"$50K–100K/yr missed investment on idle cash", opt:"$100K–500K/yr from real-time sweep optimization",
      subs:[
        {id:"d1s1",name:"Bank Portal Login & Data Collection",how:"Log into 5–10 bank portals, download BAI2/MT940 files. Each has different login, MFA, file format.",pain:"10–15 min per bank × 5–10 banks = 50–150 min before analysis starts."},
        {id:"d1s2",name:"Multi-Currency Consolidation",how:"Convert foreign currency balances using daily FX rates from bank portals or manually sourced. Applied in Excel formulas.",pain:"Stale or wrong FX rates misstate the position. No automated rate feed."},
        {id:"d1s3",name:"In-Transit Item Adjustment",how:"Manually identify checks in transit, pending wires, ACH batches. Cross-reference against payment files. Adjust reported balances.",pain:"Relies on memory and email threads. Easily missed items = wrong available balance."},
        {id:"d1s4",name:"Exception / Anomaly Flagging",how:"Visually scan for unusual transactions. No rules engine — treasurer's experience is the only detection mechanism.",pain:"Fraud and errors caught by luck. A duplicate $500K payment can sit undetected for days."}
      ]},
    { id:"d2", name:"Short-Term Cash Forecast (1–5 day)", timeEst:"~30–60 min/day",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-ap">AP Team</span> <span class="who-tag who-ar">AR Team</span>',
      systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Email</span>',
      how:"Pull AP aging from ERP. Pull AR aging. Email AP and AR to confirm timing. Manually adjust Excel forecast. Layer in one-offs (tax, payroll, debt service).",
      pain:"Relies on other departments responding. AP/AR data in ERP is stale. Excel model breaks if someone changes a formula.",
      hrs:"15–25", err:"$200K–1M if position drives wrong borrowing decision", opt:"$50K–150K/yr from automated ERP integration",
      subs:[
        {id:"d2s1",name:"AP/AR Data Pull & Validation",how:"Export AP and AR aging from ERP. Cross-check against known payments.",pain:"ERP shows invoice due dates, not actual payment dates."},
        {id:"d2s2",name:"Departmental Confirmation (Email Chase)",how:"Email AP, AR teams to confirm timing. Wait for responses. Follow up if no reply by noon.",pain:"30–50% of forecast accuracy depends on people replying to emails."},
        {id:"d2s3",name:"One-Off / Non-Recurring Layering",how:"Manually add known events: quarterly tax, payroll, debt service, insurance premium. Maintained in a separate Excel tab.",pain:"Non-recurring items are the #1 source of forecast misses."}
      ]},
    { id:"d3", name:"Payment Approval & Release", timeEst:"~30–60 min/day",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-ap">AP Team</span>',
      systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Email</span>',
      how:"AP prepares payment batch. Sends notice to treasury. Treasurer reviews, approves in ERP. Logs into bank portal(s) and releases payments. For large payments, dual authorization.",
      pain:"Two-system approval: ERP + bank. No single view across banks. Dual auth means chasing a second signer. Fraud risk without anomaly detection.",
      hrs:"15–25", err:"$100K–5M fraud exposure without anomaly detection", opt:"$50K–200K/yr from payment timing optimization",
      subs:[
        {id:"d3s1",name:"Payment Batch Review & Validation",how:"Review each payment for correct vendor, amount tolerance, approval chain, duplicates. Check policy limits.",pain:"Manual review of 30–100+ payments/day. Duplicate detection is visual."},
        {id:"d3s2",name:"Dual Authorization & Release",how:"Email/call second signer (CFO). Wait for them to log into bank portal and co-approve.",pain:"Second signer availability delays payments by hours or days."},
        {id:"d3s3",name:"OFAC / Sanctions Screening",how:"For international payments: verify payee against OFAC SDN, EU sanctions lists.",pain:"A sanctions violation = $1M+ fines. Most mid-market companies rely solely on bank screening."}
      ]},
    { id:"d4", name:"Intercompany Funding", timeEst:"~20–40 min/day",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span>',
      how:"Identify cash-rich vs. cash-short entities. Initiate intercompany transfers via bank portals. Log in spreadsheet. Accounting reconciles at month-end.",
      pain:"Manual tracking of IC balances. Time zone issues. FX impact on IC transfers missed until month-end. No automated netting.",
      hrs:"10–20", err:"$50K–200K in FX losses from uncoordinated transfers", opt:"$100K–500K/yr from automated IC netting",
      subs:[]},
    { id:"d5", name:"FX Spot Trades", timeEst:"~15–30 min per trade",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-bank">Bank</span>',
      systems:'<span class="sys-tag">Email</span> <span class="sys-tag">Phone</span> <span class="sys-tag">Bank FX portal</span>',
      how:"Identify FX need. Email/call 1–3 banks for spot quotes. Wait, compare manually. Accept best rate. Confirm trade details. Log in Excel.",
      pain:"No price transparency. Email-based execution means no audit trail. Banks know you can't compare, so spreads are wide.",
      hrs:"5–15", err:"$50K–300K/yr in excess FX spread", opt:"$100K–500K/yr from multi-bank competitive bidding",
      subs:[
        {id:"d5s1",name:"Rate Comparison & Best Execution",how:"Manually compare quotes from 1–3 banks in email. Calculate effective spread vs. mid-market rate.",pain:"Without mid-market benchmark, you can't know if quote is competitive. Banks mark up 10–50 bps."},
        {id:"d5s2",name:"Trade Confirmation & Settlement",how:"Receive confirmation via email/fax. Match against trade log. Ensure SSIs are correct. Monitor T+2 settlement.",pain:"Failed settlements = cash not where needed + penalties. SSI errors common with manual processes."}
      ]},
    { id:"d6", name:"Liquidity & Investment Decisions", timeEst:"~15–20 min/day",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">MMF portal</span>',
      how:"Review consolidated position. If excess: move to MMF or short-term paper. If short: draw on revolver or delay payment. Decision based on experience + Excel.",
      pain:"Decision relies on accuracy of morning position. No scenario modeling. No automated sweep optimization.",
      hrs:"8–12", err:"$100K–500K/yr sub-optimal investment allocation", opt:"$200K–1M/yr from automated sweep & yield optimization",
      subs:[{id:"d6s1",name:"Sweep Account Optimization",how:"Review sweep arrangements. Determine if balances should go to MMF, overnight repo, or stay for ECR. Compare ECR vs. Fed Funds.",pain:"Most companies leave millions idle because sweep optimization is too manual."}]},
    { id:"d7", name:"Counterparty Risk Monitoring", timeEst:"~10–15 min/day",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Email alerts</span> <span class="sys-tag">News</span> <span class="sys-tag">Excel</span>',
      how:"Monitor bank counterparty creditworthiness — primarily reactive. Check CDS spreads or credit ratings if Bloomberg available. Track exposure concentration.",
      pain:"No automated alerts. Most learn about bank distress from news. FDIC only covers $250K. SVB collapse caught most mid-market off guard.",
      hrs:"3–5", err:"$5M–20M+ in uninsured deposits at risk", opt:"Risk mitigation — not direct $ savings",
      subs:[]},
    { id:"d8", name:"Cash Pooling / Sweep Structure", timeEst:"~10–15 min/day",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Excel</span>',
      how:"Monitor physical cash pool performance. Check for failed sweeps. Manage multi-currency considerations. Review target balances.",
      pain:"Sweep failures aren't flagged. Balances sit idle at subsidiaries. Cross-border pooling restrictions vary by country and are manually tracked.",
      hrs:"5–8", err:"$50K–200K/yr idle cash at subsidiaries", opt:"$100K–500K/yr from optimal pooling structure",
      subs:[]},
  ],
  weekly: [
    { id:"w1", name:"13-Week Rolling Cash Forecast", timeEst:"~2–4 hours/week",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-fpa">FP&A</span> <span class="who-tag who-ap">AP Team</span> <span class="who-tag who-ar">AR Team</span>',
      systems:'<span class="sys-tag">Excel (the 13-week model)</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Email</span>',
      how:"Roll the 13-week model forward. Pull actuals from ERP. Compare forecast vs. actual. Email AP/AR/FP&A for updated inputs. Manually update each line item. Send to CFO.",
      pain:"The single most painful artifact in treasury. Version control nonexistent. Formulas break silently. Hours chasing updates. CFO questions numbers with no audit trail.",
      hrs:"12–20", err:"$500K–5M covenant breach risk from inaccurate forecast", opt:"$80K–120K/yr from eliminating manual forecast labor",
      subs:[
        {id:"w1s1",name:"Variance Analysis (Forecast vs. Actual)",how:"Compare last week's forecast to actual. Decompose by category. Calculate % accuracy by line item. Identify persistent biases.",pain:"Version control nightmare. Variance explanations rely on memory. No systematic accuracy tracking."},
        {id:"w1s2",name:"Stress Testing",how:"Model downside scenarios: AR 20% late, largest customer delays 30 days, unplanned acquisition. Manually adjust cells to see covenant headroom impact.",pain:"Done rarely because it's manual. No saved scenarios. No Monte Carlo simulation."},
        {id:"w1s3",name:"What-If Scenario Modeling",how:"Evaluate timing decisions: delay capex, accelerate collections, draw on revolver. Each scenario = manual Excel manipulation.",pain:"Takes 30–60 min per scenario. CFO asks for 3–4 in a meeting — analyst scrambles to build them in real time."},
        {id:"w1s4",name:"Root Cause Analysis",how:"When forecast misses >10%: dig into why. Pull transaction data from ERP, match to forecast, interview teams.",pain:"Often takes 2–4 hours for a single variance. No structured framework. Findings rarely documented."},
        {id:"w1s5",name:"Sensitivity Analysis",how:"Determine which inputs drive biggest variance. Build tornado chart. Used to prioritize better forecasting.",pain:"Almost never done in practice because it requires rebuilding the model with variable inputs."},
        {id:"w1s6",name:"Confidence Scoring & Input Quality",how:"Rate reliability of each line item. Weight forecast by confidence for probability-adjusted outlook.",pain:"No formal methodology. 'Gut feel' is the confidence model. CFO can't distinguish high vs. low confidence items."},
        {id:"w1s7",name:"Input Collection & Email Chase",how:"Every Monday: email AP, AR, FP&A, HR/Payroll, Tax for inputs. Track responses. Follow up Tuesday noon.",pain:"30–40% of forecast effort. Some weeks 50% of inputs arrive late. Analyst becomes project manager."},
        {id:"w1s8",name:"Model Maintenance & Version Control",how:"Fix broken formulas. Update linked ranges. Archive versions. Manage 'DK_edits' vs. 'CFO_comments'. Rebuild every ~6 months.",pain:"Most critical AND most fragile tool. One wrong formula can misstate position by millions. No audit trail."}
      ]},
    { id:"w2", name:"FX Exposure Review", timeEst:"~1–2 hours/week",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Bloomberg (rare)</span>',
      how:"Pull AR/AP by currency. Layer in forecasted revenue/costs. Calculate net exposure per currency. Decide whether to hedge. Execute via bank. Track in Excel.",
      pain:"Exposure data scattered. Hedge decisions often reactive. No automated alerting. Hedge accounting requires tracking each instrument.",
      hrs:"6–10", err:"$500K per $10M unhedged exposure on 5% FX move", opt:"$100K–500K/yr from proactive hedging",
      subs:[
        {id:"w2s1",name:"Net Exposure Calculation",how:"Combine AR, AP, forecasted revenue/costs by currency, existing hedges. Net long/short by currency pair. Layered by time horizon.",pain:"Data from 4 sources, each with different update cycles."},
        {id:"w2s2",name:"Hedge Ratio & Instrument Decision",how:"Decide hedge %. Choose forward, option, or collar. Consider hedge accounting eligibility and CFO risk tolerance.",pain:"Decision tree is complex and rarely documented. Each instrument has different accounting implications."},
        {id:"w2s3",name:"Mark-to-Market & P&L Impact",how:"Weekly MTM of all active derivatives. Calculate unrealized P&L. Separate effective vs. ineffective portions.",pain:"Mid-market relies on bank-provided valuations (conflict of interest). No independent pricing."}
      ]},
    { id:"w3", name:"Liquidity & Credit Line Monitoring", timeEst:"~30–60 min/week",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Loan agreements (PDF)</span>',
      how:"Track available vs. drawn on each credit facility. Monitor maturities. Ensure headroom for coming weeks. Cross-check against covenants.",
      pain:"Facility details in PDF loan agreements. Available balances require logging into bank portals. No automated covenant monitoring.",
      hrs:"4–6", err:"$1M–50M+ if covenant breach triggers cross-default", opt:"$50K–200K/yr from optimized draw/repay timing",
      subs:[]},
    { id:"w4", name:"Bank Fee Analysis", timeEst:"~30 min/week (often skipped)",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span>',
      systems:'<span class="sys-tag">Bank analysis statements (AFP/BSB)</span> <span class="sys-tag">Excel</span>',
      how:"Download bank analysis statements. Compare charges to negotiated fee schedule. Flag anomalies.",
      pain:"Bank fee statements are deliberately complex (300+ service codes). Most companies overpay 20–30%.",
      hrs:"2–4", err:"$0 direct — massive opportunity cost", opt:"$100K+ per $100M payment volume in fee savings",
      subs:[
        {id:"w4s1",name:"Fee Schedule vs. Actual Comparison",how:"Map 300+ AFP service codes to contracted prices. Cross-reference actual charges. Identify overcharges.",pain:"Banks structure statements differently. Single wrong mapping = missed overcharge."},
        {id:"w4s2",name:"ECR vs. Fee-Based Analysis",how:"Compare fee-based pricing vs. compensating balances + ECR. Calculate break-even balance.",pain:"Many companies stuck in zero-rate era pricing, overpaying $50K–200K/yr."}
      ]},
    { id:"w5", name:"Payment Planning & Prioritization", timeEst:"~1 hour/week",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-ap">AP Team</span>',
      systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Email</span>',
      how:"Review upcoming AP for next 1–2 weeks. Prioritize based on discount capture, vendor criticality, and available cash.",
      pain:"No automated discount optimization. Payment timing is gut-feel + Excel.",
      hrs:"4–6", err:"$0 (vendor relationship risk)", opt:"$100K–300K/yr in captured early-pay discounts",
      subs:[{id:"w5s1",name:"Early-Pay Discount Optimization",how:"Identify invoices with 2/10 net 30 terms. Calculate annualized return. Compare to borrowing cost.",pain:"Discount terms buried in ERP. Companies capture <25% of available discounts."}]},
    { id:"w6", name:"Letter of Credit & Guarantee Tracking", timeEst:"~30–60 min/week",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">PDF contracts</span>',
      how:"Track outstanding LCs and bank guarantees. Monitor expirations. Coordinate renewals. Ensure capacity within facility sub-limits.",
      pain:"LCs tracked in spreadsheet with manual expiration monitoring. A missed renewal = supply chain disruption.",
      hrs:"3–5", err:"$100K–1M supply chain disruption from missed LC renewal", opt:"$20K–50K/yr in fee optimization",
      subs:[]},
  ],
  monthly: [
    { id:"m1", name:"Bank Reconciliation", timeEst:"~3–5 hours/month per bank",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
      systems:'<span class="sys-tag">Bank statements</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span>',
      how:"Download bank statements. Match each transaction to GL entries in ERP. Identify unmatched items. Investigate. Prepare reconciliation workpaper for controller sign-off.",
      pain:"For 10+ bank accounts, this is days of work. No automated matching. Same items reconmed every month because prior months are never truly clean.",
      hrs:"15–30", err:"$100K–500K in undetected errors or fraud", opt:"$50K–100K/yr from automated matching",
      subs:[
        {id:"m1s1",name:"Transaction Matching",how:"One-by-one matching of bank transactions to GL entries. Sort by amount, date, reference. Match exact hits first, then investigate remainder.",pain:"5–10% of transactions don't match cleanly. Each one requires investigation — timing difference, FX rounding, or real error."},
        {id:"m1s2",name:"Unmatched Item Investigation",how:"Research each unmatched item. Call AP/AR for context. Check if it was booked to the wrong account. Determine if it's a timing issue or real error.",pain:"Each item can take 15–60 min to research. The same items recur monthly if root cause isn't fixed."},
        {id:"m1s3",name:"Reconciliation Workpaper Preparation",how:"Format reconciliation into standard template. Show bank balance, book balance, reconciling items. Get controller signature. File for audit.",pain:"Format varies by auditor preference. Workpapers maintained in Word/Excel with manual cross-references."}
      ]},
    { id:"m2", name:"Cash Forecast Variance Analysis", timeEst:"~2–3 hours/month",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span>',
      how:"Compile weekly forecast errors into monthly view. Calculate systematic bias by category. Present to CFO with explanations and corrective actions.",
      pain:"Requires going back through 4–5 weekly forecasts and comparing to actuals. No automated tracking. Same biases persist for months because there's no feedback loop.",
      hrs:"4–6", err:"Ongoing forecast degradation if biases not corrected", opt:"$50K–100K/yr from improved forecast accuracy",
      subs:[]},
    { id:"m3", name:"Month-End Treasury Journal Entries", timeEst:"~3–6 hours/month",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
      systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span>',
      how:"Book accruals for interest, fees, unrealized FX gains/losses, derivative MTM. Calculate and post intercompany interest. Prepare supporting schedules.",
      pain:"Manual calculation of interest accruals. FX translation entries require multiple data sources. Intercompany interest rates must match transfer pricing policy.",
      hrs:"6–12", err:"$50K–200K in misstated financials", opt:"$30K–60K/yr from automated JE preparation",
      subs:[
        {id:"m3s1",name:"Interest & Fee Accruals",how:"Calculate accrued interest on all debt facilities. Calculate accrued bank fees. Apply day-count conventions. Post accruals to GL.",pain:"Day-count conventions vary by instrument. Wrong accrual = audit finding."},
        {id:"m3s2",name:"FX Revaluation & Translation",how:"Revalue foreign-denominated monetary assets/liabilities at month-end rates. Calculate unrealized gains/losses. Post to P&L or OCI depending on accounting designation.",pain:"Requires correct month-end rates for each currency pair. Accounting treatment differs by item type. Auditors scrutinize closely."}
      ]},
    { id:"m4", name:"Intercompany Netting & Settlement", timeEst:"~4–8 hours/month",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
      systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span>',
      how:"Collect IC invoices from all entities. Calculate net settlement amounts. Determine FX rates for cross-currency settlement. Initiate net payments. Post elimination entries.",
      pain:"IC reconciliation is perennial audit headache. Entities disagree on balances. FX timing differences create mismatches. No netting center = gross payments back and forth.",
      hrs:"8–15", err:"$100K–500K in IC balance differences at audit", opt:"$50K–200K/yr from reduced IC transfer costs",
      subs:[
        {id:"m4s1",name:"IC Invoice Reconciliation",how:"Each entity submits IC invoices. Central treasury compares matching pairs. Investigate discrepancies. Common issues: timing, FX rate differences, classification.",pain:"50% of IC invoices have discrepancies. Resolution requires coordination across entities/time zones."},
        {id:"m4s2",name:"Net Settlement Execution",how:"Calculate net position per entity pair. Convert to settlement currency. Execute transfers via banking portals. Multiple wires if different bank relationships.",pain:"Without a netting center, you might make 20 gross transfers instead of 5 net. Each wire costs $20–50."}
      ]},
    { id:"m5", name:"Debt & Investment Reporting", timeEst:"~2–4 hours/month",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank/custodian portals</span>',
      how:"Update debt schedule: draws, repayments, interest payments. Update investment portfolio: maturities, purchases, yields. Calculate weighted average cost of debt and investment returns.",
      pain:"Data scattered across multiple bank/custodian portals. Manual aggregation in Excel. No single view of total debt + investment portfolio.",
      hrs:"4–6", err:"$50K–100K from misstated debt balances", opt:"$50K–200K/yr from yield optimization",
      subs:[]},
    { id:"m6", name:"Management / CFO Reporting", timeEst:"~3–5 hours/month",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
      how:"Compile monthly treasury dashboard: cash position trend, forecast accuracy, FX exposure, debt/investment summary, bank fee analysis, covenant compliance status. Format in PowerPoint or PDF for CFO/Board.",
      pain:"Hours spent formatting, not analyzing. Same charts rebuilt monthly. No drill-down capability. Questions in meeting can't be answered in real-time.",
      hrs:"6–10", err:"Reputation/career risk from errors in CFO deck", opt:"$40K–80K/yr from automated dashboard generation",
      subs:[{id:"m6s1",name:"Dashboard Assembly & Chart Building",how:"Pull data from 5+ sources into PowerPoint. Build charts for cash trend, forecast accuracy, FX exposure, covenant headroom. Format to CFO preferences.",pain:"3–4 hours of formatting for 30 min of insights. CFO asks a question = 'I'll get back to you.'"}]},
    { id:"m7", name:"KYC/AML Documentation", timeEst:"~2–4 hours/month",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
      systems:'<span class="sys-tag">Email</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">PDF docs</span>',
      how:"Respond to bank KYC requests. Gather required documents (articles of incorporation, beneficial ownership, financial statements). Submit via email or bank portals. Track which banks need updates.",
      pain:"Each bank asks for different documents in different formats on different schedules. No central document repository. Requests often urgent with 30-day deadlines.",
      hrs:"4–8", err:"Account frozen if KYC not completed on time", opt:"$10K–30K/yr from centralized doc management",
      subs:[]},
    { id:"m8", name:"Payment Format & SWIFT Compliance", timeEst:"~1–3 hours/month",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-it">IT</span>',
      systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">SWIFT</span> <span class="sys-tag">Bank connectivity</span>',
      how:"Manage payment file formats (ISO 20022 migration, NACHA, SWIFT MT→MX). Test file submissions with banks. Troubleshoot rejected payments. Coordinate format changes with IT.",
      pain:"ISO 20022 migration is a multi-year effort. Each bank migrates on different timeline. Rejected payments disrupt cash management. IT prioritization battles.",
      hrs:"2–6", err:"$10K–50K from payment rejection/delay costs", opt:"Compliance — avoids future disruption",
      subs:[]},
  ],
  quarterly: [
    { id:"q1", name:"Covenant Compliance Testing", timeEst:"~4–8 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Loan agreements (PDF)</span>',
      how:"Calculate all financial covenants: leverage ratio, interest coverage, fixed charge coverage, minimum liquidity. Pull inputs from financial statements. Compare to thresholds in credit agreement. Prepare compliance certificate.",
      pain:"Covenant definitions in legal language (PDFs). Adjusted EBITDA calculation is complex and error-prone. A single miscalculation can trigger technical default. Often a last-minute scramble at quarter-end.",
      hrs:"5–8", err:"$1M–50M+ covenant breach = cross-default, acceleration, fee increases", opt:"$100K–500K/yr from proactive headroom management",
      subs:[
        {id:"q1s1",name:"Headroom Analysis & Early Warning",how:"Calculate how much each metric can deteriorate before breach. Model: 'What EBITDA decline triggers leverage breach?' Track trajectory vs. threshold.",pain:"Done in static Excel. No automated alerts as actuals approach limits. Surprises happen at quarter-end."},
        {id:"q1s2",name:"Sensitivity & Scenario Analysis",how:"Model impact of potential events: customer loss, FX move, M&A, restructuring charge. How does each affect covenant metrics?",pain:"Each scenario requires rebuilding the covenant model. Takes 1–2 hours per scenario. Rarely done proactively."},
        {id:"q1s3",name:"Compliance Certificate Preparation",how:"Draft compliance certificate per credit agreement format. Get CFO/Controller sign-off. Submit to agent bank within required deadline (usually 45–60 days).",pain:"Legal format is specific and varies by agreement. Deadline pressure is high. A late submission is itself a default event."}
      ]},
    { id:"q2", name:"Hedge Effectiveness Testing", timeEst:"~4–8 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bloomberg (if available)</span>',
      how:"For each designated hedge: perform retrospective effectiveness test (dollar-offset or regression). Document results per ASC 815/IFRS 9. If hedge fails effectiveness, de-designate and reclassify P&L impact.",
      pain:"Hedge accounting is the most complex area of treasury accounting. One error = restatement. Most mid-market companies avoid hedge accounting entirely because it's too hard, and eat the P&L volatility.",
      hrs:"4–8", err:"$200K–2M in P&L volatility from failed hedge accounting", opt:"$100K–500K/yr from properly structured hedge accounting",
      subs:[]},
    { id:"q3", name:"Board / Executive Treasury Report", timeEst:"~6–10 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
      how:"Prepare comprehensive quarterly report: liquidity summary, forecast outlook, FX exposure and hedging update, debt portfolio overview, investment returns, covenant compliance, risk assessment, bank relationship update.",
      pain:"Massive time investment for a 15-minute board agenda item. Different stakeholders want different views. No dynamic reporting — every question requires going back to Excel.",
      hrs:"6–10", err:"Reputation/career risk from errors visible to Board", opt:"$60K–100K/yr from automated board reporting",
      subs:[]},
    { id:"q4", name:"Banking Relationship Review", timeEst:"~2–4 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span>',
      how:"Review wallet allocation: is each bank getting revenue proportional to credit commitment? Track fee revenue, FX revenue, capital markets revenue per bank. Assess service quality and issue resolution.",
      pain:"No standard framework. Wallet data scattered across fee statements, FX logs, capital markets activity. Banks always claim they're undercompensated.",
      hrs:"3–5", err:"Bank relationship deterioration → worse terms at renewal", opt:"$50K–200K/yr from better wallet optimization",
      subs:[]},
    { id:"q5", name:"Investment Policy Compliance", timeEst:"~2–3 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Custodian reports</span>',
      how:"Review investment portfolio against policy limits: credit quality, concentration, duration, eligible instruments. Prepare compliance report for audit committee.",
      pain:"Policy limits in PDF, portfolio data from custodian portals. Manual comparison. Most companies check quarterly — a violation mid-quarter goes undetected.",
      hrs:"3–5", err:"$500K–5M credit loss from out-of-policy investments", opt:"$50K–200K/yr from optimized portfolio allocation",
      subs:[]},
    { id:"q6", name:"External Audit Support", timeEst:"~10–20 hours/quarter",
      who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Email</span>',
      how:"Respond to audit requests: bank confirmations, debt schedules, derivative valuations, investment portfolios, IC balance confirmations. Pull supporting documentation.",
      pain:"Auditors request volumes of data with tight deadlines. Documentation scattered across systems. Same questions every year but no standardized response package.",
      hrs:"10–20", err:"$100K–500K in audit fees from poor documentation", opt:"$30K–80K/yr in reduced audit time from better organization",
      subs:[]},
    { id:"q7", name:"Counterparty Risk Deep Review", timeEst:"~2–4 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Credit reports</span> <span class="sys-tag">Bloomberg</span>',
      how:"Full review of counterparty exposure: bank deposits, derivative MTM, investment holdings. Review credit ratings, CDS spreads, financial health. Update concentration limits. Report to risk committee.",
      pain:"Post-SVB, board/audit committee demands this quarterly. Data from multiple sources. No automated alerting between reviews.",
      hrs:"3–5", err:"$5M–50M+ in uninsured/concentrated exposure", opt:"Risk mitigation — protects downside",
      subs:[]},
    { id:"q8", name:"Bank Account Management", timeEst:"~2–4 hours/quarter",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Board resolutions</span>',
      how:"Review all bank accounts: which are active, dormant, needed? Open new accounts for new entities. Close dormant accounts. Update signatories. Maintain account register.",
      pain:"Account opening takes 4–6 weeks. Signer updates require board resolutions. Dormant accounts accumulate fees. No central account registry.",
      hrs:"3–5", err:"$20K–100K/yr in fees on unnecessary accounts", opt:"$20K–50K/yr from account rationalization",
      subs:[]},
  ],
  annual: [
    { id:"a1", name:"Capital Structure Planning", timeEst:"~20–40 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
      how:"Model optimal debt/equity mix. Analyze cost of capital scenarios. Evaluate refinancing options. Stress test capital structure against downside scenarios. Present recommendation to CFO/Board.",
      pain:"Complex modeling with many interdependencies. Sensitive to assumptions. Multiple stakeholders with different views. Often done once/year and becomes stale quickly.",
      hrs:"3–5", err:"$500K–5M/yr from sub-optimal capital structure", opt:"$200K–2M/yr from optimized cost of capital",
      subs:[
        {id:"a1s1",name:"Debt Maturity & Refinancing Analysis",how:"Map all debt maturities. Model refinancing scenarios: extend vs. repay vs. new issuance. Compare fixed vs. floating. Analyze rate lock opportunities.",pain:"Interest rate environment changes constantly. Analysis done annually but should be monitored continuously."},
        {id:"a1s2",name:"WACC & Cost of Capital Optimization",how:"Calculate WACC. Model impact of changing leverage. Compare to industry benchmarks. Evaluate ratings impact of different structures.",pain:"Requires market data and peer benchmarking that's hard to get for mid-market companies."}
      ]},
    { id:"a2", name:"Credit Facility Renewal / Amendment", timeEst:"~40–80 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Email</span> <span class="sys-tag">Legal docs</span>',
      how:"12–18 months before maturity: assess facility needs, prepare bank presentation, negotiate terms (pricing, covenants, structure), manage legal documentation, coordinate closing.",
      pain:"6+ month process. Legal fees $200K–500K. Banks use complexity as leverage. Covenant definitions are critical — one wrong word can cost millions.",
      hrs:"5–8", err:"$500K–2M in excess pricing from poor negotiation", opt:"$200K–1M/yr from competitive bank process",
      subs:[]},
    { id:"a3", name:"Annual Budget & Treasury Plan", timeEst:"~20–40 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
      how:"Build annual cash flow forecast from budget. Plan borrowing/investment strategy. Set FX hedging targets. Budget bank fees and interest expense. Define treasury KPIs for the year.",
      pain:"Dependent on FP&A budget cycle (always late). Cash flow forecast built from P&L forecast (indirect method — inaccurate). Takes weeks to build and is outdated by January.",
      hrs:"3–5", err:"$200K–1M from misaligned cash strategy", opt:"$100K–500K/yr from proactive annual planning",
      subs:[]},
    { id:"a4", name:"Credit Rating Management", timeEst:"~20–40 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Rating agency portals</span> <span class="sys-tag">PowerPoint</span>',
      how:"Prepare annual presentation for rating agency. Model credit metrics vs. rating thresholds. Anticipate rating agency questions. Manage ongoing information requests.",
      pain:"Rating agencies have their own adjusted metrics (different from bank covenants). A downgrade increases borrowing costs by 25–100 bps. High-stakes presentation with limited preparation time.",
      hrs:"2–4", err:"$500K–5M/yr from rating downgrade (higher borrowing costs)", opt:"$200K–1M/yr from maintaining optimal rating",
      subs:[]},
    { id:"a5", name:"Insurance & Surety Bond Management", timeEst:"~10–20 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Broker portals</span>',
      how:"Review insurance coverage: D&O, E&O, property, cyber, trade credit. Coordinate with broker on renewals. Manage surety bonds and bank guarantees that may overlap.",
      pain:"Coverage gaps not discovered until a claim. Premiums increasing significantly. Overlap between insurance and bank guarantees wastes money. Renewal process is reactive.",
      hrs:"1–2", err:"$1M+ from coverage gaps discovered at claim time", opt:"$50K–200K/yr from optimized coverage & elimination of overlaps",
      subs:[]},
    { id:"a6", name:"Treasury Policy Review & Update", timeEst:"~10–20 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
      systems:'<span class="sys-tag">Word/PDF</span>',
      how:"Review and update: investment policy, FX hedging policy, cash management policy, authorization matrix, bank account opening/closing procedures. Get board approval for material changes.",
      pain:"Policies are often outdated by 2–3 years. Written in legal language that operators don't follow. Board approval process is slow. Policies don't reflect current market conditions.",
      hrs:"1–2", err:"Audit finding for outdated policies; regulatory risk", opt:"Governance — reduces operational risk",
      subs:[]},
    { id:"a7", name:"Tax Planning & Cross-Border Compliance", timeEst:"~20–40 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-tax">Tax</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Tax software</span>',
      how:"Coordinate treasury activities with tax planning: transfer pricing on IC loans, withholding tax on cross-border payments, cash repatriation strategies, BEPS compliance. Treasury provides the execution; tax provides the strategy.",
      pain:"Tax and treasury often work in silos. IC lending rates must be at arm's length (transfer pricing). Withholding tax rules vary by country — incorrect withholding = penalties. Trapped cash in foreign entities is common.",
      hrs:"2–4", err:"$200K–2M in tax penalties from non-compliant IC arrangements", opt:"$100K–1M/yr from tax-efficient cash repatriation",
      subs:[]},
    { id:"a8", name:"Bank Relationship Strategy & RFP", timeEst:"~20–40 hours/year",
      who:'<span class="who-tag who-treasurer">Treasurer</span>',
      systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span> <span class="sys-tag">RFP templates</span>',
      how:"Set strategic bank panel. Conduct periodic RFPs for services. Evaluate bank proposals: pricing, technology, service, coverage. Award wallet based on credit participation and service quality.",
      pain:"RFP process is manual and time-consuming (3–6 months). No standardized comparison framework. Banks bundle pricing. Switching is painful (6–12 months to migrate).",
      hrs:"2–3", err:"$100K–500K/yr from sub-optimal bank panel", opt:"$200K–1M/yr from competitive bank sourcing",
      subs:[]},
  ],
};

const AGENTS = [
  { name:"Cash Visibility Agent", desc:"Real-time consolidated cash position across all banks, automatic BAI2/MT940 ingestion, multi-currency consolidation, anomaly detection.", workflows:["d1","d4","d6","d8"], impact:"Eliminate 2–3 hours/day of manual bank portal work" },
  { name:"Cash Forecasting Agent", desc:"AI-powered 13-week forecast with automated input collection, variance tracking, scenario modeling, stress testing, and confidence scoring.", workflows:["d2","w1","m2"], impact:"60–80% reduction in forecast preparation time; 30%+ improvement in accuracy" },
  { name:"Payment Operations Agent", desc:"Unified payment approval across all banks, automated anomaly detection, sanctions screening, dual-auth orchestration, payment timing optimization.", workflows:["d3","w5"], impact:"Reduce payment cycle time by 70%; prevent $100K+ in fraud/errors annually" },
  { name:"FX & Hedging Agent", desc:"Multi-bank FX execution with competitive bidding, net exposure calculation, hedge effectiveness tracking, automated MTM.", workflows:["d5","w2","q2"], impact:"Save 15–30 bps per FX trade; reduce hedge accounting effort by 80%" },
  { name:"Covenant & Compliance Agent", desc:"Real-time covenant monitoring with early warning alerts, automated compliance certificate generation, sensitivity modeling.", workflows:["q1","w3","q5"], impact:"Eliminate covenant surprise; reduce compliance effort by 60%" },
  { name:"Reporting & Analytics Agent", desc:"Automated treasury dashboard, board report generation, drill-down analytics, real-time KPIs.", workflows:["m6","q3","m5"], impact:"Reduce reporting time from days to minutes; enable real-time decision support" },
  { name:"Bank Fee Optimization Agent", desc:"Automated bank fee analysis, AFP service code mapping, ECR optimization, fee benchmarking.", workflows:["w4","q4"], impact:"Save $100K+ per $100M in payment volume" },
  { name:"Reconciliation Agent", desc:"Automated bank reconciliation with ML-powered transaction matching, exception routing, workpaper generation.", workflows:["m1","m3","m4"], impact:"Reduce reconciliation time by 80%; catch errors in real-time" },
  { name:"Risk & Counterparty Agent", desc:"Continuous counterparty monitoring, automated CDS/credit alerts, concentration tracking, deposit insurance optimization.", workflows:["d7","q7"], impact:"Real-time risk visibility; prevent concentrated exposure losses" },
  { name:"Document & Compliance Agent", desc:"Centralized KYC document management, automated SWIFT/ISO 20022 compliance, policy tracking.", workflows:["m7","m8","a6","q8"], impact:"Eliminate 80% of KYC document chase; ensure format compliance" },
  { name:"Strategic Planning Agent", desc:"Capital structure modeling, credit facility analysis, rating agency preparation, annual treasury planning.", workflows:["a1","a2","a3","a4","a5","a7","a8","q6"], impact:"Transform annual planning from weeks to days; enable continuous optimization" },
  { name:"Intercompany Agent", desc:"Automated IC netting, settlement optimization, transfer pricing compliance, cross-border payment orchestration.", workflows:["d4","m4","a7"], impact:"Reduce IC transfers by 70%; ensure transfer pricing compliance" },
];

// ── Main seed function ──

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is required. Set it as an environment variable.');
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log('Seeding database...');

  // 1. Insert cadences
  console.log('  → Inserting cadences...');
  const cadenceRows: Record<string, string> = {};
  for (const c of CADENCES) {
    const [row] = await db.insert(schema.cadences).values(c)
      .onConflictDoUpdate({ target: schema.cadences.key, set: { label: c.label, tagline: c.tagline, color: c.color, sortOrder: c.sortOrder } })
      .returning();
    cadenceRows[c.key] = row.id;
  }

  // 2. Insert workflows and sub-workflows
  console.log('  → Inserting workflows & sub-workflows...');
  const workflowIdMap: Record<string, string> = {}; // key -> uuid
  for (const [cadenceKey, wfList] of Object.entries(WORKFLOWS)) {
    const cadenceId = cadenceRows[cadenceKey];
    for (let i = 0; i < wfList.length; i++) {
      const wf = wfList[i];
      const [row] = await db.insert(schema.workflows).values({
        key: wf.id,
        cadenceId,
        name: wf.name,
        timeEst: wf.timeEst,
        who: wf.who,
        systems: wf.systems,
        how: wf.how,
        pain: wf.pain,
        hrs: wf.hrs,
        err: wf.err,
        opt: wf.opt,
        sortOrder: i,
      })
        .onConflictDoUpdate({
          target: schema.workflows.key,
          set: { name: wf.name, timeEst: wf.timeEst, who: wf.who, systems: wf.systems, how: wf.how, pain: wf.pain, hrs: wf.hrs, err: wf.err, opt: wf.opt, sortOrder: i, cadenceId },
        })
        .returning();
      workflowIdMap[wf.id] = row.id;

      // Sub-workflows
      for (let j = 0; j < wf.subs.length; j++) {
        const sub = wf.subs[j];
        await db.insert(schema.subWorkflows).values({
          key: sub.id,
          workflowId: row.id,
          name: sub.name,
          how: sub.how,
          pain: sub.pain,
          sortOrder: j,
        })
          .onConflictDoUpdate({
            target: schema.subWorkflows.key,
            set: { name: sub.name, how: sub.how, pain: sub.pain, sortOrder: j, workflowId: row.id },
          });
      }
    }
  }

  // 3. Insert agents and agent-workflow mappings
  console.log('  → Inserting agents...');
  for (let i = 0; i < AGENTS.length; i++) {
    const a = AGENTS[i];
    const [agentRow] = await db.insert(schema.agents).values({
      name: a.name,
      description: a.desc,
      impact: a.impact,
      sortOrder: i,
    }).returning();

    for (const wfKey of a.workflows) {
      const workflowId = workflowIdMap[wfKey];
      if (workflowId) {
        await db.insert(schema.agentWorkflows).values({
          agentId: agentRow.id,
          workflowId,
        });
      }
    }
  }

  console.log('Seed complete! Inserted:');
  console.log(`  ${CADENCES.length} cadences`);
  console.log(`  ${Object.values(WORKFLOWS).flat().length} workflows`);
  console.log(`  ${Object.values(WORKFLOWS).flat().reduce((sum, w) => sum + w.subs.length, 0)} sub-workflows`);
  console.log(`  ${AGENTS.length} agents`);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
