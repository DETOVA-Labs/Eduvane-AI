# Eduvane AI — Compliance & Success Tracker

**Document Status:** Active
**Enforcement Level:** Mandatory
**Target Audience:** Core Engineering, AI Assistants, Auditors

---

## 1. Purpose

This document serves as the operational source of truth for the **Eduvane AI Active System Foundation**. It is designed to:
1.  **Prevent Architectural Drift:** Ensure no intelligence logic leaks into the Presentation or Transport layers.
2.  **Enforce Separation of Concerns:** Validate that reasoning authority remains exclusively within the AI Engine.
3.  **Track MVP Readiness:** Provide a granular checklist for system completion without compromising architectural integrity.

**Rule Zero:** If a feature requires the TypeScript layer to "think" or "interpret," it is a compliance violation. Stop and move the logic to the Python AI Engine.

---

## 2. Layer Definitions & Compliance Boundaries

### A. Presentation Layer (Frontend)
*   **Tech Stack:** React, TypeScript, Tailwind CSS
*   **Role:** Dumb Terminal (Render Stream / Capture Input)

| Compliance Check | Requirement | Verification Method |
| :--- | :--- | :--- |
| **MUST** | Render opaque data streams from Backend exactly as received. | Visual Inspection |
| **MUST** | Handle file encoding and upload to Gateway. | Unit Test |
| **MUST** | Display explicit error states if the Engine is unreachable. | Chaos Testing |
| **MUST NOT** | Infer user intent (e.g., "Is this a math question?"). | Code Review |
| **MUST NOT** | Generate temporary or "fake" responses while loading. | Code Review |
| **MUST NOT** | Parse response text to trigger UI logic (use structured flags instead). | Code Review |

### B. Transport & Control Layer (Backend Gateway)
*   **Tech Stack:** Node.js, TypeScript
*   **Role:** Secure Router (Identity <-> Engine Pipe)

| Compliance Check | Requirement | Verification Method |
| :--- | :--- | :--- |
| **MUST** | Hydrate user identity (Role, Name, ID) and attach to context. | Session Logs |
| **MUST** | Validate `UnifiedInput` schema integrity. | Schema Validation Tests |
| **MUST** | Forward requests verbatim to the AI Engine interface. | Traffic Analysis |
| **MUST NOT** | construct prompts or system instructions. | Code Search (`grep`) |
| **MUST NOT** | Call LLM APIs directly (e.g., `genai.generateContent`). | Dependency Check |
| **MUST NOT** | Implement fallback logic (e.g., "If Engine fails, say hello"). | Logic Inspection |

### C. Intelligence Layer (AI Engine)
*   **Tech Stack:** Python (External Service)
*   **Role:** The Brain (Reasoning, Orchestration, Generation)

| Compliance Check | Requirement | Verification Method |
| :--- | :--- | :--- |
| **MUST** | Own the Perception -> Interpretation -> Reasoning pipeline. | Architecture Diagram |
| **MUST** | Select models and orchestration strategies dynamically. | Engine Logs |
| **MUST** | Generate all user-facing text and structured data. | Output Audit |
| **MUST NOT** | Be bypassed by "fast path" logic in the Gateway. | Route Audit |

### D. Model & ML Services
*   **Tech Stack:** Gemini, Veo, Custom Models
*   **Role:** Tools (Execution Only)

| Compliance Check | Requirement | Verification Method |
| :--- | :--- | :--- |
| **MUST** | Be invoked only by the AI Engine. | Access Logs |
| **MUST NOT** | Be treated as the "Brain" (Models do not decide; the Engine decides). | Architecture Review |

---

## 3. Daily Developer Compliance Checklist

Before committing code, every contributor (Human or AI) must verify:

- [ ] **No Local Reasoning:** I have not added `if (input.contains("hello"))` or similar logic to the Frontend or Gateway.
- [ ] **No Direct Model Calls:** I have verified that `GeminiService` (TS) is dead/neutralized and not being imported.
- [ ] **Fail Loudly:** If the AI Engine is disconnected, the system displays a clear error, not a fallback simulation.
- [ ] **Schema Purity:** Any new data requirement is added to the `AIContext` or `UnifiedInput` schema, not handled via side-channels.
- [ ] **State Agnosticism:** The Frontend waits for `PHASE_UPDATE` events to change state, rather than guessing based on time elapsed.

---

## 4. Success Metrics Tracker

Use this section to track the operational readiness of the system components.

### Frontend / UX Readiness
| Feature | Status | Compliance Note |
| :--- | :---: | :--- |
| File Upload (Image/PDF) | ✅ | Must treat file as opaque binary blob. |
| Streaming Text Render | ✅ | Must handle markdown/LaTeX without interpreting semantics. |
| Structured Analysis Cards | ✅ | Renders JSON output from Engine blindly. |
| Error State Handling | ✅ | Displays backend error messages raw/formatted. |
| Chat History View | ✅ | Fetches storage without inferring topic relevance. |

### Backend Transport Integrity
| Feature | Status | Compliance Note |
| :--- | :---: | :--- |
| User Profile Hydration | ✅ | Attaches role to `AIContext` before Engine call. |
| Session Management | ✅ | Manages `submissionId` but does not read content. |
| AI Engine Interface | ⬜ | Currently a stub. Must be replaced by HTTP/gRPC client. |
| History Persistence | ✅ | Stores opaque blobs. No indexing based on content analysis. |

### System Integration
| Feature | Status | Compliance Note |
| :--- | :---: | :--- |
| End-to-End Latency | ⬜ | Pending Python Engine connection. |
| Multi-Modal Pipeline | ⬜ | Pending Python Engine connection. |
| Fail-Safe Behavior | ✅ | System correctly identifies "Engine Unavailable" and stops. |

*(Legend: ✅ = Compliant & Ready, ⚠️ = Partial/Risk, ⬜ = Pending Implementation, ❌ = Violation)*

---

## 5. Operational Rules

1.  **The "No Simulation" Rule:**
    Do not simulate intelligence to make the demo "look better." If the AI Engine isn't ready, the UI should show a "Service Offline" or "Engine Disconnected" state. Simulation creates technical debt and architectural lies.

2.  **Architectural PRs:**
    Any Pull Request that adds a library like `langchain-js` or direct model SDKs to the `package.json` of the frontend/backend will be automatically rejected.

3.  **Orchestration Authority:**
    The Frontend never decides "Next, I need to generate questions." The Frontend sends the user's request. The **AI Engine** decides "The user wants questions, therefore I will generate questions."

---

## 6. Future-Proofing

As Eduvane evolves, adhere to these principles:

*   **New Models:** Adding GPT-4, Claude, or local LLaMA models happens **inside** the Python AI Engine. The TypeScript layers remain unchanged.
*   **New Modalities:** If we add Audio input, the Frontend captures the buffer and sends it. The Backend pipes it. The Python Engine processes it.
*   **Orchestration Complexity:** If the workflow changes from "Linear" to "Tree-of-Thoughts," this logic changes **only** in Python. The Frontend continues to render the stream it is given.

---

## 7. Developer Sign-Off

*By working on this repository, I acknowledge that strict separation of concerns is the primary success metric. I will not implement reasoning logic in the presentation or transport layers.*

**Signed:** __________________________ (Developer Name / AI Agent ID)
