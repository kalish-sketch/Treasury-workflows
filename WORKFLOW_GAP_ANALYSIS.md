# Treasury Workflow Gap Analysis

**Date:** March 6, 2026
**Current State:** 47 workflows + 33 sub-workflows across 5 cadences (Daily, Weekly, Monthly, Quarterly, Annual)

---

## Executive Summary

After comprehensive research against industry standards, regulatory requirements, and modern treasury best practices, **12 major workflow gap areas** were identified containing **~30 new workflows** that should be considered for addition. These gaps span fraud prevention, bank account lifecycle management, compliance, supply chain finance, sustainability, and emerging technology domains.

The gaps are prioritized below as **Critical** (regulatory/fraud risk), **High** (significant operational or financial impact), and **Medium** (strategic/efficiency value).

---

## GAP 1: EBAM — Electronic Bank Account Management (CRITICAL)

**What's missing:** The current `q8: Bank Account Management` workflow covers basics (~2-4 hrs/quarter), but lacks the full EBAM lifecycle that modern multibank treasury requires.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **e1** | **Bank Signatory Rights Management** | Monthly | Maintain authorized signer lists across all bank accounts. Process additions/removals when employees join, leave, or change roles. Ensure board resolutions match bank records. Track expiration of powers of attorney. | ~2–4 hrs/month | A departed employee with active signatory rights is a fraud vector. Auditors flag stale signers. Banks can freeze accounts if mandates are outdated. |
| **e2** | **Bank Account Opening & Closing** | As-needed / Quarterly review | Manage full lifecycle: business case, KYC documentation, board resolution, mandate setup, connectivity (SWIFT/API), testing, and go-live. Track dormant accounts for closure. | ~4–8 hrs per event | Companies with 50+ accounts often have 10-20% dormant accounts still accruing fees. Average account opening takes 4–6 weeks without a structured process. |
| **e3** | **Bank Mandate & Documentation Registry** | Quarterly | Centralized registry of all bank mandates, authorized signers, signing rules (single/dual), and limits per account. Cross-reference against HR terminations. | ~2–3 hrs/quarter | Most companies cannot answer "who can sign on which account?" in under 24 hours. This is a top-5 audit finding. |
| **e4** | **Bank Account Rationalization** | Annual | Review entire account structure. Identify redundant, dormant, or underutilized accounts. Consolidate where possible. Benchmark account counts against peers. | ~8–16 hrs/year | Mid-size companies average 3–5x more bank accounts than needed. Each unnecessary account = $500–2,000/yr in fees + operational overhead. |

**Suggested Agent:** Expand "Document & Compliance Agent" or create new "Bank Account Lifecycle Agent"

---

## GAP 2: Payment Fraud Detection & Monitoring (CRITICAL)

**What's missing:** Current `d3: Payment Approval & Release` has a sub-workflow for OFAC screening, but there is NO dedicated fraud detection workflow. This is arguably the single biggest gap.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **f1** | **Payment Fraud Screening & Monitoring** | Daily (real-time) | Pre-release fraud checks: duplicate detection, vendor bank account change validation, amount threshold alerts, pattern anomaly detection, velocity checks. Post-release monitoring for unauthorized transactions. | ~15–30 min/day + alerts | AFP 2024 survey: 80% of companies experienced attempted payment fraud. BEC (Business Email Compromise) losses exceeded $2.7B in 2023. Average loss per incident: $125K–$175K. |
| **f2** | **Positive Pay Reconciliation** | Daily | Upload issued check/ACH files to banks. Review exception items (payee/amount mismatches). Make pay/no-pay decisions before daily cutoff. | ~15–30 min/day | Companies without positive pay experience 3–5x more check fraud. Banks reject unmatched items, causing vendor disruption if not managed. |
| **f3** | **Vendor Bank Account Validation** | As-needed / Weekly review | Verify and validate vendor bank account changes before first payment. Cross-reference against known fraud patterns. Callback verification for account change requests. | ~30–60 min/week | Vendor impersonation (redirecting payments to fraudulent accounts) is the #1 payment fraud type. A single unverified bank account change can result in $100K–$5M loss. |
| **f4** | **Fraud Incident Response & Reporting** | As-needed / Monthly review | When fraud is detected: immediate bank notification, payment recall initiation, law enforcement reporting, insurance claim filing, root cause analysis, control remediation. | ~2–4 hrs/month review | Response time is critical — funds can be recalled within 24–48 hrs but rarely after 72 hrs. Without a playbook, response is chaotic and losses are higher. |

