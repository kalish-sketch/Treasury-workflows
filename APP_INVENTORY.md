# Treasury Workflows — Complete App Inventory

> Auto-generated inventory of all workflows in the Treasury Workflows application.
> Source of truth: `data/workflows.ts`

## Summary

| Cadence | Visible | Gap | Total |
|---|---|---|---|
| Daily | 8 | 4 | 12 |
| Weekly | 7 | 4 | 11 |
| Monthly | 8 | 8 | 16 |
| Quarterly | 8 | 10 | 18 |
| Annual | 8 | 12 | 20 |
| **Total** | **39** | **38** | **77** |

---

## Daily — "Every Morning by 9 AM" (12 workflows)

### 1. Cash Position Report `[d1]`
- **Category:** Cash Management
- **Time:** ~45–90 min/day
- **Who:** Treasury Analyst
- **Systems:** Bank portals (×5–10), Excel, SWIFT / BAI files
- **Sub-workflows:**
  - `[d1s1]` Bank Portal Login & Data Collection
  - `[d1s2]` Multi-Currency Consolidation
  - `[d1s3]` In-Transit Item Adjustment
  - `[d1s4]` Exception / Anomaly Flagging

### 2. Short-Term Cash Forecast (1–5 day) `[d2]`
- **Category:** Cash Management
- **Time:** ~30–60 min/day
- **Who:** Treasury Analyst, AP Team, AR Team
- **Systems:** ERP, Excel, Email
- **Sub-workflows:**
  - `[d2s1]` AP/AR Data Pull & Validation
  - `[d2s2]` Departmental Confirmation (Email Chase)
  - `[d2s3]` One-Off / Non-Recurring Layering

### 3. Payment Approval & Release `[d3]`
- **Category:** Payment Operations
- **Time:** ~30–60 min/day
- **Who:** Treasurer, AP Team
- **Systems:** ERP, Bank portals, Email
- **Sub-workflows:**
  - `[d3s1]` Payment Batch Review & Validation
  - `[d3s2]` Dual Authorization & Release
  - `[d3s3]` OFAC / Sanctions Screening

### 4. Intercompany Funding `[d4]`
- **Category:** Cash Management
- **Time:** ~20–40 min/day
- **Who:** Treasury Analyst, Treasurer
- **Systems:** Bank portals, Excel, ERP
- **Sub-workflows:** None

### 5. FX Spot Trades `[d5]`
- **Category:** FX Management
- **Time:** ~15–30 min per trade
- **Who:** Treasurer, Bank
- **Systems:** Email, Phone, Bank FX portal
- **Sub-workflows:**
  - `[d5s1]` Rate Comparison & Best Execution
  - `[d5s2]` Trade Confirmation & Settlement

### 6. Liquidity & Investment Decisions `[d6]`
- **Category:** Cash Management
- **Time:** ~15–20 min/day
- **Who:** Treasurer
- **Systems:** Excel, Bank portals, MMF portal
- **Sub-workflows:**
  - `[d6s1]` Sweep Account Optimization

### 7. Counterparty Risk Monitoring `[d7]`
- **Category:** Risk & Compliance
- **Time:** ~10–15 min/day
- **Who:** Treasurer
- **Systems:** Email alerts, News, Excel
- **Sub-workflows:** None

### 8. Cash Pooling / Sweep Structure `[d8]`
- **Category:** Cash Management
- **Time:** ~10–15 min/day
- **Who:** Treasury Analyst, Treasurer
- **Systems:** Bank portals, Excel
- **Sub-workflows:** None

### 9. Payment Fraud Screening & Monitoring `[f1]` — *Gap*
- **Category:** Fraud Prevention
- **Time:** ~15–30 min/day
- **Who:** Treasury Analyst, Treasurer
- **Systems:** TMS, Bank portals, Fraud detection platform
- **Sub-workflows:**
  - `[f1s1]` Rule-Set & Threshold Tuning
  - `[f1s2]` AI/ML Behavioral Anomaly Alerts

