# EDUVANE AI — ARCHITECTURAL DECLARATION

**Status:** Active System Foundation (Pure Transport)
**Intelligence Authority:** Python AI Engine (Pending Connection)

## Core Doctrine

1.  **No Intelligence in TypeScript**
    The Frontend (React) and Backend Gateway (Node/TS) are strictly prohibited from performing reasoning, interpretation, prompt construction, or decision making. They exist solely to capture input, manage identity, and render opaque outputs.

2.  **Authoritative Python Engine**
    All AI logic, prompts, heuristics, and model interactions live exclusively within the Python AI Engine service. 

3.  **Explicit Failure State**
    If the Python Engine is unavailable, the system must fail explicitly. It may not fall back to simple rules, mock responses, or temporary client-side model calls.

## Layer Responsibilities

### Frontend (Presentation)
*   **Role:** Dumb Terminal.
*   **Responsibilities:** Render streams, handle file uploads, display error states.
*   **Prohibitions:** No "Thinking" UI states unless triggered by Backend events. No inspection of payload content.

### Backend Gateway (Transport)
*   **Role:** Router & Session Manager.
*   **Responsibilities:** Hydrate User Context, validate schemas, pipe data to/from AI Engine.
*   **Prohibitions:** No Prompt Engineering. No Intent Routing. No Default Replies.

### AI Engine (Intelligence)
*   **Role:** The Brain.
*   **Responsibilities:** Perception, Interpretation, Reasoning, Response Generation.
*   **Location:** External Service (Python).

---

*This codebase has been cleansed to conform to these standards. Any re-introduction of logic into `services/geminiService.ts` or `constants.ts` is a violation of the architecture.*
