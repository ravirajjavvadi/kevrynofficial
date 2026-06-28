# KarsaTek HireOS - System Architecture

This document describes the technical architecture, databases, AI runtime configurations, model routing, and persistent memory layers of **KarsaTek HireOS**.

---

## Architectural Blueprint
KarsaTek HireOS is designed as a Next.js 16 monorepo deployed on Vercel's serverless environment, optimized to balance performance, cost, and proctoring security.

```
       [ Client Side ]                               [ Server Side (Vercel) ]
  ┌────────────────────────┐                        ┌────────────────────────┐
  │  • PDF.js Text Parser  │  ────── FormData ────> │  • /api/analyze        │
  │  • Fullscreen Proctor  │                        │  • /api/evaluate-test  │
  │  • Framer Motion UI    │  <───── JSON ─────────  │  • /api/interview/chat │
  └────────────────────────┘                        └────────────────────────┘
                                                                 │
                                                   cascadeflow Model Routing
                                                                 │
                                                       Llama Models (Groq)
                                                                 │
                                                                 ▼
                                                       Hindsight Memory (DB)
                                                                 │
                                                    ┌────────────────────────┐
                                                    │  • Nodemailer SMTP     │
                                                    │  • Clerk Auth          │
                                                    └────────────────────────┘
```

---

## Core Intelligence Infrastructure

### 1. cascadeflow Model Routing Layer
Instead of routing all LLM tasks to a single expensive model, KarsaTek HireOS implements `cascadeflow` runtime intelligence. Based on task complexity, the system routes requests as follows:

*   **Resume Extraction & Grading (Llama-3.1-8B)**: Handles basic pattern extraction and MCQ scoring.
*   **Active-Chat Debate Mode (Llama-3.3-70B)**: Powering the adaptive AI interviewer, requiring deep reasoning and logical counter-arguments.
*   **Predictive Simulation & Hindsight Processing (Llama-3.3-70B)**: Simulates candidate team-fit and compares their dossier against company records.

Every routing action logs token consumption and latencies, facilitating runtime analytics and cost metrics.

### 2. Hindsight Persistent Memory Layer
Hindsight serves as the system's organizational memory, linking candidate evaluation data to downstream employee performance:
- **Registry Ingestion**: Registers candidate profiles under the `interns` collection.
- **Transcript Archiving**: Stores complete multi-turn active chat logs and proctoring strikes.
- **Hindsight Calibration**: When a new candidate is evaluated, the system queries successful historical employees to calibrate the AI's selection recommendations.

---

## Database Schema (MongoDB Atlas)

The primary data entity is the Candidate dossier (represented in the `interns` collection):

```json
{
  "_id": "64f9f74...",
  "name": "Candidate Name",
  "email": "candidate@email.com",
  "role": "frontend-architect",
  "status": "APPLIED" | "TESTED" | "INTERVIEWED" | "APPROVED" | "REJECTED",
  "score": 85,
  "strikes": 0,
  "interviewStrikes": 1,
  "interviewTranscript": [
    { "role": "assistant", "content": "Welcome. Let's talk about performance optimization in React." },
    { "role": "user", "content": "Sure, we can use useMemo and virtualization." }
  ],
  "interviewEvaluation": {
    "hiringRecommendation": "RECOMMENDED",
    "hiringConfidence": 92,
    "explainableReasoning": "...",
    "scores": { ... }
  },
  "simulationData": {
    "teamCompatibility": 90,
    "successProbability": 95,
    "burnoutRisk": 15
  },
  "createdAt": "2026-06-28T18:00:00Z",
  "updatedAt": "2026-06-28T18:30:00Z"
}
```

---

## Network & Security Protocols
*   **Proctoring Control**: Utilizes HTML5 Fullscreen API to isolate the testing screen. Tab switching triggers visibility hooks on the browser thread.
*   **Clerk Gatekeeping**: Authenticates administrators (`ravirajjavvadhi@gmail.com` or `kevryntech@gmail.com`) to guard the `/admin` registry and prevent unauthorised selection approvals.
