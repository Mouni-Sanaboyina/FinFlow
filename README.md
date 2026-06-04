# FinFlow — AI Loan Sales Assistant

# Banking · Lending & Credit

FinFlow is a multi-agent AI-powered loan sales assistant designed for NBFCs and digital lending platforms. The system automates the complete lending journey, from requirement gathering and KYC verification to underwriting, decision explanation, and sanction letter generation.

Built using React, Node.js, Express, and Azure AI Foundry GPT-4.1-mini.

---

## Overview

FinFlow simulates how modern AI-powered lending systems can streamline customer onboarding and loan processing through specialized AI agents working together under a central orchestrator.

The application provides a conversational experience while maintaining structured workflows commonly used in banking and lending operations.

---

## Architecture

```text
User ──► Master Orchestrator Agent
              │
    ┌─────────┼──────────────────────┐
    ▼         ▼          ▼           ▼           ▼
 Sales    Verification  Underwriting  Explanation  Sanction
 Agent      Agent        Agent         Agent        Agent
```

---

## Agent Responsibilities

| Agent              | Responsibility                                      |
| ------------------ | --------------------------------------------------- |
| Master Agent       | Controls workflow and coordinates all agents        |
| Sales Agent        | Collects customer and loan requirements             |
| Verification Agent | Handles PAN validation and consent collection       |
| Underwriting Agent | Evaluates eligibility and generates risk assessment |
| Explanation Agent  | Explains decisions in customer-friendly language    |
| Sanction Agent     | Generates professional loan sanction letters        |

---

## Features

* Multi-agent AI orchestration
* Conversational loan application flow
* PAN card format validation
* DPDP consent workflow
* Credit score simulation
* Risk-based underwriting decisions
* Confidence score generation
* EMI calculation support
* Automated sanction letter creation
* Real-time loan journey tracking
* Modern fintech-style user interface

---

## Loan Journey

```text
Welcome
   ↓
Requirement Gathering
   ↓
PAN Verification
   ↓
Underwriting Assessment
   ↓
Decision Explanation
   ↓
Loan Sanction Letter
```

---

## Technology Stack

### Frontend

* React 18
* Axios
* React Markdown
* CSS3

### Backend

* Node.js
* Express.js

### AI Layer

* Azure AI Foundry
* GPT-4.1-mini
* Multi-Agent Architecture

### State Management

* In-Memory Session Store

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd loan-sales-assistant
npm run install:all
```

### Configure Environment

Create a `.env` file:

```env
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource.services.ai.azure.com/openai/v1
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini
PORT=5000
```

### Run Application

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev:client
```

Application URLs:

```text
Frontend: http://localhost:3000
Backend : http://localhost:5000
```

---

## Future Enhancements

* Aadhaar Verification Integration
* Credit Bureau API Integration
* Banking Statement Analysis
* OCR-Based Document Verification
* Loan Product Recommendation Engine
* Retrieval-Augmented Generation (RAG)
* Persistent Database Storage

---

## Author

**Mounika Sanaboyina**

Focused on AI Applications, Full-Stack Development, and Intelligent Multi-Agent Systems.