### 10. Positive Pay Reconciliation `[f2]` — *Gap*
- **Category:** Fraud Prevention
- **Time:** ~15–30 min/day
- **Who:** Treasury Analyst
- **Systems:** Bank portals, ERP, Check management system
- **Sub-workflows:**
  - `[f2s1]` Check Positive Pay
  - `[f2s2]` ACH Positive Pay & Debit Filters

### 11. API & Bank Connectivity Health Monitoring `[rt1]` — *Gap*
- **Category:** Real-Time Treasury
- **Time:** ~10–15 min/day
- **Who:** Treasury Analyst, IT
- **Systems:** TMS, API monitoring tools, SWIFT
- **Sub-workflows:**
  - `[rt1s1]` OAuth Token & Certificate Management
  - `[rt1s2]` Error Rate & Latency Tracking

### 12. Payment Factory Operations (POBO/COBO) `[ih1]` — *Gap*
- **Category:** Shared Services & In-House Bank
- **Time:** ~2–4 hours/day
- **Who:** Treasury Analyst, AP Team
- **Systems:** TMS, ERP (SAP APM/IHB), Bank portals
- **Sub-workflows:**
  - `[ih1s1]` Regulatory Feasibility per Country
  - `[ih1s2]` IC Agreement Management

---

## Weekly — "Usually Monday or Friday" (11 workflows)

### 1. 13-Week Rolling Cash Forecast `[w1]`
- **Category:** Cash Management
- **Time:** ~2–4 hours/week
- **Who:** Treasury Analyst, FP&A, AP Team, AR Team
- **Systems:** Excel (the 13-week model), ERP, Email
- **Sub-workflows:**
  - `[w1s1]` Variance Analysis (Forecast vs. Actual)
  - `[w1s2]` Stress Testing
  - `[w1s3]` What-If Scenario Modeling
  - `[w1s4]` Root Cause Analysis
  - `[w1s5]` Sensitivity Analysis
  - `[w1s6]` Confidence Scoring & Input Quality
  - `[w1s7]` Input Collection & Email Chase
  - `[w1s8]` Model Maintenance & Version Control

### 2. FX Exposure Review `[w2]`
- **Category:** FX Management
- **Time:** ~1–2 hours/week
- **Who:** Treasurer, FP&A
- **Systems:** Excel, ERP, Bloomberg (rare)
- **Sub-workflows:**
  - `[w2s1]` Net Exposure Calculation
  - `[w2s2]` Hedge Ratio & Instrument Decision
  - `[w2s3]` Mark-to-Market & P&L Impact

### 3. Liquidity & Credit Line Monitoring `[w3]`
- **Category:** Liquidity Management
- **Time:** ~30–60 min/week
- **Who:** Treasurer
- **Systems:** Excel, Bank portals, Loan agreements (PDF)
- **Sub-workflows:** None

### 4. Bank Fee Analysis `[w4]`
- **Category:** Bank Relationship Management
- **Time:** ~30 min/week (often skipped)
- **Who:** Treasury Analyst
- **Systems:** Bank analysis statements (AFP/BSB), Excel
- **Sub-workflows:**
  - `[w4s1]` Fee Schedule vs. Actual Comparison
  - `[w4s2]` ECR vs. Fee-Based Analysis

### 5. Payment Planning & Prioritization `[w5]`
- **Category:** Payment Operations
- **Time:** ~1 hour/week
- **Who:** Treasurer, AP Team
- **Systems:** ERP, Excel, Email
- **Sub-workflows:**
  - `[w5s1]` Early-Pay Discount Optimization

### 6. Letter of Credit & Guarantee Tracking `[w6]`
- **Category:** Bank Relationship Management
- **Time:** ~30–60 min/week
- **Who:** Treasurer, Legal
- **Systems:** Excel, Bank portals, PDF contracts
- **Sub-workflows:** None