**Suggested Agent:** New "Fraud Prevention Agent"

---

## GAP 3: Treasury SOX Compliance & Internal Controls (CRITICAL)

**What's missing:** The current app has no dedicated compliance/controls testing workflows. SOX 404 compliance for treasury is a major effort at public companies.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **c1** | **Segregation of Duties Review** | Quarterly | Verify that payment initiation, approval, and release are properly segregated. Test that no single individual can complete an end-to-end payment. Review user access across all bank portals and TMS. | ~4–6 hrs/quarter | SoD violations are a material weakness under SOX. Auditors test this every year. Fines for SOX non-compliance: $1M–$5M+ for executives. |
| **c2** | **Treasury Controls Testing & Attestation** | Quarterly | Test effectiveness of key treasury controls: bank reconciliation sign-off, payment approval limits, FX trade authorization, investment policy compliance. Document test results. | ~6–10 hrs/quarter | Required for SOX 404 compliance. Control deficiencies can escalate to material weaknesses, affecting stock price and SEC filings. |
| **c3** | **User Access Review (Bank Portals & TMS)** | Quarterly | Review all user access across bank portals, TMS, trading platforms. Remove terminated employees. Validate access levels match job responsibilities. Document access certifications. | ~3–5 hrs/quarter | Orphaned accounts in bank portals are a critical audit finding and fraud risk. Average company has 15-20% stale users across banking platforms. |

**Suggested Agent:** Expand "Document & Compliance Agent" or new "Treasury Controls Agent"

---

## GAP 4: Supply Chain Finance & Working Capital (HIGH)

**What's missing:** Current `w5: Payment Planning & Prioritization` touches early-pay discounts, but the broader supply chain finance domain is absent.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **sc1** | **Supply Chain Finance Program Management** | Weekly | Manage reverse factoring / supplier finance programs. Onboard suppliers, monitor utilization rates, track program economics (spread vs. WACC), manage bank/fintech provider relationships. | ~1–2 hrs/week | SCF programs can unlock $10M–$100M+ in working capital. But 60% of programs underperform due to poor supplier onboarding and utilization tracking. |
| **sc2** | **Dynamic Discounting Optimization** | Weekly | Analyze AP invoices for early payment discount opportunities. Calculate annualized return vs. cost of capital. Prioritize and execute early payments. Track capture rates. | ~1 hr/week | Typical 2/10 net 30 = 36% annualized return. Most companies capture <25% of available discounts. Opportunity: $100K–$1M/yr for mid-size companies. |
| **sc3** | **Working Capital Dashboard & KPI Tracking** | Monthly | Calculate and trend DPO, DSO, DIO, CCC (Cash Conversion Cycle). Benchmark against industry peers. Identify working capital release opportunities. | ~2–3 hrs/month | Working capital optimization can release 5–15% of revenue as free cash flow. Most treasury teams track cash but not working capital metrics systematically. |

**Suggested Agent:** New "Working Capital Agent"

---

## GAP 5: Interest Rate Risk Management (HIGH)

