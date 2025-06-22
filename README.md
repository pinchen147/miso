# **Miso AI — iOS Cooking Assistant**

*Product Feature Specification (Revised 2025‑06‑22)*

**Change log** – removed the previous “Feature Matrix” tier table; Miso AI now follows a **single, all‑inclusive subscription model**. All core features are unlocked for every paying user.

---

## 1  | Product Vision

**Miso AI** converts any modern iPhone into a patient, expert sous‑chef.
It combines front‑camera computer vision (≈ 1 FPS), Retrieval‑Augmented Generation (RAG) over an ever‑growing culinary knowledge base, and natural voice interaction to guide home cooks through any recipe—hands‑free, confidence‑boosting, and privacy‑respectful.

---

## 2  | Key User Benefits

| Benefit                      | How Miso AI Delivers It                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Hands‑free cooking**       | Continuous audio guidance, wake‑word voice commands, subtle AR overlays—no messy screen taps.          |
| **Expert‑level outcomes**    | Gemini 2.5 Pro analyzes the live scene; RAG grounds tips in trusted sources and user‑imported recipes. |
| **Universal recipe support** | Built‑in classics plus PDF/text import with instant structuring into interactive steps.                |
| **Real‑time coaching**       | Active feedback on slice thickness, doneness, heat intensity; on‑demand technique explainers.          |
| **Privacy first**            | Frames processed in RAM; down‑scaled images sent encrypted to the cloud; nothing recorded or stored.   |

---

## 3  | End‑to‑End User Workflows

### 3.1 Recipe Setup

1. **Browse or Import** a recipe → view summary → tap **Start Cooking**.
2. **Prep screen** lists required ingredients and tools; live vision highlights what’s already on the counter.
3. **Mount phone** on a stand; say *“Chef, let’s begin.”*

### 3.2 Guided Cooking Loop (per second)

| Sequence | System Actions                                                          |
| -------- | ----------------------------------------------------------------------- |
| 1        | Narrate current instruction via TTS.                                    |
| 2        | Capture frame → Gemini vision: detect objects, actions, anomalies.      |
| 3        | Build retrieval query (step text + vision findings + user voice query). |
| 4        | Embed query → ChromaDB similarity search (top k passages).              |
| 5        | Gemini chat → grounded answer / overlay / timer command.                |
| 6        | Render AR cues, speak feedback, update recipe state machine.            |
| 7        | Repeat until recipe complete; log session in on‑device history.         |

---

## 4  | System Architecture (Gemini‑Only, No Local ML)

```
iPhone (SwiftUI • ARKit • AVSpeech)
    │   720p JPEG @1 FPS
    │
    ├──► Gemini 2.5 Pro  (Vision + Chat + Embeddings)
    │         │
    │         └──► ChromaDB (AWS Fargate; public & user namespaces)
    │
    ├──► Google Speech‑to‑Text v3 (voice → text)
    │
    └──► Response Composer
            • AR Overlays
            • TTS
            • Timers / MCP hooks
```

*If the network drops, the app degrades gracefully to audio‑only static instructions.*

---

## 5  | Subsystem Overview

| Subsystem                | Key Responsibilities                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| **Camera & AR Overlay**  | 1 FPS capture; draw bounding boxes, icons, timers via ARKit.                                    |
| **Voice I/O**            | Wake‑word detection; Google STT; AVSpeechSynthesizer TTS (or cloud TTS if selected by user).    |
| **Vision Analysis**      | Ingredient detection, action recognition, doneness assessment with Gemini Vision.               |
| **RAG Engine**           | Query builder → Gemini embeddings → ChromaDB top‑k passages → Gemini chat for grounded answers. |
| **Recipe State Machine** | Track step index, timers, ingredient states; persists to Core Data on completion.               |
| **Monetization Layer**   | StoreKit 2 subscription check; blocks cooking session start if subscription expired.            |

---

## 6  | Knowledge Store (ChromaDB)

| Namespace | Content                                                     | Refresh Cadence       |
| --------- | ----------------------------------------------------------- | --------------------- |
| `public`  | USDA food‑safety, Serious Eats technique docs, curated PDFs | Quarterly ETL         |
| `recipes` | All built‑in recipes bundled with the app                   | With each app release |
| `user`    | User‑imported recipes and session memories                  | On upload / on save   |

Vectors: 768‑D float16; total index size target ≤ 1 GB RAM.

---

## 7  | Non‑Functional Requirements

| Category          | Target                                          |
| ----------------- | ----------------------------------------------- |
| **E2E latency**   | ≤ 1 s (Wi‑Fi) from user query to spoken answer  |
| **Battery use**   | < 20 % drain in a 60‑min session on iPhone 15   |
| **Accessibility** | Full VoiceOver support; captions toggle         |
| **Privacy**       | No frame storage; all network calls via TLS 1.3 |
| **Localization**  | English launch; Mandarin & Spanish in v1.2      |

---

## 8  | Risk Register & Mitigations

| Risk                     | Mitigation                                                                 |
| ------------------------ | -------------------------------------------------------------------------- |
| Cloud outage → no CV/RAG | Degrade to audio‑only; user informed; cooking still possible.              |
| Latency spikes           | Co‑locate ChromaDB and Gemini; stream TTS as tokens arrive.                |
| API cost escalation      | 1 FPS cap; image down‑scaling; nightly cost monitoring.                    |
| Unsafe culinary advice   | Mandatory grounding in vetted passages; safety filter; double‑check temps. |
| Privacy concerns         | Down‑scale frames, strip EXIF, explicit privacy policy.                    |

---

## 9  | Subscription Model

* **Single all‑inclusive plan** – Monthly or annual subscription (free 7‑day trial).
* Active subscription unlocks **all functionality**: vision feedback, recipe import, unlimited RAG Q & A, full recipe library, and cloud sync of personal history.
* App refuses to start a new cooking session if the subscription is inactive; recipe browsing remains available so users can decide to re‑subscribe.
* StoreKit 2 w/ RevenueCat backend for receipt validation; grace period and “Billing Retry” handled per Apple guidelines.

---

## 10  | Delivery Roadmap

| Milestone      | Scope                                                                  | ETA     |
| -------------- | ---------------------------------------------------------------------- | ------- |
| **0.5 Alpha**  | Built‑in recipes, audio narration, manual step navigation              | 2025‑08 |
| **0.8 Beta**   | Vision feedback @1 FPS, wake‑word control, recipe import & structuring | 2025‑10 |
| **1.0 Launch** | Subscription gating, RAG over public corpus, on‑device history         | 2026‑01 |
| **1.1**        | Vision‑aware troubleshooting, nutrition panel, iPad landscape UI       | 2026‑03 |
| **1.2**        | Multilingual (Mandarin, Spanish), smart‑appliance plug‑ins             | 2026‑06 |

---

## 11  | Open Questions & Next Steps

1. **Wake‑word engine** – adopt Apple Personal Voice hotword or keep cloud STT always‑on?
2. **Nutrition data** – integrate USDA food database for automatic macro calculations?
3. **Smart‑appliance API** – define MCP schema for major stove/oven brands.
4. **User testing** – recruit 30 beta cooks to validate overlay legibility and voice pacing.

> **Immediate action** – Build a SwiftUI prototype using stubbed vision results to test pacing and overlay design before wiring full Gemini integration.

Miso AI is now fully specified under a straightforward subscription model—ready for prototype implementation.
