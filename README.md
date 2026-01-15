# Eduvane AI

## Active System Foundation — Forward-Compatible Architecture

### What This Repository Is

Eduvane AI is a reasoning-first learning intelligence system.

This repository contains the **presentation and transport layers** of Eduvane, deliberately separated from its intelligence layer to ensure long-term governance, auditability, and correctness.

**Eduvane is not a chatbot.**
Eduvane is a reasoning system that produces language as output.

### Core Architectural Law (Read This First)

**All interpretation, reasoning, decision-making, and response construction belong exclusively to the Eduvane AI Engine (Python).**

**No other part of the system is allowed to “think”.**

If intelligence appears anywhere outside the Python AI Engine, it is a violation of this architecture.

### Permanent System Layers

Eduvane is composed of four permanent, non-overlapping layers:

#### 1. Presentation Layer (Frontend — React + TypeScript)

**Purpose:**
Display input and output. Nothing more.

**Allowed responsibilities:**
*   Render chat messages and streaming output
*   Capture user input and uploads
*   Manage UI state (loading, streaming, errors)
*   Display mathematical symbols and formatted content

**Strictly forbidden:**
*   Interpreting user intent
*   Detecting greetings vs academic input
*   Choosing response types
*   Deciding follow-up questions
*   Inferring meaning or context

**The frontend is a dumb terminal.**

#### 2. Transport & Control Layer (Backend Gateway — Node / TypeScript)

**Purpose:**
Securely move data and maintain sessions.

**Allowed responsibilities:**
*   Authentication and identity hydration
*   Session and workspace continuity
*   Request validation and normalization
*   Streaming relay between frontend and AI Engine

**Strictly forbidden:**
*   Prompt engineering
*   Reasoning logic
*   Model calls
*   Default or fallback replies
*   Orchestration decisions

**The backend passes context, not conclusions.**

#### 3. Eduvane AI Engine (Python — Authoritative Intelligence)

**Status:**
Not implemented in this repository.

**Role:**
The AI Engine is the only component allowed to reason.

**It will own:**
*   Intent understanding
*   Reasoning mode selection
*   Orchestration pipelines
*   Knowledge calibration
*   Response synthesis
*   Follow-up reasoning

This repository is intentionally prepared so that the Python AI Engine can be connected without refactoring any existing layer.

#### 4. Model & ML Services

Models are tools, not decision-makers.

**They:**
*   Execute tasks
*   Never reason autonomously
*   Never decide tone, intent, or structure

All models are invoked, constrained, and interpreted by the AI Engine.

### Current State of This Codebase

This codebase is intentionally **architecturally complete but behaviorally incomplete.**

That is by design.

*   No AI reasoning exists in TypeScript
*   No fallback intelligence is implemented
*   If the AI Engine is unavailable, the system fails clearly
*   No attempt is made to “simulate intelligence” in the frontend or backend

**Architectural correctness takes precedence over temporary usability.**

### Non-Negotiable Rules for Contributors

**You must not:**
*   Add reasoning logic outside the Python AI Engine
*   Introduce keyword-based intent detection
*   Add canned replies or fixed response templates
*   Allow models to orchestrate or self-route
*   Hide failures behind fake responses

**You may:**
*   Improve performance
*   Refine UI/UX
*   Harden transport and streaming
*   Prepare clean interfaces for the AI Engine
*   Add safeguards that enforce these boundaries

**When in doubt, fail loudly.**

### Design Philosophy

*   Assistant, not authority
*   Explanation over scoring
*   Precision over verbosity
*   Guidance over judgment

If a response sounds like an examiner, it is wrong for Eduvane.

### Guiding Principle

**Eduvane evolves by adding intelligence, not by diluting it.**

Every future upgrade must strengthen this separation, not blur it.

### Final Warning

If you are about to add logic that:
*   Interprets meaning
*   Decides what the system should do
*   Chooses how to respond

**Stop.**

That logic belongs in the Python AI Engine, not here.