### 7. 52-Week Rolling Cash Forecast `[w7]`
- **Category:** Cash Management
- **Time:** ~1–3 days/month (updated monthly)
- **Who:** Treasury Analyst, FP&A, Controller, Treasurer
- **Systems:** Excel, ERP, Email, TMS
- **Sub-workflows:**
  - `[w7s1]` Monthly Actuals Refresh & Roll-Forward
  - `[w7s2]` Indirect-to-Direct Method Bridge
  - `[w7s3]` Scenario Analysis (Base / Upside / Downside)
  - `[w7s4]` Lender & Board Reporting Package
  - `[w7s5]` Annual Budget Alignment & Variance

### 8. Interest Rate Exposure Monitoring `[ir1]` — *Gap*
- **Category:** Interest Rate Risk
- **Time:** ~2–3 hours/week
- **Who:** Treasurer, FP&A
- **Systems:** Excel, TMS, Bloomberg
- **Sub-workflows:**
  - `[ir1s1]` Cash-Flow-at-Risk Modeling
  - `[ir1s2]` Rate Reset Calendar

### 9. Reverse Factoring Program Management `[sc1]` — *Gap*
- **Category:** Supply Chain Finance
- **Time:** ~1–2 hours/week
- **Who:** Treasurer, AP Team
- **Systems:** SCF platform, ERP, Bank portal
- **Sub-workflows:**
  - `[sc1s1]` Supplier Onboarding & Offboarding
  - `[sc1s2]` Program Economics Tracking

### 10. Dynamic Discounting Optimization `[sc2]` — *Gap*
- **Category:** Supply Chain Finance
- **Time:** ~1 hour/week
- **Who:** Treasurer, AP Team
- **Systems:** ERP, Dynamic discounting platform
- **Sub-workflows:** None

### 11. Vendor Bank Account Validation (BEC Prevention) `[f3]` — *Gap*
- **Category:** Fraud Prevention
- **Time:** ~30–60 min/week
- **Who:** Treasury Analyst, AP Team
- **Systems:** ERP, Account validation service, Phone
- **Sub-workflows:**
  - `[f3s1]` Vendor Master Data Change Controls
  - `[f3s2]` Dual Authorization for Threshold Payments

---

## Monthly — "Month-End Close (Days 1–10 of Next Month)" (16 workflows)

### 1. Bank Reconciliation `[m1]`
- **Category:** Reporting & Analysis
- **Time:** ~3–5 hours/month per bank
- **Who:** Treasury Analyst, Controller
- **Systems:** Bank statements, ERP, Excel
- **Sub-workflows:**
  - `[m1s1]` Transaction Matching
  - `[m1s2]` Unmatched Item Investigation
  - `[m1s3]` Reconciliation Workpaper Preparation

### 2. Cash Forecast Variance Analysis `[m2]`
- **Category:** Reporting & Analysis
- **Time:** ~2–3 hours/month
- **Who:** Treasury Analyst, Treasurer
- **Systems:** Excel, ERP
- **Sub-workflows:** None

### 3. Month-End Treasury Journal Entries `[m3]`
- **Category:** Reporting & Analysis
- **Time:** ~3–6 hours/month
- **Who:** Treasury Analyst, Controller
- **Systems:** ERP, Excel
- **Sub-workflows:**
  - `[m3s1]` Interest & Fee Accruals
  - `[m3s2]` FX Revaluation & Translation

### 4. Intercompany Netting & Settlement `[m4]`
- **Category:** Payment Operations
- **Time:** ~4–8 hours/month
- **Who:** Treasury Analyst, Controller
- **Systems:** ERP, Excel, Bank portals
- **Sub-workflows:**
  - `[m4s1]` IC Invoice Reconciliation
  - `[m4s2]` Net Settlement Execution

### 5. Debt & Investment Reporting `[m5]`
- **Category:** Reporting & Analysis
- **Time:** ~2–4 hours/month
- **Who:** Treasurer
- **Systems:** Excel, Bank/custodian portals
- **Sub-workflows:** None