**What's missing:** FX hedging is well-covered (d5, w2, q2), but there's no dedicated interest rate risk workflow despite it being equally important.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **ir1** | **Interest Rate Swap Portfolio Management** | Weekly | Monitor existing swap portfolio: mark-to-market, upcoming resets, counterparty exposure, collateral requirements (CSA/margin). Execute new swaps as needed. | ~1–2 hrs/week | A typical mid-to-large company has $50M–$500M+ in swaps. Unmonitored portfolios miss reset dates, incur unnecessary margin calls, and create P&L surprises. |
| **ir2** | **Debt Portfolio & Rate Reset Monitoring** | Monthly | Track all debt instruments: fixed vs. floating mix, rate reset dates, SOFR/term rate transitions, maturity wall analysis. Model interest expense under rate scenarios. | ~2–4 hrs/month | With LIBOR fully sunset, SOFR transition compliance is mandatory. A 100bp rate move on $100M floating debt = $1M/yr interest expense impact. |
| **ir3** | **Interest Rate Hedging Strategy Review** | Quarterly | Assess fixed/floating ratio against policy targets. Evaluate hedge instruments (swaps, caps, collars, swaptions). Model scenarios for rate moves. Make hedging recommendations. | ~4–6 hrs/quarter | Companies that don't actively manage their fixed/floating mix can see 20-40% swings in interest expense year-over-year in volatile rate environments. |

**Suggested Agent:** Expand "FX & Hedging Agent" → "FX, Rates & Hedging Agent"

---

## GAP 6: Real-Time Treasury & API Connectivity (HIGH)

**What's missing:** The current workflows assume batch/manual processes. Modern treasury is moving to real-time via APIs and open banking.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **rt1** | **API & Bank Connectivity Health Monitoring** | Daily | Monitor status of all API connections, SWIFT channels, host-to-host links, and SFTP transfers. Alert on failures, latency, or authentication issues. Track SLAs. | ~10–15 min/day | A failed bank connection can mean missed payments, stale cash positions, and broken forecasts. Most companies discover connectivity issues hours or days late. |
| **rt2** | **Real-Time Payment & Notification Management** | Daily | Manage instant payment rails (RTP, FedNow, SEPA Instant). Process real-time payment status notifications. Reconcile instant payments against ERP. | ~15–20 min/day | Real-time payments are growing 30%+ annually. By 2026, most B2B payments will have real-time status tracking. Treasury teams that can't handle instant notifications fall behind. |
| **rt3** | **Open Banking & Fintech Integration Review** | Quarterly | Evaluate new API-based services: account aggregation, payment initiation, FX execution, cash forecasting AI. Assess security, compliance, and ROI. Manage vendor relationships. | ~4–6 hrs/quarter | The treasury technology landscape is evolving rapidly. Companies that don't evaluate new integrations quarterly miss cost savings and efficiency gains of 20-40%. |

**Suggested Agent:** New "Treasury Technology Agent"

---

## GAP 7: ESG / Sustainability-Linked Treasury (MEDIUM-HIGH)

**What's missing:** ESG is rapidly becoming a core treasury function, with sustainability-linked loans and green bonds now mainstream.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **esg1** | **Sustainability-Linked Loan KPI Monitoring** | Quarterly | Track performance against sustainability KPIs embedded in loan agreements (e.g., emissions targets, diversity metrics). Report to lenders. Calculate pricing step-up/step-down impact. | ~3–5 hrs/quarter | Sustainability-linked loans reached $700B+ globally. Missing KPI targets triggers pricing step-ups of 5–25 bps. Non-reporting can trigger default-like events. |
| **esg2** | **Green Bond / ESG Bond Compliance Reporting** | Quarterly | Track use-of-proceeds for green/social/sustainability bonds. Prepare impact reporting. Ensure alignment with ICMA Green Bond Principles. | ~4–6 hrs/quarter | Green bond issuance requires ongoing reporting on use of proceeds. Greenwashing allegations can cause reputational damage and investor backlash. |
| **esg3** | **ESG Banking & Investment Screening** | Annual | Evaluate counterparties and investment portfolio against ESG criteria. Integrate ESG scores into counterparty risk framework. Align investment policy with corporate sustainability goals. | ~6–10 hrs/year | Investors and boards increasingly expect treasury to align with corporate ESG commitments. 40% of institutional investors now screen counterparties for ESG. |

**Suggested Agent:** New "ESG Treasury Agent"

---

## GAP 8: Commodity Risk Management (MEDIUM-HIGH)

