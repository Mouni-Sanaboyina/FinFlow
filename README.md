# FinFlow — AI Loan Sales Assistant

A full-stack AI-powered lending assistant that automates the complete loan onboarding and underwriting journey through a multi-agent architecture. FinFlow enables customers to apply for loans conversationally while specialized AI agents handle requirement gathering, verification, underwriting, decision explanation, and sanction letter generation.

🌐 **Live Website:** https://fin-flow-ruddy.vercel.app

⚙️ **Backend API:** https://finflow-production-0ead.up.railway.app

📦 **Repository:** https://github.com/Mouni-Sanaboyina/FinFlow

---

# Table of Contents

* Overview
* Features
* Technology Stack
* Multi-Agent Architecture
* Loan Journey
* Project Structure
* Getting Started
* Environment Variables
* Deployment
* API Endpoints
* Screenshots
* Key Highlights
* Future Enhancements
* Author

---

# Overview

FinFlow is an AI-powered loan sales assistant built for NBFCs, fintech companies, and digital lending platforms.

The platform simulates a real-world lending workflow where multiple specialized AI agents collaborate under a central orchestrator to guide customers through the loan application process.

From collecting customer requirements and verifying PAN details to performing underwriting assessments and generating sanction letters, FinFlow provides an end-to-end digital lending experience.

The system demonstrates how modern financial institutions can leverage AI-driven workflows to improve efficiency, consistency, and customer experience.

---

# Features

## Customer Features

* Conversational loan application process
* AI-guided onboarding experience
* Requirement gathering through chat
* PAN verification workflow
* DPDP consent collection
* Real-time loan journey tracking
* Underwriting assessment
* Loan approval/rejection explanation
* Automated sanction letter generation
* Session continuity across interactions

---

## AI Agent Features

### Master Agent

* Controls workflow orchestration
* Coordinates communication between agents
* Maintains conversation state
* Determines next workflow step

### Sales Agent

* Collects customer details
* Captures loan requirements
* Gathers employment information
* Records financial details

### Verification Agent

* PAN format validation
* Identity verification workflow
* Consent collection
* KYC progression management

### Underwriting Agent

* Simulated credit score generation
* Risk assessment
* Eligibility evaluation
* Loan approval/rejection decisions
* Confidence score generation
* Interest rate recommendation
* Loan-to-income analysis

### Explanation Agent

* Explains underwriting outcomes
* Provides customer-friendly decision summaries
* Improves transparency of lending decisions

### Sanction Agent

* Generates professional sanction letters
* Creates structured approval documentation
* Summarizes loan terms and conditions

---

# Technology Stack

## Frontend

* React 18
* Axios
* React Markdown
* CSS3

## Backend

* Node.js
* Express.js

## AI Layer

* Azure AI Foundry
* GPT-4.1-mini
* Multi-Agent Architecture

## State Management

* In-Memory Session Store
* UUID Session Tracking

## Deployment

* Railway (Backend)
* Vercel (Frontend)

---

# Multi-Agent Architecture

```text
Customer

↓

Master Orchestrator Agent

├── Sales Agent
├── Verification Agent
├── Underwriting Agent
├── Explanation Agent
└── Sanction Agent
```

### Agent Workflow

```text
User Input

↓

Master Agent

↓

Sales Agent

↓

Verification Agent

↓

Underwriting Agent

↓

Explanation Agent

↓

Sanction Agent
```

---

# Loan Journey

```text
Welcome

↓

Requirement Gathering

↓

KYC Verification

↓

Underwriting Assessment

↓

Decision Explanation

↓

Loan Sanction
```

---

# System Architecture

```text
React Frontend

↓

Axios API Calls

↓

Express Backend

↓

Master Agent

↓

Specialized AI Agents

↓

Azure AI Foundry GPT-4.1-mini

↓

Structured Loan Decisions
```

---

# Project Structure