### 6. Management / CFO Reporting `[m6]`
- **Category:** Reporting & Analysis
- **Time:** ~3–5 hours/month
- **Who:** Treasurer
- **Systems:** Excel, PowerPoint
- **Sub-workflows:**
  - `[m6s1]` Dashboard Assembly & Chart Building

### 7. KYC/AML Documentation `[m7]`
- **Category:** Risk & Compliance
- **Time:** ~2–4 hours/month
- **Who:** Treasurer, Legal
- **Systems:** Email, Bank portals, PDF docs
- **Sub-workflows:** None

### 8. Payment Format & SWIFT Compliance `[m8]`
- **Category:** Payment Operations
- **Time:** ~1–3 hours/month
- **Who:** Treasury Analyst, IT
- **Systems:** ERP, SWIFT, Bank connectivity
- **Sub-workflows:** None

### 9. Bank Signatory Rights Management `[e1]` — *Gap*
- **Category:** Bank Account Management (EBAM)
- **Time:** ~2–4 hours/month
- **Who:** Treasurer, Legal
- **Systems:** Bank portals, Excel, HR system
- **Sub-workflows:**
  - `[e1s1]` Identity Verification per Bank
  - `[e1s2]` Delegation of Authority Matrix Update

### 10. Trapped Cash Monitoring & Mobilization `[cb1]` — *Gap*
- **Category:** Cross-Border Cash Management
- **Time:** ~4–6 hours/month
- **Who:** Treasurer, Tax
- **Systems:** TMS, Excel, Bank portals
- **Sub-workflows:**
  - `[cb1s1]` Thin Capitalization Rule Tracking
  - `[cb1s2]` Currency Depreciation Risk Monitoring

### 11. Commodity Exposure Assessment & Hedging `[cm1]` — *Gap*
- **Category:** Commodity Risk
- **Time:** ~3–5 hours/month
- **Who:** Treasurer, FP&A
- **Systems:** ETRM platform, Excel, Bloomberg
- **Sub-workflows:**
  - `[cm1s1]` Non-Hedgeable Commodity Strategy
  - `[cm1s2]` ETRM Platform Management

### 12. Energy Procurement & Budget Variance `[cm2]` — *Gap*
- **Category:** Commodity Risk
- **Time:** ~2–3 hours/month
- **Who:** Treasury Analyst, FP&A
- **Systems:** Excel, Utility platforms
- **Sub-workflows:** None

### 13. Working Capital Dashboard & KPI Tracking `[sc3]` — *Gap*
- **Category:** Supply Chain Finance
- **Time:** ~2–3 hours/month
- **Who:** Treasurer, FP&A
- **Systems:** ERP, Excel, BI tools
- **Sub-workflows:** None

### 14. Fraud Incident Response & Reporting `[f4]` — *Gap*
- **Category:** Fraud Prevention
- **Time:** ~2–4 hours/month review
- **Who:** Treasurer, Legal
- **Systems:** Bank portals, Email, Case management
- **Sub-workflows:** None

### 15. Treasury Controls Attestation & Evidence Packs `[c1]` — *Gap*
- **Category:** SOX Compliance & Controls
- **Time:** ~4–8 hours/month
- **Who:** Treasurer, Controller
- **Systems:** GRC platform, Excel, Email
- **Sub-workflows:**
  - `[c1s1]` Multi-Level Approval Documentation
  - `[c1s2]` Change Log Compilation

### 16. In-House Bank Administration `[ih2]` — *Gap*
- **Category:** Shared Services & In-House Bank
- **Time:** ~4–6 hours/month
- **Who:** Treasury Analyst, Controller
- **Systems:** TMS / IHB module, ERP
- **Sub-workflows:**
  - `[ih2s1]` Transfer Pricing Compliance
  - `[ih2s2]` Virtual Account Reconciliation

---

## Quarterly — "Calendar Quarter-End + Board Cycle" (18 workflows)

