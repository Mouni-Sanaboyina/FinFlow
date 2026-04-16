# FinFlow — AI Loan Sales Assistant
# Banking · Lending & Credit

A multi-agent AI-powered loan sales assistant built for NBFCs. Uses Claude claude-sonnet-4-20250514 as the AI backbone with a 5-agent orchestration system.

---

## Architecture

```
User ──► Master Orchestrator Agent
              │
    ┌─────────┼──────────────────────┐
    ▼         ▼          ▼           ▼           ▼
 Sales    Verification  Underwriting  Explanation  Sanction
 Agent      Agent        Agent         Agent        Agent
```

## Agent Roles

| Agent | Role |
|-------|------|
| **Master Agent** | Orchestrates flow, decides next agent |
| **Sales Agent** | Gathers loan requirements conversationally |
| **Verification Agent** | DPDP consent + PAN KYC validation |
| **Underwriting Agent** | Credit score simulation + approval decision + confidence score |
| **Explanation Agent** | Plain-language explanation of underwriting decision |
| **Sanction Agent** | Generates formal bank-style sanction letter |

## Tech Stack

- **Frontend**: React 18, Axios, React Markdown
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude claude-sonnet-4-20250514 (via @anthropic-ai/sdk)
- **State**: In-memory session store

## Setup

### 1. Clone & Install

```bash
git clone <repo>
cd loan-sales-assistant
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

### 3. Run Development

```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

App runs at: http://localhost:3000  
API runs at: http://localhost:5000

## Loan Journey Flow

```
Greeting → Requirement Gathering → KYC/PAN Verification
        → Underwriting → Decision → Sanction Letter
```

## Key Features

- ✅ Multi-agent orchestration with smooth handoffs
- ✅ PAN format validation (ABCDE1234F)
- ✅ DPDP Act 2023 consent flow
- ✅ Credit score simulation (300–900)
- ✅ Confidence score (0–100%) on decisions
- ✅ EMI calculator (24/36/48 months)
- ✅ Professional sanction letter generation
- ✅ Real-time loan journey progress tracker
- ✅ Dark-themed luxury fintech UI

