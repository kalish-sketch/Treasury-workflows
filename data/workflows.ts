import { WorkflowDataMap } from '@/types';

export const WORKFLOW_DATA: WorkflowDataMap = {
  daily: {
    label: "Daily", tagline: "Every Morning by 9 AM", color: "#e74c3c",
    workflows: [
      { id:"d1", name:"Cash Position Report", category:"Cash Management", visible:true, timeEst:"~45–90 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span>',
        systems:'<span class="sys-tag">Bank portals (×5–10)</span> <span class="sys-tag">Excel</span> <span class="sys-tag">SWIFT / BAI files</span>',
        how:"Log into each bank portal separately. Download prior-day closing balances (BAI2/MT940 files). Copy into master Excel workbook with one tab per bank. Formulas roll up to consolidated position. Manually adjust for known items not yet reflected. Convert foreign balances at daily rates.",
        pain:"First hour of every day is data collection. Each bank has different portal, format, and posting time. Copy-paste errors are common. No intraday visibility.",
        hrs:"20–40", err:"$50K–100K/yr missed investment on idle cash", opt:"$100K–500K/yr from real-time sweep optimization",
        doToday:false, wishToDo:false,
        subs:[
          {id:"d1s1",name:"Bank Portal Login & Data Collection",how:"Log into 5–10 bank portals, download BAI2/MT940 files. Each has different login, MFA, file format.",pain:"10–15 min per bank × 5–10 banks = 50–150 min before analysis starts."},
          {id:"d1s2",name:"Multi-Currency Consolidation",how:"Convert foreign currency balances using daily FX rates from bank portals or manually sourced. Applied in Excel formulas.",pain:"Stale or wrong FX rates misstate the position. No automated rate feed."},
          {id:"d1s3",name:"In-Transit Item Adjustment",how:"Manually identify checks in transit, pending wires, ACH batches. Cross-reference against payment files. Adjust reported balances.",pain:"Relies on memory and email threads. Easily missed items = wrong available balance."},
          {id:"d1s4",name:"Exception / Anomaly Flagging",how:"Visually scan for unusual transactions. No rules engine — treasurer's experience is the only detection mechanism.",pain:"Fraud and errors caught by luck. A duplicate $500K payment can sit undetected for days."}
        ]
      },
      { id:"d2", name:"Short-Term Cash Forecast (1–5 day)", category:"Cash Management", visible:true, timeEst:"~30–60 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-ap">AP Team</span> <span class="who-tag who-ar">AR Team</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Email</span>',
        how:"Pull AP aging from ERP. Pull AR aging. Email AP and AR to confirm timing. Manually adjust Excel forecast. Layer in one-offs (tax, payroll, debt service).",
        pain:"Relies on other departments responding. AP/AR data in ERP is stale. Excel model breaks if someone changes a formula.",
        hrs:"15–25", err:"$200K–1M if position drives wrong borrowing decision", opt:"$50K–150K/yr from automated ERP integration",
        doToday:false, wishToDo:false,
        subs:[
          {id:"d2s1",name:"AP/AR Data Pull & Validation",how:"Export AP and AR aging from ERP. Cross-check against known payments.",pain:"ERP shows invoice due dates, not actual payment dates."},
          {id:"d2s2",name:"Departmental Confirmation (Email Chase)",how:"Email AP, AR teams to confirm timing. Wait for responses. Follow up if no reply by noon.",pain:"30–50% of forecast accuracy depends on people replying to emails."},
          {id:"d2s3",name:"One-Off / Non-Recurring Layering",how:"Manually add known events: quarterly tax, payroll, debt service, insurance premium. Maintained in a separate Excel tab.",pain:"Non-recurring items are the #1 source of forecast misses."}
        ]
      },
      { id:"d3", name:"Payment Approval & Release", category:"Payment Operations", visible:true, timeEst:"~30–60 min/day",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-ap">AP Team</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Email</span>',
        how:"AP prepares payment batch. Sends notice to treasury. Treasurer reviews, approves in ERP. Logs into bank portal(s) and releases payments. For large payments, dual authorization.",
        pain:"Two-system approval: ERP + bank. No single view across banks. Dual auth means chasing a second signer. Fraud risk without anomaly detection.",
        hrs:"15–25", err:"$100K–5M fraud exposure without anomaly detection", opt:"$50K–200K/yr from payment timing optimization",
        doToday:false, wishToDo:false,
        subs:[
          {id:"d3s1",name:"Payment Batch Review & Validation",how:"Review each payment for correct vendor, amount tolerance, approval chain, duplicates. Check policy limits.",pain:"Manual review of 30–100+ payments/day. Duplicate detection is visual."},
          {id:"d3s2",name:"Dual Authorization & Release",how:"Email/call second signer (CFO). Wait for them to log into bank portal and co-approve.",pain:"Second signer availability delays payments by hours or days."},
          {id:"d3s3",name:"OFAC / Sanctions Screening",how:"For international payments: verify payee against OFAC SDN, EU sanctions lists.",pain:"A sanctions violation = $1M+ fines. Most mid-market companies rely solely on bank screening."}
        ]
      },
      { id:"d4", name:"Intercompany Funding", category:"Cash Management", visible:true, timeEst:"~20–40 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span>',
        how:"Identify cash-rich vs. cash-short entities. Initiate intercompany transfers via bank portals. Log in spreadsheet. Accounting reconciles at month-end.",
        pain:"Manual tracking of IC balances. Time zone issues. FX impact on IC transfers missed until month-end. No automated netting.",
        hrs:"10–20", err:"$50K–200K in FX losses from uncoordinated transfers", opt:"$100K–500K/yr from automated IC netting",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"d5", name:"FX Spot Trades", category:"FX Management", visible:true, timeEst:"~15–30 min per trade",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-bank">Bank</span>',
        systems:'<span class="sys-tag">Email</span> <span class="sys-tag">Phone</span> <span class="sys-tag">Bank FX portal</span>',
        how:"Identify FX need. Email/call 1–3 banks for spot quotes. Wait, compare manually. Accept best rate. Confirm trade details. Log in Excel.",
        pain:"No price transparency. Email-based execution means no audit trail. Banks know you can't compare, so spreads are wide.",
        hrs:"5–15", err:"$50K–300K/yr in excess FX spread", opt:"$100K–500K/yr from multi-bank competitive bidding",
        doToday:false, wishToDo:false,
        subs:[
          {id:"d5s1",name:"Rate Comparison & Best Execution",how:"Manually compare quotes from 1–3 banks in email. Calculate effective spread vs. mid-market rate.",pain:"Without mid-market benchmark, you can't know if quote is competitive. Banks mark up 10–50 bps."},
          {id:"d5s2",name:"Trade Confirmation & Settlement",how:"Receive confirmation via email/fax. Match against trade log. Ensure SSIs are correct. Monitor T+2 settlement.",pain:"Failed settlements = cash not where needed + penalties. SSI errors common with manual processes."}
        ]
      },
      { id:"d6", name:"Liquidity & Investment Decisions", category:"Cash Management", visible:true, timeEst:"~15–20 min/day",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">MMF portal</span>',
        how:"Review consolidated position. If excess: move to MMF or short-term paper. If short: draw on revolver or delay payment. Decision based on experience + Excel.",
        pain:"Decision relies on accuracy of morning position. No scenario modeling. No automated sweep optimization.",
        hrs:"8–12", err:"$100K–500K/yr sub-optimal investment allocation", opt:"$200K–1M/yr from automated sweep & yield optimization",
        doToday:false, wishToDo:false,
        subs:[{id:"d6s1",name:"Sweep Account Optimization",how:"Review sweep arrangements. Determine if balances should go to MMF, overnight repo, or stay for ECR. Compare ECR vs. Fed Funds.",pain:"Most companies leave millions idle because sweep optimization is too manual."}]
      },
      { id:"d7", name:"Counterparty Risk Monitoring", category:"Risk & Compliance", visible:true, timeEst:"~10–15 min/day",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Email alerts</span> <span class="sys-tag">News</span> <span class="sys-tag">Excel</span>',
        how:"Monitor bank counterparty creditworthiness — primarily reactive. Check CDS spreads or credit ratings if Bloomberg available. Track exposure concentration.",
        pain:"No automated alerts. Most learn about bank distress from news. FDIC only covers $250K. SVB collapse caught most mid-market off guard.",
        hrs:"3–5", err:"$5M–20M+ in uninsured deposits at risk", opt:"Risk mitigation — not direct $ savings",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"d8", name:"Cash Pooling / Sweep Structure", category:"Cash Management", visible:true, timeEst:"~10–15 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Excel</span>',
        how:"Monitor physical cash pool performance. Check for failed sweeps. Manage multi-currency considerations. Review target balances.",
        pain:"Sweep failures aren't flagged. Balances sit idle at subsidiaries. Cross-border pooling restrictions vary by country and are manually tracked.",
        hrs:"5–8", err:"$50K–200K/yr idle cash at subsidiaries", opt:"$100K–500K/yr from optimal pooling structure",
        doToday:false, wishToDo:false, subs:[]
      },
      // ── New Gap Workflows: Daily ──
      { id:"f1", name:"Payment Fraud Screening & Monitoring", category:"Fraud Prevention", visible:false,
        timeEst:"~15–30 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Fraud detection platform</span>',
        how:"Pre-release fraud checks: duplicate payment detection, vendor bank account change validation, amount threshold alerts, pattern anomaly detection, velocity checks. Post-release monitoring for unauthorized transactions.",
        pain:"AFP 2025: 79% of companies targeted by payment fraud. BEC losses exceeded $2.7B. Without automated screening, fraud detected hours or days late.",
        hrs:"8–12", err:"$125K–5M per fraud incident", opt:"$200K–1M/yr in prevented fraud losses",
        doToday:false, wishToDo:false,
        subs:[
          {id:"f1s1",name:"Rule-Set & Threshold Tuning",how:"Maintain and tune fraud detection rules: duplicate thresholds, velocity limits, amount caps, geo-fencing. Review false positive rates.",pain:"Static rules miss evolving fraud patterns. Too many false positives cause alert fatigue."},
          {id:"f1s2",name:"AI/ML Behavioral Anomaly Alerts",how:"Monitor AI-driven anomaly detection alerts. Review flagged transactions against historical patterns. Escalate confirmed anomalies.",pain:"AI models require continuous training data. Without proper calibration, miss rates or false positive rates are unacceptable."}
        ]
      },
      { id:"f2", name:"Positive Pay Reconciliation", category:"Fraud Prevention", visible:false,
        timeEst:"~15–30 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Check management system</span>',
        how:"Upload issued check/ACH files to banks for Positive Pay matching. Review exception items flagged by bank (mismatches). Make pay/no-pay decisions before daily cutoff (typically 2 PM).",
        pain:"Tight decision windows. Basic Positive Pay may not verify payee names, leaving check-washing vulnerability. Companies without positive pay experience 3–5x more check fraud.",
        hrs:"6–10", err:"$50K–500K/yr in check/ACH fraud losses", opt:"$100K–500K/yr in prevented fraud",
        doToday:false, wishToDo:false,
        subs:[
          {id:"f2s1",name:"Check Positive Pay",how:"Upload issued check files (check number, date, amount, payee). Review exceptions where presented checks don't match issued files.",pain:"Must be done before bank cutoff each day. Payee name verification not available at all banks."},
          {id:"f2s2",name:"ACH Positive Pay & Debit Filters",how:"Review pending ACH debits against authorized originator list. Approve or reject before processing. Maintain ACH debit filters/blocks.",pain:"ACH filter management requires ongoing maintenance as legitimate trading partners change."}
        ]
      },
      { id:"rt1", name:"API & Bank Connectivity Health Monitoring", category:"Real-Time Treasury", visible:false,
        timeEst:"~10–15 min/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">API monitoring tools</span> <span class="sys-tag">SWIFT</span>',
        how:"Monitor status of all API connections, SWIFT channels, host-to-host links, and SFTP transfers. Alert on failures, latency, or authentication issues. Track SLAs.",
        pain:"A failed bank connection can mean missed payments, stale cash positions, and broken forecasts. Most companies discover connectivity issues hours or days late.",
        hrs:"3–5", err:"$50K–200K from missed payments due to connectivity failure", opt:"$50K–100K/yr from proactive monitoring",
        doToday:false, wishToDo:false,
        subs:[
          {id:"rt1s1",name:"OAuth Token & Certificate Management",how:"Monitor OAuth 2.0 token expiry and SSL certificate renewal dates. Renew proactively before expiration causes outages.",pain:"Token expiry causes silent failures. Certificate renewal often forgotten until connection breaks."},
          {id:"rt1s2",name:"Error Rate & Latency Tracking",how:"Track API error rates, response times, and data freshness across all bank connections. Alert on degradation.",pain:"Degraded connections produce stale data that looks valid but is hours old."}
        ]
      },
      { id:"ih1", name:"Payment Factory Operations (POBO/COBO)", category:"Shared Services & In-House Bank", visible:false,
        timeEst:"~2–4 hours/day",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-ap">AP Team</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">ERP (SAP APM/IHB)</span> <span class="sys-tag">Bank portals</span>',
        how:"Centralize payment execution through a single legal entity on behalf of all subsidiaries (POBO). Similarly centralize collections (COBO). Each subsidiary holds a virtual account for traceability. Route payments through optimal channels.",
        pain:"POBO not permitted in all jurisdictions or for all payment types (e.g., tax payments remain local). Requires intercompany agreements between each entity and the payment factory. Setup costs recovered in ~1.5 years.",
        hrs:"40–80", err:"$100K–500K/yr from decentralized payment inefficiency", opt:"$200K–1M/yr from bank account reduction + fee savings",
        doToday:false, wishToDo:false,
        subs:[
          {id:"ih1s1",name:"Regulatory Feasibility per Country",how:"Assess whether POBO/COBO is permitted in each jurisdiction. Track regulatory changes. Maintain country-by-country compliance matrix.",pain:"Regulations vary widely. What works in EU may be prohibited in Latin America or Asia."},
          {id:"ih1s2",name:"IC Agreement Management",how:"Maintain intercompany agreements between each participating entity and the payment factory entity. Ensure transfer pricing compliance.",pain:"Legal documentation burden is significant. Each new entity requires a new agreement."}
        ]
      }
    ]
  },
  weekly: {
    label: "Weekly", tagline: "Usually Monday or Friday", color: "#e67e22",
    workflows: [
      { id:"w1", name:"13-Week Rolling Cash Forecast", category:"Cash Management", visible:true, timeEst:"~2–4 hours/week",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-fpa">FP&A</span> <span class="who-tag who-ap">AP Team</span> <span class="who-tag who-ar">AR Team</span>',
        systems:'<span class="sys-tag">Excel (the 13-week model)</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Email</span>',
        how:"Roll the 13-week model forward. Pull actuals from ERP. Compare forecast vs. actual. Email AP/AR/FP&A for updated inputs. Manually update each line item. Send to CFO.",
        pain:"The single most painful artifact in treasury. Version control nonexistent. Formulas break silently. Hours chasing updates. CFO questions numbers with no audit trail.",
        hrs:"12–20", err:"$500K–5M covenant breach risk from inaccurate forecast", opt:"$80K–120K/yr from eliminating manual forecast labor",
        doToday:false, wishToDo:false,
        subs:[
          {id:"w1s1",name:"Variance Analysis (Forecast vs. Actual)",how:"Compare last week's forecast to actual. Decompose by category. Calculate % accuracy by line item. Identify persistent biases.",pain:"Version control nightmare. Variance explanations rely on memory. No systematic accuracy tracking."},
          {id:"w1s2",name:"Stress Testing",how:"Model downside scenarios: AR 20% late, largest customer delays 30 days, unplanned acquisition. Manually adjust cells to see covenant headroom impact.",pain:"Done rarely because it's manual. No saved scenarios. No Monte Carlo simulation."},
          {id:"w1s3",name:"What-If Scenario Modeling",how:"Evaluate timing decisions: delay capex, accelerate collections, draw on revolver. Each scenario = manual Excel manipulation.",pain:"Takes 30–60 min per scenario. CFO asks for 3–4 in a meeting — analyst scrambles to build them in real time."},
          {id:"w1s4",name:"Root Cause Analysis",how:"When forecast misses >10%: dig into why. Pull transaction data from ERP, match to forecast, interview teams.",pain:"Often takes 2–4 hours for a single variance. No structured framework. Findings rarely documented."},
          {id:"w1s5",name:"Sensitivity Analysis",how:"Determine which inputs drive biggest variance. Build tornado chart. Used to prioritize better forecasting.",pain:"Almost never done in practice because it requires rebuilding the model with variable inputs."},
          {id:"w1s6",name:"Confidence Scoring & Input Quality",how:"Rate reliability of each line item. Weight forecast by confidence for probability-adjusted outlook.",pain:"No formal methodology. 'Gut feel' is the confidence model. CFO can't distinguish high vs. low confidence items."},
          {id:"w1s7",name:"Input Collection & Email Chase",how:"Every Monday: email AP, AR, FP&A, HR/Payroll, Tax for inputs. Track responses. Follow up Tuesday noon.",pain:"30–40% of forecast effort. Some weeks 50% of inputs arrive late. Analyst becomes project manager."},
          {id:"w1s8",name:"Model Maintenance & Version Control",how:"Fix broken formulas. Update linked ranges. Archive versions. Manage 'DK_edits' vs. 'CFO_comments'. Rebuild every ~6 months.",pain:"Most critical AND most fragile tool. One wrong formula can misstate position by millions. No audit trail."}
        ]
      },
      { id:"w2", name:"FX Exposure Review", category:"FX Management", visible:true, timeEst:"~1–2 hours/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Bloomberg (rare)</span>',
        how:"Pull AR/AP by currency. Layer in forecasted revenue/costs. Calculate net exposure per currency. Decide whether to hedge. Execute via bank. Track in Excel.",
        pain:"Exposure data scattered. Hedge decisions often reactive. No automated alerting. Hedge accounting requires tracking each instrument.",
        hrs:"6–10", err:"$500K per $10M unhedged exposure on 5% FX move", opt:"$100K–500K/yr from proactive hedging",
        doToday:false, wishToDo:false,
        subs:[
          {id:"w2s1",name:"Net Exposure Calculation",how:"Combine AR, AP, forecasted revenue/costs by currency, existing hedges. Net long/short by currency pair. Layered by time horizon.",pain:"Data from 4 sources, each with different update cycles."},
          {id:"w2s2",name:"Hedge Ratio & Instrument Decision",how:"Decide hedge %. Choose forward, option, or collar. Consider hedge accounting eligibility and CFO risk tolerance.",pain:"Decision tree is complex and rarely documented. Each instrument has different accounting implications."},
          {id:"w2s3",name:"Mark-to-Market & P&L Impact",how:"Weekly MTM of all active derivatives. Calculate unrealized P&L. Separate effective vs. ineffective portions.",pain:"Mid-market relies on bank-provided valuations (conflict of interest). No independent pricing."}
        ]
      },
      { id:"w3", name:"Liquidity & Credit Line Monitoring", category:"Liquidity Management", visible:true, timeEst:"~30–60 min/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Loan agreements (PDF)</span>',
        how:"Track available vs. drawn on each credit facility. Monitor maturities. Ensure headroom for coming weeks. Cross-check against covenants.",
        pain:"Facility details in PDF loan agreements. Available balances require logging into bank portals. No automated covenant monitoring.",
        hrs:"4–6", err:"$1M–50M+ if covenant breach triggers cross-default", opt:"$50K–200K/yr from optimized draw/repay timing",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"w4", name:"Bank Fee Analysis", category:"Bank Relationship Management", visible:true, timeEst:"~30 min/week (often skipped)",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span>',
        systems:'<span class="sys-tag">Bank analysis statements (AFP/BSB)</span> <span class="sys-tag">Excel</span>',
        how:"Download bank analysis statements. Compare charges to negotiated fee schedule. Flag anomalies.",
        pain:"Bank fee statements are deliberately complex (300+ service codes). Most companies overpay 20–30%.",
        hrs:"2–4", err:"$0 direct — massive opportunity cost", opt:"$100K+ per $100M payment volume in fee savings",
        doToday:false, wishToDo:false,
        subs:[
          {id:"w4s1",name:"Fee Schedule vs. Actual Comparison",how:"Map 300+ AFP service codes to contracted prices. Cross-reference actual charges. Identify overcharges.",pain:"Banks structure statements differently. Single wrong mapping = missed overcharge."},
          {id:"w4s2",name:"ECR vs. Fee-Based Analysis",how:"Compare fee-based pricing vs. compensating balances + ECR. Calculate break-even balance.",pain:"Many companies stuck in zero-rate era pricing, overpaying $50K–200K/yr."}
        ]
      },
      { id:"w5", name:"Payment Planning & Prioritization", category:"Payment Operations", visible:true, timeEst:"~1 hour/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-ap">AP Team</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Email</span>',
        how:"Review upcoming AP for next 1–2 weeks. Prioritize based on discount capture, vendor criticality, and available cash.",
        pain:"No automated discount optimization. Payment timing is gut-feel + Excel.",
        hrs:"4–6", err:"$0 (vendor relationship risk)", opt:"$100K–300K/yr in captured early-pay discounts",
        doToday:false, wishToDo:false,
        subs:[{id:"w5s1",name:"Early-Pay Discount Optimization",how:"Identify invoices with 2/10 net 30 terms. Calculate annualized return. Compare to borrowing cost.",pain:"Discount terms buried in ERP. Companies capture <25% of available discounts."}]
      },
      { id:"w6", name:"Letter of Credit & Guarantee Tracking", category:"Bank Relationship Management", visible:true, timeEst:"~30–60 min/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">PDF contracts</span>',
        how:"Track outstanding LCs and bank guarantees. Monitor expirations. Coordinate renewals. Ensure capacity within facility sub-limits.",
        pain:"LCs tracked in spreadsheet with manual expiration monitoring. A missed renewal = supply chain disruption.",
        hrs:"3–5", err:"$100K–1M supply chain disruption from missed LC renewal", opt:"$20K–50K/yr in fee optimization",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"w7", name:"52-Week Rolling Cash Forecast", category:"Cash Management", visible:true, timeEst:"~1–3 days/month (updated monthly)",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-fpa">FP&A</span> <span class="who-tag who-controller">Controller</span> <span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Email</span> <span class="sys-tag">TMS</span>',
        how:"Build and maintain a rolling 12-month (52-week) cash forecast using the indirect method — start from projected P&L and adjust for non-cash items, working capital changes, capex, debt service, and one-offs. Update monthly with actuals. First 13 weeks typically at weekly granularity (from the 13-week model), weeks 14–52 at monthly granularity. Consolidate across entities. Present to CFO, board, and lenders.",
        pain:"Completely different methodology from the 13-week (indirect vs. direct). Bridging the two forecasts is a nightmare — they never reconcile. Monthly granularity hides timing risks. Lenders demand it but the data quality degrades past week 13. Scenario analysis is manual. Most companies maintain a static annual budget and call it a 'forecast' — not a true rolling model.",
        hrs:"16–30", err:"$1M–10M+ from misstated strategic liquidity position; covenant breach risk", opt:"$200K–500K/yr from better capital allocation and reduced borrowing costs",
        doToday:false, wishToDo:false,
        subs:[
          {id:"w7s1",name:"Monthly Actuals Refresh & Roll-Forward",how:"Pull actual monthly results from ERP/GL. Replace forecast month with actuals. Extend forecast by one month to maintain 12-month rolling window. Reconcile to 13-week model for overlap period.",pain:"Actuals available 5–10 business days after month-end. Forecast goes stale while waiting. Reconciling to 13-week direct forecast is a manual, time-consuming exercise."},
          {id:"w7s2",name:"Indirect-to-Direct Method Bridge",how:"Convert P&L-based indirect forecast into cash flow components. Adjust for depreciation, amortization, stock comp, working capital changes, deferred revenue. Map to direct cash categories for consistency with 13-week.",pain:"The bridge between indirect and direct methods is the #1 source of forecast error. Non-cash adjustments are judgment calls. Working capital timing is guesswork past 13 weeks."},
          {id:"w7s3",name:"Scenario Analysis (Base / Upside / Downside)",how:"Build 3 scenarios: base case, optimistic (accelerated collections, delayed capex), pessimistic (revenue shortfall, customer loss, rate increase). Each scenario requires manual cell adjustments across the model.",pain:"Takes 4–8 hours per scenario. CFO and board want updated scenarios quarterly but the manual effort means they're often stale. No Monte Carlo or probability weighting."},
          {id:"w7s4",name:"Lender & Board Reporting Package",how:"Format the 52-week forecast into lender-required templates. Add covenant compliance projections. Create executive summary with key assumptions and risks. Prepare board deck slides.",pain:"Every lender has a different template. Board wants a narrative, not just numbers. Preparing the package is 30–40% of total forecast effort. Version control across reviewers is chaotic."},
          {id:"w7s5",name:"Annual Budget Alignment & Variance",how:"Compare rolling 52-week forecast to annual budget. Identify and explain variances. Update full-year outlook. Feed into quarterly earnings guidance preparation.",pain:"Budget was set months ago with different assumptions. Explaining variances requires going back to original budget assumptions. Rolling forecast and budget are maintained in separate workbooks."}
        ]
      },
      // ── New Gap Workflows: Weekly ──
      { id:"ir1", name:"Interest Rate Exposure Monitoring", category:"Interest Rate Risk", visible:false,
        timeEst:"~2–3 hours/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">TMS</span> <span class="sys-tag">Bloomberg</span>',
        how:"Track ratio of floating vs. fixed-rate debt exposure across entire portfolio. Monitor upcoming rate resets and maturity dates. Run scenario analysis (parallel shifts, curve steepening/flattening) to assess cash-flow-at-risk and mark-to-market impact.",
        pain:"Many teams manage this in spreadsheets — error-prone and not audit-ready. Rate reset dates scattered across multiple loan agreements are easy to miss. LIBOR-to-SOFR transition introduced basis risk.",
        hrs:"8–12", err:"$1M+ per 100bps on $100M floating debt", opt:"$200K–1M/yr from proactive rate management",
        doToday:false, wishToDo:false,
        subs:[
          {id:"ir1s1",name:"Cash-Flow-at-Risk Modeling",how:"Model interest expense impact under rate scenarios: +100bp, +200bp, -100bp, curve steepening. Calculate VaR on floating portfolio.",pain:"Static Excel scenarios don't capture optionality or correlation effects."},
          {id:"ir1s2",name:"Rate Reset Calendar",how:"Maintain calendar of all rate reset dates across debt portfolio. Alert 30/60/90 days before each reset. Evaluate pre-hedging opportunities.",pain:"Reset dates buried in loan agreements. A missed hedging window before a reset can be costly."}
        ]
      },
      { id:"sc1", name:"Reverse Factoring Program Management", category:"Supply Chain Finance", visible:false,
        timeEst:"~1–2 hours/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-ap">AP Team</span>',
        systems:'<span class="sys-tag">SCF platform</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Bank portal</span>',
        how:"Manage buyer-led supply chain finance program where approved invoices are uploaded to bank/fintech platform, allowing suppliers to receive early payment at a discount. Monitor utilization rates, track program economics, manage supplier relationships.",
        pain:"Supplier onboarding is slow (legal agreements, KYC). Accounting treatment debated (some regulators view as disguised debt). SCF market growing 15–20% annually.",
        hrs:"6–10", err:"$0 direct — working capital opportunity cost", opt:"$500K–10M+ in working capital release",
        doToday:false, wishToDo:false,
        subs:[
          {id:"sc1s1",name:"Supplier Onboarding & Offboarding",how:"Coordinate legal agreements, KYC documentation, and platform setup for new suppliers. Remove inactive suppliers.",pain:"Average supplier onboarding takes 4–8 weeks. Low adoption rates undermine program economics."},
          {id:"sc1s2",name:"Program Economics Tracking",how:"Monitor discount rates, utilization rates, spread vs. WACC, and total working capital impact. Report to CFO.",pain:"Without tracking, programs run on autopilot and may not generate expected returns."}
        ]
      },
      { id:"sc2", name:"Dynamic Discounting Optimization", category:"Supply Chain Finance", visible:false,
        timeEst:"~1 hour/week",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-ap">AP Team</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Dynamic discounting platform</span>',
        how:"Deploy excess cash to pay suppliers early in exchange for sliding-scale discounts (e.g., 3% for 5 days, 2% for 10 days). Yields average 10–12% APR annualized. Requires real-time cash position awareness.",
        pain:"Requires excess cash on hand. ERP integration is essential but often complex. Supplier adoption varies.",
        hrs:"4–6", err:"$0 — opportunity cost of missed discounts", opt:"$100K–1M/yr in captured early-pay discounts",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"f3", name:"Vendor Bank Account Validation (BEC Prevention)", category:"Fraud Prevention", visible:false,
        timeEst:"~30–60 min/week",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-ap">AP Team</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Account validation service</span> <span class="sys-tag">Phone</span>',
        how:"Callback verification for all payment requests and vendor banking detail changes, using phone numbers from trusted system of record. Dual authorization for payments above thresholds. Verify settlement instruction changes.",
        pain:"Vendor impersonation fraud rose to 45% of organizations (AFP 2025). AI-generated phishing now bypasses traditional red flags. A single unverified bank account change can result in $100K–$5M loss.",
        hrs:"3–5", err:"$100K–5M per BEC fraud incident", opt:"$200K–1M/yr in prevented BEC losses",
        doToday:false, wishToDo:false,
        subs:[
          {id:"f3s1",name:"Vendor Master Data Change Controls",how:"Review all vendor bank account changes before first payment to new details. Cross-reference against known fraud patterns. Require secondary approval.",pain:"AP teams often process changes without treasury oversight. No separation between who requests and who approves changes."},
          {id:"f3s2",name:"Dual Authorization for Threshold Payments",how:"Enforce dual approval for all payments above defined thresholds. Ensure approvers verify independently via out-of-band communication.",pain:"Threshold levels often set too high, leaving mid-range payments vulnerable."}
        ]
      }
    ]
  },
  monthly: {
    label: "Monthly", tagline: "Month-End Close (Days 1–10 of Next Month)", color: "#3498db",
    workflows: [
      { id:"m1", name:"Bank Reconciliation", category:"Reporting & Analysis", visible:true, timeEst:"~3–5 hours/month per bank",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">Bank statements</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span>',
        how:"Download bank statements. Match each transaction to GL entries in ERP. Identify unmatched items. Investigate. Prepare reconciliation workpaper for controller sign-off.",
        pain:"For 10+ bank accounts, this is days of work. No automated matching. Same items reconmed every month because prior months are never truly clean.",
        hrs:"15–30", err:"$100K–500K in undetected errors or fraud", opt:"$50K–100K/yr from automated matching",
        doToday:false, wishToDo:false,
        subs:[
          {id:"m1s1",name:"Transaction Matching",how:"One-by-one matching of bank transactions to GL entries. Sort by amount, date, reference. Match exact hits first, then investigate remainder.",pain:"5–10% of transactions don't match cleanly. Each one requires investigation — timing difference, FX rounding, or real error."},
          {id:"m1s2",name:"Unmatched Item Investigation",how:"Research each unmatched item. Call AP/AR for context. Check if it was booked to the wrong account. Determine if it's a timing issue or real error.",pain:"Each item can take 15–60 min to research. The same items recur monthly if root cause isn't fixed."},
          {id:"m1s3",name:"Reconciliation Workpaper Preparation",how:"Format reconciliation into standard template. Show bank balance, book balance, reconciling items. Get controller signature. File for audit.",pain:"Format varies by auditor preference. Workpapers maintained in Word/Excel with manual cross-references."}
        ]
      },
      { id:"m2", name:"Cash Forecast Variance Analysis", category:"Reporting & Analysis", visible:true, timeEst:"~2–3 hours/month",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span>',
        how:"Compile weekly forecast errors into monthly view. Calculate systematic bias by category. Present to CFO with explanations and corrective actions.",
        pain:"Requires going back through 4–5 weekly forecasts and comparing to actuals. No automated tracking. Same biases persist for months because there's no feedback loop.",
        hrs:"4–6", err:"Ongoing forecast degradation if biases not corrected", opt:"$50K–100K/yr from improved forecast accuracy",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"m3", name:"Month-End Treasury Journal Entries", category:"Reporting & Analysis", visible:true, timeEst:"~3–6 hours/month",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span>',
        how:"Book accruals for interest, fees, unrealized FX gains/losses, derivative MTM. Calculate and post intercompany interest. Prepare supporting schedules.",
        pain:"Manual calculation of interest accruals. FX translation entries require multiple data sources. Intercompany interest rates must match transfer pricing policy.",
        hrs:"6–12", err:"$50K–200K in misstated financials", opt:"$30K–60K/yr from automated JE preparation",
        doToday:false, wishToDo:false,
        subs:[
          {id:"m3s1",name:"Interest & Fee Accruals",how:"Calculate accrued interest on all debt facilities. Calculate accrued bank fees. Apply day-count conventions. Post accruals to GL.",pain:"Day-count conventions vary by instrument. Wrong accrual = audit finding."},
          {id:"m3s2",name:"FX Revaluation & Translation",how:"Revalue foreign-denominated monetary assets/liabilities at month-end rates. Calculate unrealized gains/losses. Post to P&L or OCI depending on accounting designation.",pain:"Requires correct month-end rates for each currency pair. Accounting treatment differs by item type. Auditors scrutinize closely."}
        ]
      },
      { id:"m4", name:"Intercompany Netting & Settlement", category:"Payment Operations", visible:true, timeEst:"~4–8 hours/month",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span>',
        how:"Collect IC invoices from all entities. Calculate net settlement amounts. Determine FX rates for cross-currency settlement. Initiate net payments. Post elimination entries.",
        pain:"IC reconciliation is perennial audit headache. Entities disagree on balances. FX timing differences create mismatches. No netting center = gross payments back and forth.",
        hrs:"8–15", err:"$100K–500K in IC balance differences at audit", opt:"$50K–200K/yr from reduced IC transfer costs",
        doToday:false, wishToDo:false,
        subs:[
          {id:"m4s1",name:"IC Invoice Reconciliation",how:"Each entity submits IC invoices. Central treasury compares matching pairs. Investigate discrepancies. Common issues: timing, FX rate differences, classification.",pain:"50% of IC invoices have discrepancies. Resolution requires coordination across entities/time zones."},
          {id:"m4s2",name:"Net Settlement Execution",how:"Calculate net position per entity pair. Convert to settlement currency. Execute transfers via banking portals. Multiple wires if different bank relationships.",pain:"Without a netting center, you might make 20 gross transfers instead of 5 net. Each wire costs $20–50."}
        ]
      },
      { id:"m5", name:"Debt & Investment Reporting", category:"Reporting & Analysis", visible:true, timeEst:"~2–4 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank/custodian portals</span>',
        how:"Update debt schedule: draws, repayments, interest payments. Update investment portfolio: maturities, purchases, yields. Calculate weighted average cost of debt and investment returns.",
        pain:"Data scattered across multiple bank/custodian portals. Manual aggregation in Excel. No single view of total debt + investment portfolio.",
        hrs:"4–6", err:"$50K–100K from misstated debt balances", opt:"$50K–200K/yr from yield optimization",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"m6", name:"Management / CFO Reporting", category:"Reporting & Analysis", visible:true, timeEst:"~3–5 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
        how:"Compile monthly treasury dashboard: cash position trend, forecast accuracy, FX exposure, debt/investment summary, bank fee analysis, covenant compliance status. Format in PowerPoint or PDF for CFO/Board.",
        pain:"Hours spent formatting, not analyzing. Same charts rebuilt monthly. No drill-down capability. Questions in meeting can't be answered in real-time.",
        hrs:"6–10", err:"Reputation/career risk from errors in CFO deck", opt:"$40K–80K/yr from automated dashboard generation",
        doToday:false, wishToDo:false,
        subs:[{id:"m6s1",name:"Dashboard Assembly & Chart Building",how:"Pull data from 5+ sources into PowerPoint. Build charts for cash trend, forecast accuracy, FX exposure, covenant headroom. Format to CFO preferences.",pain:"3–4 hours of formatting for 30 min of insights. CFO asks a question = 'I'll get back to you.'"}]
      },
      { id:"m7", name:"KYC/AML Documentation", category:"Risk & Compliance", visible:true, timeEst:"~2–4 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Email</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">PDF docs</span>',
        how:"Respond to bank KYC requests. Gather required documents (articles of incorporation, beneficial ownership, financial statements). Submit via email or bank portals. Track which banks need updates.",
        pain:"Each bank asks for different documents in different formats on different schedules. No central document repository. Requests often urgent with 30-day deadlines.",
        hrs:"4–8", err:"Account frozen if KYC not completed on time", opt:"$10K–30K/yr from centralized doc management",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"m8", name:"Payment Format & SWIFT Compliance", category:"Payment Operations", visible:true, timeEst:"~1–3 hours/month",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">SWIFT</span> <span class="sys-tag">Bank connectivity</span>',
        how:"Manage payment file formats (ISO 20022 migration, NACHA, SWIFT MT→MX). Test file submissions with banks. Troubleshoot rejected payments. Coordinate format changes with IT.",
        pain:"ISO 20022 migration is a multi-year effort. Each bank migrates on different timeline. Rejected payments disrupt cash management. IT prioritization battles.",
        hrs:"2–6", err:"$10K–50K from payment rejection/delay costs", opt:"Compliance — avoids future disruption",
        doToday:false, wishToDo:false, subs:[]
      },
      // ── New Gap Workflows: Monthly ──
      { id:"e1", name:"Bank Signatory Rights Management", category:"Bank Account Management (EBAM)", visible:false,
        timeEst:"~2–4 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Excel</span> <span class="sys-tag">HR system</span>',
        how:"Maintain authorized signer lists across all bank accounts. Process additions/removals when employees join, leave, or change roles. Cross-reference against HR terminations. Ensure board resolutions match bank records. Track expiration of powers of attorney.",
        pain:"Each bank has its own identity verification process. 2–4 hours per signatory change per bank. A departed employee with active signatory rights is a fraud vector. Top-5 audit finding.",
        hrs:"4–8", err:"$100K–1M fraud risk from stale signatories", opt:"$20K–50K/yr from streamlined signer management",
        doToday:false, wishToDo:false,
        subs:[
          {id:"e1s1",name:"Identity Verification per Bank",how:"Submit identity verification documents per each bank's requirements. Coordinate with banks on communication channels and identification methods.",pain:"Each bank has different requirements. Often requires offline steps, wet-ink signatures, or notarized documents."},
          {id:"e1s2",name:"Delegation of Authority Matrix Update",how:"Maintain matrix of signing authority levels and limits per account. Update when organizational structure changes.",pain:"Authority matrices become stale quickly. Mismatches between internal policy and bank mandates create confusion."}
        ]
      },
      { id:"cb1", name:"Trapped Cash Monitoring & Mobilization", category:"Cross-Border Cash Management", visible:false,
        timeEst:"~4–6 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-tax">Tax</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span>',
        how:"Maintain dashboard of cash balances in countries with capital/currency controls (China, India, Brazil, Nigeria, Argentina). Track regulatory changes affecting repatriation. Evaluate alternative mobilization: cash pooling, IC netting, bilateral payment agreements.",
        pain:"Cash accumulates in developing economies with political/regulatory risk. Cost of fragmented offshore cash = higher external funding at HQ. Currency depreciation risk on trapped balances.",
        hrs:"6–10", err:"$500K–5M in trapped cash opportunity cost", opt:"$200K–2M/yr from optimized cash mobilization",
        doToday:false, wishToDo:false,
        subs:[
          {id:"cb1s1",name:"Thin Capitalization Rule Tracking",how:"Monitor thin cap limits by jurisdiction that may limit intercompany lending as a repatriation mechanism.",pain:"Thin cap rules change frequently. Non-compliance can result in denied interest deductions."},
          {id:"cb1s2",name:"Currency Depreciation Risk Monitoring",how:"Track FX exposure on trapped balances in volatile currencies. Evaluate hedging options where available.",pain:"Many restricted currencies have limited or no hedging instruments available."}
        ]
      },
      { id:"cm1", name:"Commodity Exposure Assessment & Hedging", category:"Commodity Risk", visible:false,
        timeEst:"~3–5 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">ETRM platform</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Bloomberg</span>',
        how:"Cross-functional process (treasury + procurement + production) to quantify financial impact of commodity price volatility. Map exposures by commodity type, volume, timing, and currency. Execute hedges using futures, options, or swaps.",
        pain:"Lack of integration between physical procurement and financial hedging. Many commodities lack liquid hedge instruments. Cross-departmental data flows often broken.",
        hrs:"6–10", err:"$1M–10M from unhedged commodity exposure", opt:"$500K–5M/yr from proactive commodity hedging",
        doToday:false, wishToDo:false,
        subs:[
          {id:"cm1s1",name:"Non-Hedgeable Commodity Strategy",how:"For commodities without liquid derivatives: evaluate fixed-price contracts, index-linked pricing, strategic inventory management.",pain:"Many raw materials have no exchange-traded derivatives. Proxy hedging introduces basis risk."},
          {id:"cm1s2",name:"ETRM Platform Management",how:"Maintain commodity positions in Energy Trading & Risk Management system. Ensure trade capture and position reconciliation.",pain:"ETRM systems are complex and require specialized knowledge. Many companies still use spreadsheets."}
        ]
      },
      { id:"cm2", name:"Energy Procurement & Budget Variance", category:"Commodity Risk", visible:false,
        timeEst:"~2–3 hours/month",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Utility platforms</span>',
        how:"Track actual vs. budgeted energy costs. Monitor energy procurement contracts for renewal triggers. Evaluate renewable energy procurement options (PPAs, RECs). Report on commodity risk exposure.",
        pain:"Energy costs surged 40–80% in many markets. Renewable energy intermittency creates forecasting challenges. Also ties to Scope 2 emissions reporting.",
        hrs:"4–6", err:"$100K–500K from unmanaged energy cost overruns", opt:"$50K–200K/yr from optimized energy procurement",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"sc3", name:"Working Capital Dashboard & KPI Tracking", category:"Supply Chain Finance", visible:false,
        timeEst:"~2–3 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">ERP</span> <span class="sys-tag">Excel</span> <span class="sys-tag">BI tools</span>',
        how:"Calculate and trend DPO, DSO, DIO, Cash Conversion Cycle. Benchmark against industry peers. Identify working capital release opportunities. Evaluate SCF program performance.",
        pain:"Data siloed across AP, AR, and inventory systems. Difficulty attributing working capital improvements to specific initiatives. Most treasury teams track cash but not working capital metrics.",
        hrs:"4–6", err:"$0 — opportunity cost of unoptimized working capital", opt:"$1M–10M+ from working capital optimization (5–15% of revenue)",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"f4", name:"Fraud Incident Response & Reporting", category:"Fraud Prevention", visible:false,
        timeEst:"~2–4 hours/month review",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Email</span> <span class="sys-tag">Case management</span>',
        how:"When fraud detected: immediate bank notification, payment recall initiation, law enforcement reporting, insurance claim filing, root cause analysis, control remediation. Monthly review of fraud analytics and trends.",
        pain:"Response time critical — funds can be recalled within 24–48 hrs but rarely after 72 hrs. Without a playbook, response is chaotic and losses are higher.",
        hrs:"4–8", err:"$100K–5M in unrecovered fraud losses", opt:"$50K–200K/yr from faster fraud response",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"c1", name:"Treasury Controls Attestation & Evidence Packs", category:"SOX Compliance & Controls", visible:false,
        timeEst:"~4–8 hours/month",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">GRC platform</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Email</span>',
        how:"Produce immutable, timestamped audit trails documenting who approved what, when, and why for every treasury transaction. Compile evidence packs showing access controls, approval workflows, change logs, and exception handling.",
        pain:"If you cannot produce a complete trail, audit remediation becomes a scramble. Manual evidence collection is the #1 bottleneck in treasury audit support.",
        hrs:"8–16", err:"$200K–1M in audit fees from poor documentation", opt:"$50K–200K/yr from streamlined evidence collection",
        doToday:false, wishToDo:false,
        subs:[
          {id:"c1s1",name:"Multi-Level Approval Documentation",how:"Document all approval workflows based on amount thresholds. Verify approval records match required authority levels. Flag any override or exception.",pain:"Approvals spread across multiple systems (ERP, bank portals, email). Consolidating into a single evidence trail is manual."},
          {id:"c1s2",name:"Change Log Compilation",how:"Compile change logs from all treasury systems. Track user modifications to payment files, counterparty details, and system configurations.",pain:"Not all systems maintain adequate change logs. Gaps require compensating controls."}
        ]
      },
      { id:"ih2", name:"In-House Bank Administration", category:"Shared Services & In-House Bank", visible:false,
        timeEst:"~4–6 hours/month",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">TMS / IHB module</span> <span class="sys-tag">ERP</span>',
        how:"Operate internal bank accounts for all group entities: liquidity management, FX execution, IC lending, notional pooling. Process IC settlements, calculate IC interest at arm's-length rates. Maintain internal ledger of virtual accounts.",
        pain:"Requires robust accounting and reconciliation capabilities. Transfer pricing compliance for IC interest is scrutinized by tax authorities. System complexity is high.",
        hrs:"8–12", err:"$100K–500K in transfer pricing penalties", opt:"$100K–500K/yr from centralized liquidity management",
        doToday:false, wishToDo:false,
        subs:[
          {id:"ih2s1",name:"Transfer Pricing Compliance",how:"Ensure all IC interest rates comply with arm's-length requirements. Prepare benchmarking studies. Document methodology.",pain:"Tax authorities increasingly scrutinize IC interest rates. Documentation requirements growing under BEPS."},
          {id:"ih2s2",name:"Virtual Account Reconciliation",how:"Reconcile internal virtual accounts against external bank accounts. Ensure all IC flows are properly allocated.",pain:"High transaction volumes make daily reconciliation essential but time-consuming."}
        ]
      }
    ]
  },
  quarterly: {
    label: "Quarterly", tagline: "Calendar Quarter-End + Board Cycle", color: "#8e44ad",
    workflows: [
      { id:"q1", name:"Covenant Compliance Testing", category:"Risk & Compliance", visible:true, timeEst:"~4–8 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Loan agreements (PDF)</span>',
        how:"Calculate all financial covenants: leverage ratio, interest coverage, fixed charge coverage, minimum liquidity. Pull inputs from financial statements. Compare to thresholds in credit agreement. Prepare compliance certificate.",
        pain:"Covenant definitions in legal language (PDFs). Adjusted EBITDA calculation is complex and error-prone. A single miscalculation can trigger technical default. Often a last-minute scramble at quarter-end.",
        hrs:"5–8", err:"$1M–50M+ covenant breach = cross-default, acceleration, fee increases", opt:"$100K–500K/yr from proactive headroom management",
        doToday:false, wishToDo:false,
        subs:[
          {id:"q1s1",name:"Headroom Analysis & Early Warning",how:"Calculate how much each metric can deteriorate before breach. Model: 'What EBITDA decline triggers leverage breach?' Track trajectory vs. threshold.",pain:"Done in static Excel. No automated alerts as actuals approach limits. Surprises happen at quarter-end."},
          {id:"q1s2",name:"Sensitivity & Scenario Analysis",how:"Model impact of potential events: customer loss, FX move, M&A, restructuring charge. How does each affect covenant metrics?",pain:"Each scenario requires rebuilding the covenant model. Takes 1–2 hours per scenario. Rarely done proactively."},
          {id:"q1s3",name:"Compliance Certificate Preparation",how:"Draft compliance certificate per credit agreement format. Get CFO/Controller sign-off. Submit to agent bank within required deadline (usually 45–60 days).",pain:"Legal format is specific and varies by agreement. Deadline pressure is high. A late submission is itself a default event."}
        ]
      },
      { id:"q2", name:"Hedge Effectiveness Testing", category:"FX Management", visible:true, timeEst:"~4–8 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bloomberg (if available)</span>',
        how:"For each designated hedge: perform retrospective effectiveness test (dollar-offset or regression). Document results per ASC 815/IFRS 9. If hedge fails effectiveness, de-designate and reclassify P&L impact.",
        pain:"Hedge accounting is the most complex area of treasury accounting. One error = restatement. Most mid-market companies avoid hedge accounting entirely because it's too hard, and eat the P&L volatility.",
        hrs:"4–8", err:"$200K–2M in P&L volatility from failed hedge accounting", opt:"$100K–500K/yr from properly structured hedge accounting",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"q3", name:"Board / Executive Treasury Report", category:"Reporting & Analysis", visible:true, timeEst:"~6–10 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
        how:"Prepare comprehensive quarterly report: liquidity summary, forecast outlook, FX exposure and hedging update, debt portfolio overview, investment returns, covenant compliance, risk assessment, bank relationship update.",
        pain:"Massive time investment for a 15-minute board agenda item. Different stakeholders want different views. No dynamic reporting — every question requires going back to Excel.",
        hrs:"6–10", err:"Reputation/career risk from errors visible to Board", opt:"$60K–100K/yr from automated board reporting",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"q4", name:"Banking Relationship Review", category:"Bank Relationship Management", visible:true, timeEst:"~2–4 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span>',
        how:"Review wallet allocation: is each bank getting revenue proportional to credit commitment? Track fee revenue, FX revenue, capital markets revenue per bank. Assess service quality and issue resolution.",
        pain:"No standard framework. Wallet data scattered across fee statements, FX logs, capital markets activity. Banks always claim they're undercompensated.",
        hrs:"3–5", err:"Bank relationship deterioration → worse terms at renewal", opt:"$50K–200K/yr from better wallet optimization",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"q5", name:"Investment Policy Compliance", category:"Risk & Compliance", visible:true, timeEst:"~2–3 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Custodian reports</span>',
        how:"Review investment portfolio against policy limits: credit quality, concentration, duration, eligible instruments. Prepare compliance report for audit committee.",
        pain:"Policy limits in PDF, portfolio data from custodian portals. Manual comparison. Most companies check quarterly — a violation mid-quarter goes undetected.",
        hrs:"3–5", err:"$500K–5M credit loss from out-of-policy investments", opt:"$50K–200K/yr from optimized portfolio allocation",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"q6", name:"External Audit Support", category:"Reporting & Analysis", visible:true, timeEst:"~10–20 hours/quarter",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Email</span>',
        how:"Respond to audit requests: bank confirmations, debt schedules, derivative valuations, investment portfolios, IC balance confirmations. Pull supporting documentation.",
        pain:"Auditors request volumes of data with tight deadlines. Documentation scattered across systems. Same questions every year but no standardized response package.",
        hrs:"10–20", err:"$100K–500K in audit fees from poor documentation", opt:"$30K–80K/yr in reduced audit time from better organization",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"q7", name:"Counterparty Risk Deep Review", category:"Risk & Compliance", visible:true, timeEst:"~2–4 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Credit reports</span> <span class="sys-tag">Bloomberg</span>',
        how:"Full review of counterparty exposure: bank deposits, derivative MTM, investment holdings. Review credit ratings, CDS spreads, financial health. Update concentration limits. Report to risk committee.",
        pain:"Post-SVB, board/audit committee demands this quarterly. Data from multiple sources. No automated alerting between reviews.",
        hrs:"3–5", err:"$5M–50M+ in uninsured/concentrated exposure", opt:"Risk mitigation — protects downside",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"q8", name:"Bank Account Management", category:"Bank Relationship Management", visible:true, timeEst:"~2–4 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">Board resolutions</span>',
        how:"Review all bank accounts: which are active, dormant, needed? Open new accounts for new entities. Close dormant accounts. Update signatories. Maintain account register.",
        pain:"Account opening takes 4–6 weeks. Signer updates require board resolutions. Dormant accounts accumulate fees. No central account registry.",
        hrs:"3–5", err:"$20K–100K/yr in fees on unnecessary accounts", opt:"$20K–50K/yr from account rationalization",
        doToday:false, wishToDo:false, subs:[]
      },
      // ── New Gap Workflows: Quarterly ──
      { id:"c2", name:"Segregation of Duties Testing", category:"SOX Compliance & Controls", visible:false,
        timeEst:"~4–6 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">GRC platform</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">TMS</span>',
        how:"Verify no single individual controls all aspects of any financial transaction. Validate deal initiation and approval are separate, settlement release requires matching approvals, break-glass access has expiry dates. Generate SoD exception reports.",
        pain:"SoD violations are a material weakness under SOX. Fines for non-compliance: $1M–$5M+ for executives. Small treasury teams struggle to maintain adequate separation.",
        hrs:"5–8", err:"$1M–5M+ SOX material weakness / executive liability", opt:"Risk mitigation — protects against fraud and regulatory penalties",
        doToday:false, wishToDo:false,
        subs:[
          {id:"c2s1",name:"Break-Glass Access Review",how:"Review all emergency/break-glass access events. Verify they had second approvals and expiry dates. Document justification.",pain:"Break-glass usage often not properly documented or reviewed. Creates audit exceptions."},
          {id:"c2s2",name:"Override Documentation",how:"Review all approval overrides and exceptions. Verify each has documented justification and secondary approval.",pain:"Overrides accumulate without review. Each undocumented override is a potential audit finding."}
        ]
      },
      { id:"c3", name:"User Access Review (Bank Portals & TMS)", category:"SOX Compliance & Controls", visible:false,
        timeEst:"~3–5 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">TMS</span> <span class="sys-tag">ERP</span> <span class="sys-tag">HR system</span>',
        how:"Review all user access across bank portals, TMS, trading platforms. Cross-reference against HR for terminated/transferred employees. Validate access levels match job responsibilities. Document access certifications.",
        pain:"Orphaned accounts in bank portals are a critical audit finding and fraud risk. Average company has 15–20% stale users. Growing number of systems multiplies review burden.",
        hrs:"4–6", err:"$500K–2M fraud risk from orphaned accounts", opt:"$20K–50K/yr from streamlined access management",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"e3", name:"Bank Mandate & Documentation Registry", category:"Bank Account Management (EBAM)", visible:false,
        timeEst:"~2–3 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel / Document management</span> <span class="sys-tag">Bank portals</span>',
        how:"Centralized registry of all bank mandates, authorized signers, signing rules (single/dual), and limits per account. Cross-reference against HR terminations. Review with banks for accuracy.",
        pain:"Most companies cannot answer 'who can sign on which account?' in under 24 hours. This is a top-5 audit finding.",
        hrs:"3–5", err:"$50K–200K audit finding / account freeze risk", opt:"$10K–30K/yr from centralized mandate management",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"ir2", name:"Swap Portfolio Management & Valuation", category:"Interest Rate Risk", visible:false,
        timeEst:"~4–6 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Bloomberg</span>',
        how:"Maintain interest rate swap portfolio: trade execution, confirmations, settlement tracking. Calculate mark-to-market valuations. Monitor collateral/margin requirements. Track maturities and exercise dates. Perform hedge effectiveness testing per ASC 815/IFRS 9.",
        pain:"Swap valuations require reliable curve data. Hedge accounting documentation is complex. ISDA agreement management adds legal overhead. Mid-market relies on bank valuations (conflict of interest).",
        hrs:"5–8", err:"$200K–2M in P&L volatility from failed hedge accounting", opt:"$100K–500K/yr from optimized swap portfolio",
        doToday:false, wishToDo:false,
        subs:[
          {id:"ir2s1",name:"Hedge Effectiveness Testing (IR)",how:"Perform prospective and retrospective effectiveness tests for interest rate hedges. Document results per ASC 815/IFRS 9.",pain:"One error = restatement. Documentation requirements are onerous and ongoing."},
          {id:"ir2s2",name:"ISDA Agreement Management",how:"Maintain ISDA master agreements and CSAs with swap counterparties. Monitor collateral thresholds and margin requirements.",pain:"Legal complexity. Collateral calls during market stress can create liquidity pressure."}
        ]
      },
      { id:"ir3", name:"Debt Portfolio Restructuring Analysis", category:"Interest Rate Risk", visible:false,
        timeEst:"~4–8 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bloomberg</span>',
        how:"Evaluate opportunities to refinance, reprice, or restructure existing debt. Model cost/benefit of unwinding or restructuring existing swaps. Assess prepayment penalties, make-whole provisions, and breakage costs.",
        pain:"Breaking fixed-rate debt is expensive. Swap restructuring requires careful breakage cost analysis. Mark-to-market movements create P&L volatility if hedge accounting not maintained.",
        hrs:"5–8", err:"$200K–1M from sub-optimal debt structure", opt:"$200K–2M/yr from optimized debt portfolio",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"esg1", name:"Green Bond / Sustainability-Linked Instrument Compliance", category:"ESG / Sustainability", visible:false,
        timeEst:"~8–16 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ESG reporting platform</span>',
        how:"Track use-of-proceeds for green bonds against Green Bond Framework. Monitor sustainability-linked loan/bond KPI performance against targets. Manage coupon step-up risk if targets missed. Prepare disclosure per ICMA principles.",
        pain:"Heightened greenwashing scrutiny. Evolving regulatory landscape (EU Taxonomy, SEC rules in flux). KPI data often lives outside treasury. Missing KPI targets triggers pricing step-ups of 5–25 bps.",
        hrs:"10–16", err:"$500K–5M from coupon step-ups + reputational damage", opt:"$100K–500K/yr from ESG-linked pricing benefits",
        doToday:false, wishToDo:false,
        subs:[
          {id:"esg1s1",name:"External Assurance Coordination",how:"Coordinate with external auditors for assurance on ESG KPI reporting. Prepare terms of reference and data packages.",pain:"Assurance requirements add 2–3 weeks to reporting cycle. Data quality issues surface during assurance."},
          {id:"esg1s2",name:"ICMA Alignment Documentation",how:"Ensure all disclosures align with ICMA Green Bond Principles or Sustainability-Linked Bond Principles.",pain:"Principles evolve. Alignment documentation is detailed and cross-references multiple frameworks."}
        ]
      },
      { id:"cb2", name:"Cross-Border Cash Repatriation Planning", category:"Cross-Border Cash Management", visible:false,
        timeEst:"~3–5 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-tax">Tax</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Tax software</span>',
        how:"Joint treasury-tax-legal process to evaluate and execute cash repatriation from foreign subsidiaries. Assess mechanisms (dividends, royalties, management fees, IC loans, share buybacks). Model tax and FX costs. Coordinate with local finance teams.",
        pain:"Requires tight alignment between tax, treasury, and legal teams who often have different objectives. Transfer pricing documentation under BEPS is extensive. Currency volatility can erode repatriation value.",
        hrs:"4–6", err:"$200K–2M in unnecessary tax/FX costs", opt:"$500K–5M/yr from tax-efficient repatriation",
        doToday:false, wishToDo:false,
        subs:[
          {id:"cb2s1",name:"Section 245A DRD Analysis",how:"For US companies: evaluate dividends received deduction eligibility for foreign subsidiary distributions.",pain:"Complex rules with many exceptions. Requires coordination with tax advisors."},
          {id:"cb2s2",name:"Transfer Pricing Documentation",how:"Prepare benchmarking studies and transfer pricing documentation for IC fees and royalties used in repatriation.",pain:"OECD BEPS rules tightening globally. Documentation must be contemporaneous, not after-the-fact."}
        ]
      },
      { id:"cb3", name:"Intercompany Financing Compliance", category:"Cross-Border Cash Management", visible:false,
        timeEst:"~6–10 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-tax">Tax</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">TMS</span> <span class="sys-tag">Tax software</span>',
        how:"Ensure all cross-border IC loans comply with arm's-length pricing. Prepare benchmarking studies. Monitor thin capitalization limits by jurisdiction. Track FX exposure from IC financing and implement hedging.",
        pain:"OECD BEPS rules tightening globally. Documentation requirements increasingly demanding. FX exposure from IC financing is often overlooked.",
        hrs:"8–12", err:"$200K–2M in transfer pricing penalties", opt:"$100K–500K/yr from compliant IC financing",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"rt3", name:"Open Banking & Fintech Integration Review", category:"Real-Time Treasury", visible:false,
        timeEst:"~4–6 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">API platforms</span>',
        how:"Evaluate new API-based services: account aggregation, payment initiation, FX execution, cash forecasting AI. Assess security, compliance, and ROI. Manage fintech vendor relationships.",
        pain:"Treasury technology landscape evolving rapidly. Companies that don't evaluate quarterly miss cost savings and efficiency gains of 20–40%. Open Banking regulations exclude business accounts in many jurisdictions.",
        hrs:"5–8", err:"$0 — opportunity cost of outdated technology", opt:"$50K–200K/yr from better technology integration",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"ih3", name:"Shared Services Performance & Optimization", category:"Shared Services & In-House Bank", visible:false,
        timeEst:"~6–10 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">ERP</span> <span class="sys-tag">BI tools</span>',
        how:"Measure payment factory KPIs: STP rates, exception rates, cost per transaction, bank account reduction. Evaluate expansion to new countries/payment types. Benchmark against industry. Plan technology upgrades.",
        pain:"Stakeholder alignment difficult (treasury, AP, shared services, IT, local finance all have different priorities). Change management is most underestimated challenge.",
        hrs:"8–12", err:"$0 — efficiency opportunity cost", opt:"$100K–500K/yr from continuous optimization",
        doToday:false, wishToDo:false, subs:[]
      }
    ]
  },
  annual: {
    label: "Annual", tagline: "Year-End & Strategic Planning", color: "#16a085",
    workflows: [
      { id:"a1", name:"Capital Structure Planning", category:"Strategic Planning", visible:true, timeEst:"~20–40 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
        how:"Model optimal debt/equity mix. Analyze cost of capital scenarios. Evaluate refinancing options. Stress test capital structure against downside scenarios. Present recommendation to CFO/Board.",
        pain:"Complex modeling with many interdependencies. Sensitive to assumptions. Multiple stakeholders with different views. Often done once/year and becomes stale quickly.",
        hrs:"3–5", err:"$500K–5M/yr from sub-optimal capital structure", opt:"$200K–2M/yr from optimized cost of capital",
        doToday:false, wishToDo:false,
        subs:[
          {id:"a1s1",name:"Debt Maturity & Refinancing Analysis",how:"Map all debt maturities. Model refinancing scenarios: extend vs. repay vs. new issuance. Compare fixed vs. floating. Analyze rate lock opportunities.",pain:"Interest rate environment changes constantly. Analysis done annually but should be monitored continuously."},
          {id:"a1s2",name:"WACC & Cost of Capital Optimization",how:"Calculate WACC. Model impact of changing leverage. Compare to industry benchmarks. Evaluate ratings impact of different structures.",pain:"Requires market data and peer benchmarking that's hard to get for mid-market companies."}
        ]
      },
      { id:"a2", name:"Credit Facility Renewal / Amendment", category:"Bank Relationship Management", visible:true, timeEst:"~40–80 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Email</span> <span class="sys-tag">Legal docs</span>',
        how:"12–18 months before maturity: assess facility needs, prepare bank presentation, negotiate terms (pricing, covenants, structure), manage legal documentation, coordinate closing.",
        pain:"6+ month process. Legal fees $200K–500K. Banks use complexity as leverage. Covenant definitions are critical — one wrong word can cost millions.",
        hrs:"5–8", err:"$500K–2M in excess pricing from poor negotiation", opt:"$200K–1M/yr from competitive bank process",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"a3", name:"Annual Budget & Treasury Plan", category:"Strategic Planning", visible:true, timeEst:"~20–40 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span>',
        how:"Build annual cash flow forecast from budget. Plan borrowing/investment strategy. Set FX hedging targets. Budget bank fees and interest expense. Define treasury KPIs for the year.",
        pain:"Dependent on FP&A budget cycle (always late). Cash flow forecast built from P&L forecast (indirect method — inaccurate). Takes weeks to build and is outdated by January.",
        hrs:"3–5", err:"$200K–1M from misaligned cash strategy", opt:"$100K–500K/yr from proactive annual planning",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"a4", name:"Credit Rating Management", category:"Strategic Planning", visible:true, timeEst:"~20–40 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Rating agency portals</span> <span class="sys-tag">PowerPoint</span>',
        how:"Prepare annual presentation for rating agency. Model credit metrics vs. rating thresholds. Anticipate rating agency questions. Manage ongoing information requests.",
        pain:"Rating agencies have their own adjusted metrics (different from bank covenants). A downgrade increases borrowing costs by 25–100 bps. High-stakes presentation with limited preparation time.",
        hrs:"2–4", err:"$500K–5M/yr from rating downgrade (higher borrowing costs)", opt:"$200K–1M/yr from maintaining optimal rating",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"a5", name:"Insurance & Surety Bond Management", category:"Strategic Planning", visible:true, timeEst:"~10–20 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Broker portals</span>',
        how:"Review insurance coverage: D&O, E&O, property, cyber, trade credit. Coordinate with broker on renewals. Manage surety bonds and bank guarantees that may overlap.",
        pain:"Coverage gaps not discovered until a claim. Premiums increasing significantly. Overlap between insurance and bank guarantees wastes money. Renewal process is reactive.",
        hrs:"1–2", err:"$1M+ from coverage gaps discovered at claim time", opt:"$50K–200K/yr from optimized coverage & elimination of overlaps",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"a6", name:"Treasury Policy Review & Update", category:"Strategic Planning", visible:true, timeEst:"~10–20 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Word/PDF</span>',
        how:"Review and update: investment policy, FX hedging policy, cash management policy, authorization matrix, bank account opening/closing procedures. Get board approval for material changes.",
        pain:"Policies are often outdated by 2–3 years. Written in legal language that operators don't follow. Board approval process is slow. Policies don't reflect current market conditions.",
        hrs:"1–2", err:"Audit finding for outdated policies; regulatory risk", opt:"Governance — reduces operational risk",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"a7", name:"Tax Planning & Cross-Border Compliance", category:"Strategic Planning", visible:true, timeEst:"~20–40 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-tax">Tax</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Tax software</span>',
        how:"Coordinate treasury activities with tax planning: transfer pricing on IC loans, withholding tax on cross-border payments, cash repatriation strategies, BEPS compliance. Treasury provides the execution; tax provides the strategy.",
        pain:"Tax and treasury often work in silos. IC lending rates must be at arm's length (transfer pricing). Withholding tax rules vary by country — incorrect withholding = penalties. Trapped cash in foreign entities is common.",
        hrs:"2–4", err:"$200K–2M in tax penalties from non-compliant IC arrangements", opt:"$100K–1M/yr from tax-efficient cash repatriation",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"a8", name:"Bank Relationship Strategy & RFP", category:"Bank Relationship Management", visible:true, timeEst:"~20–40 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">PowerPoint</span> <span class="sys-tag">RFP templates</span>',
        how:"Set strategic bank panel. Conduct periodic RFPs for services. Evaluate bank proposals: pricing, technology, service, coverage. Award wallet based on credit participation and service quality.",
        pain:"RFP process is manual and time-consuming (3–6 months). No standardized comparison framework. Banks bundle pricing. Switching is painful (6–12 months to migrate).",
        hrs:"2–3", err:"$100K–500K/yr from sub-optimal bank panel", opt:"$200K–1M/yr from competitive bank sourcing",
        doToday:false, wishToDo:false, subs:[]
      },
      // ── New Gap Workflows: Annual ──
      { id:"e2", name:"Bank Account Opening & Closing", category:"Bank Account Management (EBAM)", visible:false,
        timeEst:"~4–8 hours per event",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-legal">Legal</span>',
        systems:'<span class="sys-tag">Bank portals</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Board resolutions</span>',
        how:"Manage full bank account lifecycle: business case, KYC documentation, board resolution, mandate setup, connectivity (SWIFT/API), testing, and go-live. Track dormant accounts for closure.",
        pain:"Account opening takes 2–8 weeks depending on jurisdiction. Companies with 50+ accounts often have 10–20% dormant accounts still accruing fees. Average opening without structured process takes 4–6 weeks.",
        hrs:"4–8", err:"$20K–100K/yr in fees on unnecessary accounts", opt:"$20K–100K/yr from account rationalization",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"e4", name:"Bank Account Rationalization", category:"Bank Account Management (EBAM)", visible:false,
        timeEst:"~8–16 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">Bank portals</span>',
        how:"Comprehensive audit of all bank accounts to identify dormant, redundant, or unnecessary accounts. Evaluate whether structure supports cash pooling/sweeping. Identify virtual account opportunities. Benchmark account counts against peers.",
        pain:"Mid-size companies average 3–5x more bank accounts than needed. Each unnecessary account = $500–2,000/yr in fees + operational overhead. Many organizations don't know exactly how many accounts they have.",
        hrs:"2–3", err:"$50K–200K/yr in excess account fees + operational overhead", opt:"$50K–200K/yr from consolidation",
        doToday:false, wishToDo:false,
        subs:[
          {id:"e4s1",name:"Fee Impact Analysis",how:"Calculate total cost of ownership per account: maintenance fees, transaction fees, connectivity costs, operational time. Identify accounts with negative ROI.",pain:"Fee data scattered across bank analysis statements. No standard cost-per-account metric."},
          {id:"e4s2",name:"Virtual Account Opportunity Assessment",how:"Evaluate whether physical accounts can be replaced with virtual accounts for segregation and reconciliation without the cost of separate bank accounts.",pain:"Virtual account capabilities vary significantly by bank and geography."}
        ]
      },
      { id:"esg2", name:"ESG-Linked Financing Decision Framework", category:"ESG / Sustainability", visible:false,
        timeEst:"~2–4 weeks per issuance evaluation",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-fpa">FP&A</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ESG reporting platform</span>',
        how:"Evaluate whether new debt instruments should incorporate sustainability-linked features. Assess cost-of-capital benefit vs. compliance burden. Select appropriate KPIs and benchmark against science-based targets.",
        pain:"SLL/SLB formats losing appeal in some markets. Companies from non-green industries face extra scrutiny. Regional regulatory divergence (EU vs. US) complicates global programs.",
        hrs:"4–8", err:"$0 — strategic opportunity cost", opt:"$100K–500K/yr from ESG-linked pricing benefits",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"esg3", name:"ESG Treasury Portfolio Reporting", category:"ESG / Sustainability", visible:false,
        timeEst:"~6–10 hours/year",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">Excel</span> <span class="sys-tag">ESG reporting platform</span>',
        how:"Report on ESG characteristics of treasury portfolio: green bond allocation, sustainability-linked facility utilization, carbon exposure in investment portfolio, alignment with company-wide ESG targets.",
        pain:"No single standard for treasury ESG reporting. Data aggregation across multiple instruments and counterparties is manual and fragmented.",
        hrs:"1–2", err:"$0 — regulatory/reputational risk", opt:"Governance — demonstrates ESG commitment",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"ma1", name:"M&A Day 1 Integration Readiness", category:"M&A Integration", visible:false,
        timeEst:"~40–100 hours per deal",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">Bank portals</span> <span class="sys-tag">ERP</span>',
        how:"Pre-close: compile all acquired entity bank accounts, cash pools, banking services, TMS/ERP systems. Establish Day 1 cash visibility for combined entity. Transition critical payment workflows (payroll, vendor payments). Define roles for combined treasury. Identify TSA items.",
        pain:"Inheriting dozens of unknown bank accounts across different providers and formats. Without central visibility, liquidity tracking is impossible. Legacy connections take months to set up.",
        hrs:"8–16", err:"$500K–5M from integration chaos (missed payments, lost cash visibility)", opt:"$200K–1M/yr from faster integration",
        doToday:false, wishToDo:false,
        subs:[
          {id:"ma1s1",name:"TSA Item Identification",how:"Identify all transition service agreement items for treasury: which acquired banking services need temporary continuation, which can be migrated immediately.",pain:"Missing TSA items discovered post-close cause payment disruptions and emergency workarounds."},
          {id:"ma1s2",name:"Temporary Funding Sources",how:"Establish temporary funding sources for the acquired entity: bridge facilities, intercompany lines, emergency credit.",pain:"Acquired entity's existing facilities may have change-of-control clauses that accelerate repayment."}
        ]
      },
      { id:"ma2", name:"Bank Account & System Migration", category:"M&A Integration", visible:false,
        timeEst:"~100–200 hours over 6–12 months",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">ERP</span> <span class="sys-tag">Bank portals</span>',
        how:"Consolidate bank accounts across combined entity. Rationalize banking relationships. Migrate to single TMS or define phased approach. Execute data migration with focus on integrity, compliance, and minimal downtime.",
        pain:"Running parallel systems strains training, compliance, and operations. Data loss, duplication, and inconsistent records are top risks. Full integration typically takes 12–24 months.",
        hrs:"8–16", err:"$200K–1M from data migration errors", opt:"$100K–500K/yr from consolidated banking",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"ma3", name:"Post-Integration Optimization", category:"M&A Integration", visible:false,
        timeEst:"~ongoing through year 2",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">ERP</span>',
        how:"Standardize treasury policies across combined entity. Implement IC netting if newly feasible. Optimize cash concentration and pooling. Evaluate in-house banking at new scale. Retire legacy systems.",
        pain:"Cultural and process differences between acquired and acquiring treasury teams. Setup costs recovered in ~1.5 years on average.",
        hrs:"4–8", err:"$100K–500K from suboptimal combined operations", opt:"$200K–1M/yr from optimized combined treasury",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"bc1", name:"Treasury BCP Development & Maintenance", category:"Business Continuity", visible:false,
        timeEst:"~4–8 hours/semi-annually",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">BCP documentation</span> <span class="sys-tag">Bank portals</span>',
        how:"Document all cash-flow-related processes and assess vulnerability to disruption. Define mission-critical activities (payroll, trade payments, cash positioning, debt service). Establish backup payment channels. Maintain emergency contacts.",
        pain:"Plans not tested are plans that will fail. MFA and security policies must remain in force during crisis. Ensuring key personnel have remote access to all critical systems.",
        hrs:"1–2", err:"$100K+ per day of payment disruption", opt:"Risk mitigation — ensures business continuity",
        doToday:false, wishToDo:false,
        subs:[
          {id:"bc1s1",name:"Pre-Arranged Credit Line Verification",how:"Verify emergency credit line is available and can be drawn quickly. Test drawdown procedures annually.",pain:"Emergency lines may have conditions precedent that prevent rapid drawdown."},
          {id:"bc1s2",name:"Remote Access Testing",how:"Test that key personnel can access all critical treasury systems (TMS, bank portals, ERP) from remote/backup locations.",pain:"VPN issues, MFA device dependencies, and firewall rules often prevent remote access during actual emergencies."}
        ]
      },
      { id:"bc2", name:"BCP Testing & Tabletop Exercises", category:"Business Continuity", visible:false,
        timeEst:"~4–8 hours/semi-annually",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">BCP documentation</span> <span class="sys-tag">Bank portals</span>',
        how:"Conduct tabletop exercises: ransomware attack on TMS, banking system outage, natural disaster, key person unavailability. Execute full-scale recovery exercises using backup payment channels. Test entire chain: cash reporting, payment execution, bank communication.",
        pain:"Many organizations test IT disaster recovery but never specifically test treasury payment continuity. Backup payment channels unfamiliar to staff who normally use automated TMS workflows.",
        hrs:"1–2", err:"$500K–5M from untested recovery procedures failing in real crisis", opt:"Risk mitigation — validated recovery capability",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"bc3", name:"Crisis Cash Management Protocol", category:"Business Continuity", visible:false,
        timeEst:"~8–12 hours/year to maintain",
        who:'<span class="who-tag who-treasurer">Treasurer</span>',
        systems:'<span class="sys-tag">BCP documentation</span> <span class="sys-tag">Excel</span>',
        how:"Pre-defined escalation procedures and cash conservation measures. Emergency drawdown procedures on credit facilities. Payment prioritization framework (payroll first, then debt service, then critical vendors). Communication templates for banks and counterparties.",
        pain:"Companies with pre-built crisis playbooks respond 3–5x faster to liquidity crises. Without one, decisions are ad-hoc and delayed by days of analysis. Ransomware attacks increasing.",
        hrs:"1–2", err:"$1M–10M+ from delayed crisis response", opt:"Risk mitigation — faster crisis response",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"rt2", name:"Real-Time Payment Operations", category:"Real-Time Treasury", visible:false,
        timeEst:"~ongoing (setup: 4–8 weeks per rail)",
        who:'<span class="who-tag who-analyst">Treasury Analyst</span> <span class="who-tag who-it">IT</span>',
        systems:'<span class="sys-tag">TMS</span> <span class="sys-tag">Payment gateway</span> <span class="sys-tag">Bank APIs</span>',
        how:"Manage payments across instant payment rails (RTP, FedNow, SEPA Instant). Implement real-time fraud screening before authorization (critical: instant payments are irrevocable). Embed SoD and approvals within real-time payment workflows.",
        pain:"Irrevocability means fraud detection must occur pre-authorization, not post-settlement. 24/7/365 operations challenge traditional staffing. Regional payment rail fragmentation.",
        hrs:"2–4", err:"$50K–500K from irrevocable fraudulent instant payments", opt:"$50K–200K/yr from instant payment efficiency",
        doToday:false, wishToDo:false, subs:[]
      },
      { id:"cm3", name:"Commodity Mark-to-Market & Valuation", category:"Commodity Risk", visible:false,
        timeEst:"~4–6 hours/quarter",
        who:'<span class="who-tag who-treasurer">Treasurer</span> <span class="who-tag who-controller">Controller</span>',
        systems:'<span class="sys-tag">ETRM platform</span> <span class="sys-tag">Excel</span> <span class="sys-tag">Bloomberg</span>',
        how:"Calculate current market value of all commodity derivative positions. Monitor margin requirements and collateral. Track P&L attribution between hedge and speculative components. Maintain hedge accounting documentation per ASC 815/IFRS 9.",
        pain:"Manual spreadsheet valuations are error-prone and not audit-ready. Real-time pricing data needed for volatile markets. Hedge accounting documentation is onerous.",
        hrs:"5–8", err:"$200K–2M from misstated commodity derivative valuations", opt:"$100K–500K/yr from proper hedge accounting",
        doToday:false, wishToDo:false, subs:[]
      }
    ]
  }
};