### 1. Covenant Compliance Testing `[q1]`
- **Category:** Risk & Compliance
- **Time:** ~4–8 hours/quarter
- **Who:** Treasurer, Controller
- **Systems:** Excel, ERP, Loan agreements (PDF)
- **Sub-workflows:**
  - `[q1s1]` Headroom Analysis & Early Warning
  - `[q1s2]` Sensitivity & Scenario Analysis
  - `[q1s3]` Compliance Certificate Preparation

### 2. Hedge Effectiveness Testing `[q2]`
- **Category:** FX Management
- **Time:** ~4–8 hours/quarter
- **Who:** Treasurer, Controller
- **Systems:** Excel, Bloomberg (if available)
- **Sub-workflows:** None

### 3. Board / Executive Treasury Report `[q3]`
- **Category:** Reporting & Analysis
- **Time:** ~6–10 hours/quarter
- **Who:** Treasurer
- **Systems:** Excel, PowerPoint
- **Sub-workflows:** None

### 4. Banking Relationship Review `[q4]`
- **Category:** Bank Relationship Management
- **Time:** ~2–4 hours/quarter
- **Who:** Treasurer
- **Systems:** Excel, Bank portals
- **Sub-workflows:** None

### 5. Investment Policy Compliance `[q5]`
- **Category:** Risk & Compliance
- **Time:** ~2–3 hours/quarter
- **Who:** Treasurer
- **Systems:** Excel, Custodian reports
- **Sub-workflows:** None

### 6. External Audit Support `[q6]`
- **Category:** Reporting & Analysis
- **Time:** ~10–20 hours/quarter
- **Who:** Treasury Analyst, Treasurer, Controller
- **Systems:** Excel, ERP, Email
- **Sub-workflows:** None

### 7. Counterparty Risk Deep Review `[q7]`
- **Category:** Risk & Compliance
- **Time:** ~2–4 hours/quarter
- **Who:** Treasurer
- **Systems:** Excel, Credit reports, Bloomberg
- **Sub-workflows:** None

### 8. Bank Account Management `[q8]`
- **Category:** Bank Relationship Management
- **Time:** ~2–4 hours/quarter
- **Who:** Treasurer, Legal
- **Systems:** Excel, Bank portals, Board resolutions
- **Sub-workflows:** None

### 9. Segregation of Duties Testing `[c2]` — *Gap*
- **Category:** SOX Compliance & Controls
- **Time:** ~4–6 hours/quarter
- **Who:** Treasurer, Controller
- **Systems:** GRC platform, Bank portals, TMS
- **Sub-workflows:**
  - `[c2s1]` Break-Glass Access Review
  - `[c2s2]` Override Documentation

### 10. User Access Review (Bank Portals & TMS) `[c3]` — *Gap*
- **Category:** SOX Compliance & Controls
- **Time:** ~3–5 hours/quarter
- **Who:** Treasurer, IT
- **Systems:** Bank portals, TMS, ERP, HR system
- **Sub-workflows:** None

### 11. Bank Mandate & Documentation Registry `[e3]` — *Gap*
- **Category:** Bank Account Management (EBAM)
- **Time:** ~2–3 hours/quarter
- **Who:** Treasurer, Legal
- **Systems:** Excel / Document management, Bank portals
- **Sub-workflows:** None

### 12. Swap Portfolio Management & Valuation `[ir2]` — *Gap*
- **Category:** Interest Rate Risk
- **Time:** ~4–6 hours/quarter
- **Who:** Treasurer, Controller
- **Systems:** TMS, Excel, Bloomberg
- **Sub-workflows:**
  - `[ir2s1]` Hedge Effectiveness Testing (IR)
  - `[ir2s2]` ISDA Agreement Management

### 13. Debt Portfolio Restructuring Analysis `[ir3]` — *Gap*
- **Category:** Interest Rate Risk
- **Time:** ~4–8 hours/quarter
- **Who:** Treasurer, FP&A
- **Systems:** Excel, Bloomberg
- **Sub-workflows:** None