**What's missing:** FX and interest rate risk are covered, but commodity price risk (relevant for many industries) is entirely absent.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **cm1** | **Commodity Exposure Assessment & Hedging** | Monthly | Identify commodity exposures (energy, metals, agricultural). Quantify exposure by commodity and time horizon. Evaluate hedging instruments (futures, swaps, options). Execute hedges per policy. | ~3–5 hrs/month | For manufacturing/industrial companies, commodity costs can be 30–60% of COGS. A 20% unhedged price move on $50M exposure = $10M margin impact. |
| **cm2** | **Energy & Utility Cost Management** | Monthly | Track energy procurement contracts, monitor wholesale market prices, manage renewable energy credits (RECs), optimize procurement timing. | ~2–3 hrs/month | Energy costs surged 40-80% in many markets. Active management can save 10-20% on energy spend. Also ties to Scope 2 emissions reporting. |

**Suggested Agent:** Expand "FX & Hedging Agent" or new "Commodity Risk Agent"

---

## GAP 9: Cash Repatriation & Cross-Border Cash Management (MEDIUM)

**What's missing:** Current `d4: Intercompany Funding` covers daily transfers, and `a7: Tax Planning` mentions cross-border. But the specific operational workflow of managing trapped cash and repatriation is missing.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **cb1** | **Trapped Cash & Repatriation Planning** | Monthly | Identify cash trapped in restricted jurisdictions. Evaluate repatriation mechanisms (dividends, royalties, IC loans, management fees). Model tax and FX costs. Execute optimal repatriation. | ~3–5 hrs/month | Companies with global operations routinely have 20–40% of cash "trapped" in subsidiaries. Inefficient repatriation costs 5–15% in taxes and FX friction. |
| **cb2** | **Cross-Border Regulatory Compliance** | Monthly | Monitor capital controls, exchange regulations, and reporting requirements across operating countries. Track regulatory changes. Ensure compliance with local central bank requirements. | ~2–3 hrs/month | Regulatory violations in countries like China, India, Brazil can result in account freezes, fines, and inability to repatriate funds. Rules change frequently. |

**Suggested Agent:** Expand "Intercompany Agent"

---

## GAP 10: M&A Treasury Integration (MEDIUM)

**What's missing:** No workflow for the treasury workstream during mergers & acquisitions — a high-stakes, time-critical process.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **ma1** | **M&A Treasury Due Diligence & Integration** | As-needed / Annual review | Pre-close: assess target's banking, cash, debt, hedging, and treasury operations. Post-close: integrate bank accounts, consolidate cash pools, migrate payments, harmonize policies. Day-1 readiness checklist. | ~40–100 hrs per deal | Treasury integration is one of the most complex post-merger workstreams. Poor integration leads to cash visibility gaps, missed payments, and 6-12 months of operational chaos. |

**Suggested Agent:** Expand "Strategic Planning Agent"

---

## GAP 11: Treasury Business Continuity (MEDIUM)

**What's missing:** No workflow for disaster recovery, backup payment channels, or crisis cash management.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **bc1** | **Treasury Business Continuity Plan Testing** | Semi-Annual | Test backup payment channels, verify remote access to bank portals, test manual payment procedures, validate emergency contacts, drill crisis cash management scenarios. Update BCP documentation. | ~4–8 hrs/semi-annually | During COVID, companies without tested BCPs couldn't make payments for days. A single day of payment disruption can cost $100K+ in late fees, supply chain breaks, and reputational damage. |
| **bc2** | **Crisis Cash Management Playbook** | Annual review / As-needed activation | Pre-defined cash conservation actions at tiered trigger levels: draw revolvers, suspend buybacks, defer capex, accelerate collections, extend payables. Activation protocols and communication plans. | ~8–12 hrs/year to maintain | Companies with pre-built crisis playbooks respond 3–5x faster to liquidity crises. Without one, decisions are ad-hoc and often delayed by days of analysis. |

**Suggested Agent:** Expand "Strategic Planning Agent"

---

## GAP 12: Treasury Shared Services & In-House Bank (MEDIUM)

**What's missing:** For larger organizations, payment factory and in-house banking operations are significant workflows.

### Proposed New Workflows