```text
FinFlow
│
├── client
│   ├── public
│   │
│   └── src
│       ├── components
│       │   ├── AgentBadge.jsx
│       │   ├── ChatWindow.jsx
│       │   ├── LoanDataPanel.jsx
│       │   ├── LoanJourneyTracker.jsx
│       │   ├── MessageBubble.jsx
│       │   └── SanctionLetterModal.jsx
│       │
│       ├── context
│       │   └── LoanContext.jsx
│       │
│       ├── hooks
│       │   └── useChat.js
│       │
│       ├── services
│       └── App.jsx
│
├── server
│   ├── agents
│   │   ├── masterAgent.js
│   │   ├── salesAgent.js
│   │   ├── verificationAgent.js
│   │   ├── underwritingAgent.js
│   │   ├── explanationAgent.js
│   │   └── sanctionAgent.js
│   │
│   ├── middleware
│   │   └── sessionStore.js
│   │
│   ├── routes
│   │   └── chat.js
│   │
│   ├── utils
│   │   ├── geminiClient.js
│   │   ├── emiCalculator.js
│   │   └── panValidator.js
│   │
│   └── index.js
│
├── README.md
├── package.json
└── .env.example
```

---

# Getting Started

## Prerequisites

* Node.js 18+
* Azure AI Foundry Account
* Git

---

## Clone Repository

```bash
git clone https://github.com/Mouni-Sanaboyina/FinFlow.git

cd FinFlow
```

---

# Backend Setup

```bash
cd server

npm install
```

Create `.env`

```env
AZURE_OPENAI_API_KEY=your_api_key

AZURE_OPENAI_ENDPOINT=https://your-resource.services.ai.azure.com/openai/v1

AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini

PORT=5000
```

Run Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client

npm install
```

Start Development Server

```bash
npm start
```

---

# Application URLs

Development

```text
Frontend: http://localhost:3000

Backend : http://localhost:5000
```

Production

```text
Frontend: https://fin-flow-ruddy.vercel.app

Backend : https://finflow-production-0ead.up.railway.app
```

---

# Deployment

## Frontend

Hosted on Vercel

```text
https://fin-flow-ruddy.vercel.app
```

---

## Backend

Hosted on Railway

```text
https://finflow-production-0ead.up.railway.app
```

---

# API Endpoints

## Start New Loan Session

```http
POST /api/chat/start
```

Initializes a new loan application session and returns a greeting message.

---

## Continue Conversation

```http
POST /api/chat
```

Processes customer messages through the multi-agent workflow.

---

## Retrieve Session

```http
GET /api/chat/session/:sessionId
```

Returns the current loan application state and conversation history.

---

## Health Check

```http
GET /api/health
```

Returns API service status.

---

# Screenshots

## Loan Journey Tracker

![Loan Journey](./README-assets/journey-tracker.png)

## Requirement Gathering

![Requirements](./README-assets/requirements.png)

## KYC Verification

![KYC](./README-assets/kyc.png)

## Underwriting Assessment

![Underwriting](./README-assets/underwriting.png)

## Decision Explanation

![Decision](./README-assets/decision.png)

## Loan Sanction Letter

![Sanction](./README-assets/sanction.png)

---

# Key Highlights

✔ Multi-Agent AI Architecture

✔ Azure AI Foundry Integration

✔ GPT-4.1-mini Powered Lending Workflow

✔ AI Underwriting Engine

✔ Credit Score Simulation

✔ Risk Assessment & Confidence Scoring

✔ Loan Decision Explainability

✔ Automated Sanction Letter Generation

✔ End-to-End Digital Lending Journey

✔ Full-Stack React & Node.js Application

---

# Future Enhancements

* Aadhaar Verification Integration
* Credit Bureau API Integration
* Banking Statement Analysis
* OCR-Based Document Verification
* Persistent Database Storage
* Retrieval-Augmented Generation (RAG)
* Loan Product Recommendation Engine
* Customer Dashboard
* Admin Dashboard
* Analytics & Reporting
* Multi-Language Support

---

# Author

**Mounika Sanaboyina**

B.Tech – Computer Science (AI & Data Science)

GitHub:

https://github.com/Mouni-Sanaboyina

Project:

https://fin-flow-ruddy.vercel.app

---

If you found this project useful, consider giving the repository a ⭐ on GitHub.