### 14. Green Bond / Sustainability-Linked Instrument Compliance `[esg1]` — *Gap*
- **Category:** ESG / Sustainability
- **Time:** ~8–16 hours/quarter
- **Who:** Treasurer, Legal
- **Systems:** Excel, ESG reporting platform
- **Sub-workflows:**
  - `[esg1s1]` External Assurance Coordination
  - `[esg1s2]` ICMA Alignment Documentation

### 15. Cross-Border Cash Repatriation Planning `[cb2]` — *Gap*
- **Category:** Cross-Border Cash Management
- **Time:** ~3–5 hours/quarter
- **Who:** Treasurer, Tax, Legal
- **Systems:** Excel, Tax software
- **Sub-workflows:**
  - `[cb2s1]` Section 245A DRD Analysis
  - `[cb2s2]` Transfer Pricing Documentation

### 16. Intercompany Financing Compliance `[cb3]` — *Gap*
- **Category:** Cross-Border Cash Management
- **Time:** ~6–10 hours/quarter
- **Who:** Treasurer, Tax
- **Systems:** Excel, TMS, Tax software
- **Sub-workflows:** None

### 17. Open Banking & Fintech Integration Review `[rt3]` — *Gap*
- **Category:** Real-Time Treasury
- **Time:** ~4–6 hours/quarter
- **Who:** Treasurer, IT
- **Systems:** TMS, API platforms
- **Sub-workflows:** None

### 18. Shared Services Performance & Optimization `[ih3]` — *Gap*
- **Category:** Shared Services & In-House Bank
- **Time:** ~6–10 hours/quarter
- **Who:** Treasurer, Controller
- **Systems:** TMS, ERP, BI tools
- **Sub-workflows:** None

---

## Annual — "Year-End & Strategic Planning" (20 workflows)

### 1. Capital Structure Planning `[a1]`
- **Category:** Strategic Planning
- **Time:** ~20–40 hours/year
- **Who:** Treasurer, FP&A
- **Systems:** Excel, PowerPoint
- **Sub-workflows:**
  - `[a1s1]` Debt Maturity & Refinancing Analysis
  - `[a1s2]` WACC & Cost of Capital Optimization

### 2. Credit Facility Renewal / Amendment `[a2]`
- **Category:** Bank Relationship Management
- **Time:** ~40–80 hours/year
- **Who:** Treasurer, Legal
- **Systems:** Excel, Email, Legal docs
- **Sub-workflows:** None

### 3. Annual Budget & Treasury Plan `[a3]`
- **Category:** Strategic Planning
- **Time:** ~20–40 hours/year
- **Who:** Treasurer, FP&A
- **Systems:** Excel, PowerPoint
- **Sub-workflows:** None

### 4. Credit Rating Management `[a4]`
- **Category:** Strategic Planning
- **Time:** ~20–40 hours/year
- **Who:** Treasurer
- **Systems:** Excel, Rating agency portals, PowerPoint
- **Sub-workflows:** None

### 5. Insurance & Surety Bond Management `[a5]`
- **Category:** Strategic Planning
- **Time:** ~10–20 hours/year
- **Who:** Treasurer, Legal
- **Systems:** Excel, Broker portals
- **Sub-workflows:** None

### 6. Treasury Policy Review & Update `[a6]`
- **Category:** Strategic Planning
- **Time:** ~10–20 hours/year
- **Who:** Treasurer, Legal
- **Systems:** Word/PDF
- **Sub-workflows:** None

### 7. Tax Planning & Cross-Border Compliance `[a7]`
- **Category:** Strategic Planning
- **Time:** ~20–40 hours/year
- **Who:** Treasurer, Tax
- **Systems:** Excel, Tax software
- **Sub-workflows:** None

### 8. Bank Relationship Strategy & RFP `[a8]`
- **Category:** Bank Relationship Management
- **Time:** ~20–40 hours/year
- **Who:** Treasurer
- **Systems:** Excel, PowerPoint, RFP templates
- **Sub-workflows:** None