| ID | Workflow Name | Cadence | Description | Est. Time | Why It Matters |
|---|---|---|---|---|---|
| **ih1** | **Payment Factory Operations (POBO/COBO)** | Daily | Manage centralized payment execution on behalf of subsidiaries (Pay-On-Behalf-Of / Collect-On-Behalf-Of). Route payments through optimal channels. Manage virtual accounts. Reconcile back to subsidiary ledgers. | ~30–60 min/day | Payment factories can reduce bank accounts by 50–70%, cut transaction costs by 20–30%, and improve control. But they require dedicated operational workflows. |
| **ih2** | **In-House Bank Administration** | Monthly | Manage internal accounts, calculate intercompany interest (arm's length), process internal settlements, generate internal bank statements, ensure transfer pricing compliance. | ~4–6 hrs/month | In-house banks centralize 80–90% of intercompany flows but need ongoing administration. Transfer pricing non-compliance can trigger tax penalties of 20–40% of adjustments. |

**Suggested Agent:** Expand "Intercompany Agent" or new "Shared Services Agent"

---

## Summary: Proposed New Workflows by Priority

### Critical Priority (Regulatory / Fraud Risk)
| # | Gap Area | New Workflows | Key Risk If Missing |
|---|---|---|---|
| 1 | EBAM & Signatory Management | 4 workflows | Unauthorized access, audit findings, account freezes |
| 2 | Payment Fraud Detection | 4 workflows | $125K–$5M per fraud incident, 80% of companies targeted |
| 3 | SOX Compliance & Controls | 3 workflows | Material weakness, SEC penalties, executive liability |

### High Priority (Significant Financial Impact)
| # | Gap Area | New Workflows | Key Opportunity |
|---|---|---|---|
| 4 | Supply Chain Finance | 3 workflows | $10M–$100M+ working capital release |
| 5 | Interest Rate Risk | 3 workflows | $1M+ per 100bps on $100M floating debt |
| 6 | Real-Time Treasury & APIs | 3 workflows | 20–40% efficiency gains, competitive necessity |

### Medium-High Priority (Strategic Value)
| # | Gap Area | New Workflows | Key Driver |
|---|---|---|---|
| 7 | ESG / Sustainability | 3 workflows | $700B+ sustainability-linked market, pricing penalties |
| 8 | Commodity Risk | 2 workflows | 30–60% of COGS for industrial companies |

### Medium Priority (Operational Excellence)
| # | Gap Area | New Workflows | Key Driver |
|---|---|---|---|
| 9 | Cash Repatriation | 2 workflows | 20–40% of cash trapped in subsidiaries |
| 10 | M&A Integration | 1 workflow | 6–12 months of chaos without structured approach |
| 11 | Business Continuity | 2 workflows | Payment disruption during crises |
| 12 | Shared Services / IHB | 2 workflows | 50–70% account reduction, 20–30% cost savings |

---

## Total Impact

- **Current workflows:** 47 main + 33 sub-workflows = 80 total
- **Proposed additions:** ~30 new workflows
- **New total:** ~77 main workflows + sub-workflows = ~110 total
- **New agents needed:** 3–4 (Fraud Prevention, Working Capital, ESG Treasury, Treasury Technology)
- **Agent expansions:** 2–3 (FX & Hedging → add rates/commodities, Intercompany → add cross-border/IHB, Document & Compliance → add controls/EBAM)

---

## Recommended Implementation Phases

**Phase 1 (Immediate):** Payment Fraud Detection (#2) + EBAM (#1) + SOX Controls (#3)
- Highest risk exposure, regulatory requirements, audit pressure

**Phase 2 (Next Quarter):** Interest Rate Risk (#5) + Supply Chain Finance (#4) + Real-Time Treasury (#6)
- Significant financial impact, competitive differentiation

**Phase 3 (Following Quarter):** ESG (#7) + Commodity Risk (#8) + Cash Repatriation (#9)
- Strategic value, growing regulatory requirements

**Phase 4 (As Needed):** M&A Integration (#10) + BCP (#11) + Shared Services (#12)
- Event-driven or scale-dependent
