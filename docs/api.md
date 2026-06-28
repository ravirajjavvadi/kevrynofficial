# KarsaTek OS - API Endpoint Specifications

This document outlines the API specifications for the serverless backend routes in **KarsaTek OS (HireOS)**.

---

## 1. POST `/api/analyze`
Processes candidate resume files and extracts metadata.

### Request Body
Multipart FormData containing:
- `file`: PDF file blob
- `role`: Target role name (e.g. `frontend-architect`)
- `extractedText` (Optional): Pre-extracted plain text parsed client-side.

### Response (200 OK)
```json
{
  "mastery_index": 85,
  "verdict": "APPROVED" | "HOLD" | "DECLINED",
  "extracted_skills": ["TypeScript", "Next.js", "TailwindCSS"],
  "experience_summary": "5+ years building highly optimized web interfaces.",
  "match_reason": "Strong alignment with architectural design systems.",
  "recommendation": "Initiate secure proctoring test immediately."
}
```

---

## 2. POST `/api/evaluate-test`
Grades the proctored multiple-choice test.

### Request Body (JSON)
```json
{
  "id": "intern_mongodb_id",
  "answers": {
    "question_id_1": 2,
    "question_id_2": 0
  },
  "strikes": 0
}
```

### Response (200 OK)
```json
{
  "success": true,
  "score": 80,
  "verdict": "ADMITTED" | "HOLD" | "REJECTED",
  "summary": "Candidate passed the minimum verification bar.",
  "internId": "intern_mongodb_id"
}
```

---

## 3. POST `/api/interview/chat`
Manages the adaptive AI interview debate session.

### Request Body (JSON)
```json
{
  "id": "intern_mongodb_id",
  "history": [
    { "role": "assistant", "content": "Welcome. Let's talk about performance optimization in React." },
    { "role": "user", "content": "Sure, we can use useMemo and virtualization." }
  ],
  "currentResponse": "Virtualization prevents excessive DOM node painting.",
  "role": "frontend-architect",
  "name": "Candidate Name"
}
```

### Response (200 OK)
```json
{
  "question": "Excellent point. But how do you handle dynamic heights inside your virtualized lists?"
}
```

---

## 4. POST `/api/interview/submit`
Submits the final interview transcript and runs proctoring/simulation pipelines.

### Request Body (JSON)
```json
{
  "id": "intern_mongodb_id",
  "history": [...],
  "strikes": 0
}
```

### Response (200 OK)
```json
{
  "success": true,
  "evaluation": {
    "hiringRecommendation": "RECOMMENDED",
    "hiringConfidence": 92,
    "explainableReasoning": "...",
    "scores": { ... }
  },
  "simulation": {
    "teamCompatibility": 90,
    "successProbability": 95,
    "burnoutRisk": 15
  }
}
```