### 9. Bank Account Opening & Closing `[e2]` — *Gap*
- **Category:** Bank Account Management (EBAM)
- **Time:** ~4–8 hours per event
- **Who:** Treasurer, Legal
- **Systems:** Bank portals, Excel, Board resolutions
- **Sub-workflows:** None

### 10. Bank Account Rationalization `[e4]` — *Gap*
- **Category:** Bank Account Management (EBAM)
- **Time:** ~8–16 hours/year
- **Who:** Treasurer
- **Systems:** Excel, Bank portals
- **Sub-workflows:**
  - `[e4s1]` Fee Impact Analysis
  - `[e4s2]` Virtual Account Opportunity Assessment

### 11. ESG-Linked Financing Decision Framework `[esg2]` — *Gap*
- **Category:** ESG / Sustainability
- **Time:** ~2–4 weeks per issuance evaluation
- **Who:** Treasurer, FP&A
- **Systems:** Excel, ESG reporting platform
- **Sub-workflows:** None

### 12. ESG Treasury Portfolio Reporting `[esg3]` — *Gap*
- **Category:** ESG / Sustainability
- **Time:** ~6–10 hours/year
- **Who:** Treasurer
- **Systems:** Excel, ESG reporting platform
- **Sub-workflows:** None

### 13. M&A Day 1 Integration Readiness `[ma1]` — *Gap*
- **Category:** M&A Integration
- **Time:** ~40–100 hours per deal
- **Who:** Treasurer, Controller, IT
- **Systems:** TMS, Bank portals, ERP
- **Sub-workflows:**
  - `[ma1s1]` TSA Item Identification
  - `[ma1s2]` Temporary Funding Sources

### 14. Bank Account & System Migration `[ma2]` — *Gap*
- **Category:** M&A Integration
- **Time:** ~100–200 hours over 6–12 months
- **Who:** Treasurer, IT
- **Systems:** TMS, ERP, Bank portals
- **Sub-workflows:** None

### 15. Post-Integration Optimization `[ma3]` — *Gap*
- **Category:** M&A Integration
- **Time:** ~ongoing through year 2
- **Who:** Treasurer, Controller
- **Systems:** TMS, ERP
- **Sub-workflows:** None

### 16. Treasury BCP Development & Maintenance `[bc1]` — *Gap*
- **Category:** Business Continuity
- **Time:** ~4–8 hours/semi-annually
- **Who:** Treasurer, IT
- **Systems:** BCP documentation, Bank portals
- **Sub-workflows:**
  - `[bc1s1]` Pre-Arranged Credit Line Verification
  - `[bc1s2]` Remote Access Testing

### 17. BCP Testing & Tabletop Exercises `[bc2]` — *Gap*
- **Category:** Business Continuity
- **Time:** ~4–8 hours/semi-annually
- **Who:** Treasurer, Treasury Analyst, IT
- **Systems:** BCP documentation, Bank portals
- **Sub-workflows:** None

### 18. Crisis Cash Management Protocol `[bc3]` — *Gap*
- **Category:** Business Continuity
- **Time:** ~8–12 hours/year to maintain
- **Who:** Treasurer
- **Systems:** BCP documentation, Excel
- **Sub-workflows:** None

### 19. Real-Time Payment Operations `[rt2]` — *Gap*
- **Category:** Real-Time Treasury
- **Time:** ~ongoing (setup: 4–8 weeks per rail)
- **Who:** Treasury Analyst, IT
- **Systems:** TMS, Payment gateway, Bank APIs
- **Sub-workflows:** None

### 20. Commodity Mark-to-Market & Valuation `[cm3]` — *Gap*
- **Category:** Commodity Risk
- **Time:** ~4–6 hours/quarter
- **Who:** Treasurer, Controller
- **Systems:** ETRM platform, Excel, Bloomberg
- **Sub-workflows:** None
