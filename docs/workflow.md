# KarsaTek OS - Recruitment Workflow Lifecycle

This document outlines the end-to-end user and system lifecycle in **KarsaTek OS (HireOS)**.

---

## 1. Application & Resume Screening
1.  **Candidate Access**: The candidate enters `/careers` or `/apply?role=role-name`.
2.  **Form Submission**: Enters name, email, socials, and uploads their PDF resume.
3.  **PDF Extraction**: The frontend runs `extractTextFromPdfClient`. The extracted text is attached to the form data as `extractedText`.
4.  **Backend Processing**: `/api/analyze` parses the text (falling back to server-side static PDFJS or plain-text regex extraction if empty). 
5.  **Dossier Generation**: The AI (Groq Llama-3-70b) evaluates skills and experience and creates the initial profile database entry with status `APPLIED`.

---

## 2. Secure Proctoring & Technical Test
1.  **Test Start**: The candidate initiates the test.
2.  **Fullscreen Lock**: The proctoring system intercepts the screen and triggers `requestFullscreen()`.
3.  **Strict Anti-Cheat Monitoring**:
    *   If the candidate exits fullscreen (`document.fullscreenElement === null`), the UI freezes immediately.
    *   If they switch tabs or minimize the browser, a visibility-change strike is registered.
    *   Candidate must click "Enter Secure Arena" to unlock.
4.  **Test Evaluation**: Upon submission, `/api/evaluate-test` grades the answers and updates the database record with score and status `TESTED`.

---

## 3. Adaptive AI Interview (Dialogue & Debate)
1.  **Hardware Check**: The candidate completes camera and microphone checks.
2.  **Interview Initiation**: Clicking "Start Interview" locks the browser back into fullscreen mode and triggers `/api/interview/chat`.
3.  **Debate Dialogue**: The AI (Senior Engineering Manager persona) interviews the candidate, adjusting questions based on response depth and tech stack.
4.  **Submission & Telemetry**:
    *   On completion, the transcript is sent to `/api/interview/submit`.
    *   The AI calculates `hiringConfidence` and `burnoutRisk`, and runs a team compatibility simulation.
    *   Database entry status is set to `INTERVIEWED`.

---

## 4. Admin Dashboard Review & Onboarding
1.  **Admin Sign-in**: The administrator logs in using whitelisted email credentials.
2.  **Dossier Review**: Admin views detailed AI debate rationales, compatibility graphs, and proctoring log strikes in `/admin/interns/[id]`.
3.  **Approve/Decline**:
    *   Admin clicks **"Approve"**.
    *   `/api/admin/interns/[id]/approve` creates a workspace account, generates credentials, and dispatches the selection confirmation email via nodemailer SMTP.
