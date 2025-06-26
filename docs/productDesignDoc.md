Great. I’ll prepare a detailed product design document for your iOS-based AI cooking assistant.
This document will cover the core vision-based, hands-free cooking coach experience — incorporating overlay guidance, audio instructions, and recipe parsing — all delivered through a Gemini 2.5-powered pipeline at 1 FPS. It will detail:

* iOS-first architecture
* Recipe intake (PDF/text)
* Audio-first + visual-overlay interface
* Passive and active instruction modes
* Component interactions and tech stack
* Subscription-based monetization


# iOS AI Cooking Assistant – Product Design Document

## Overview

Cooking at home can be challenging for many people, especially when following complex recipes or multitasking with messy hands. The **iOS AI Cooking Assistant** app is a hands-free, intelligent cooking guide that uses the device’s front-facing camera and AI to coach users through recipes step by step. It leverages real-time computer vision and audio guidance to identify ingredients, monitor the user’s cooking actions, and provide context-aware instructions and feedback. The result is an interactive “AI sous-chef” that makes cooking more accessible, enjoyable, and error-resistant for users of all skill levels. The app focuses exclusively on the iOS platform to take advantage of Apple’s audio frameworks, ensuring a seamless experience on iPhones.

The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
The goal is to replicate the guidance of an expert chef in the kitchen, allowing easy learning of new cuisines.

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 

Key objectives of the app include:

* Enabling **fully hands-free operation** (no need to touch the screen while cooking, thus avoiding messy interactions).
* Providing **step-by-step audio instructions** that adapt to the user’s progress and prior steps (context-sensitive guidance).
* Utilizing **computer vision at \~1 frame per second (FPS)** to identify ingredients and actions on the cooking surface, in order to give passive observations and active corrective feedback.
* Using **visual overlays** (bounding boxes, highlights, alerts) on the live camera feed to direct the user’s attention or point out mistakes, without requiring additional hardware (just the iPhone’s camera and screen).
* Supporting a rich **recipe database** (classic recipes across cuisines) and allowing **user-uploaded recipes** (text or PDF) which the app can parse into guided instructions.
* The recipe can then be 
* Keeping the user experience simple: minimal profile (just a local history of attempted dishes), no social features or cloud video storage (frames are processed in real-time and not saved, preserving privacy).
* **Monetization** via an optional subscription or in-app purchases, which unlock premium content (e.g. advanced recipes or cuisines) and possibly enhanced features, while a basic free tier provides core functionality.

## Feature Overview

The AI Cooking Assistant’s core features are outlined below:

* **Real-Time Ingredient Recognition:** The app identifies ingredients visible on the camera feed in real time. Using the front camera (set up to view the cooking surface) and advanced computer vision, it labels and highlights ingredients (e.g. detecting a tomato, onion, etc.). This helps confirm that the user has the correct items and prepares the app to tailor recipe instructions. Identified ingredients can be boxed or tagged on-screen via AR overlays.

* **Step-by-Step Audio Guidance:** The app provides *continuous, spoken recipe instructions* for each step in the chosen recipe. A text-to-speech engine narrates what the user should do next, eliminating the need to read from a screen or cookbook. Instructions are sequenced and timed appropriately, and the narration is context-aware – it references previous steps or ingredient states (e.g., “Now add the onions you chopped earlier”). All instructions are delivered through audio output, creating a fully hands-free guidance system. Users can also ask for repeats or clarification via voice (e.g., “What was that step?”) without touching the device.

* **Passive & Active Feedback via Vision:** As the user cooks, the system’s computer vision module passively monitors the scene for context (e.g., noticing when ingredients have been added or changes in food appearance) and actively checks for mistakes. For example, if the user is slicing carrots and the slices are too thick, the app can detect this and issue a gentle corrective prompt (“Try cutting the carrots thinner for even cooking”) while highlighting the over-sized pieces with a bounding box on screen. This **expert-level feedback** extends to noticing undercooked items (by color/texture) or unsafe practices, leveraging the AI’s visual understanding. The feedback can be subtle or explicit: passive hints if the user seems on track, and active alerts if a mistake is detected.

* **Visual AR Overlays and Alerts:** The app uses augmented reality-style overlays to enhance instructions. For instance, when a recipe says “Add 2 eggs,” the app might draw a highlighted box around the eggs in view to ensure the user grabs the right ingredient. If the user performs an incorrect action, an alert icon or colored outline can appear on the relevant object (e.g., a red outline on a pan if the heat looks too high). These overlays are rendered using Apple’s ARKit on top of the camera preview, aligning virtual indicators with real-world objects. This visual guidance complements the audio, providing an extra layer of clarity.

* **Built-in Recipe Library:** The app includes a curated database of classic recipes spanning various cuisines (e.g., Italian pasta, Japanese ramen, Korean bibimbap, etc.). Each recipe in the library is stored in a structured format (ingredients list, step-by-step instructions, timings, etc.), vetted for clarity. Users can browse or search recipes by name or category through the app’s interface. Once selected, the recipe’s content is used by the assistant to drive the guidance. These built-in recipes may be updated over time and some premium or gourmet recipes might be unlocked via subscription.

* **User-Uploaded Recipe Parsing:** Users are not limited to the built-in recipes – they can import their own recipes in free-text or PDF format. The app will parse an uploaded recipe document into a structured form that it can use for guidance. This involves natural language processing to extract the list of ingredients (with quantities) and the ordered steps from the text. Advanced parsing (using an NLP model or large language model) interprets recipe phrases into clear actions, identifies timers or temperatures, and preserves the sequence. The parsed recipe is then treated like any other recipe in terms of guidance. This feature lets users cook personal or online recipes with the same level of AI assistance.

* **Context-Sensitive Instruction Flow:** The assistant maintains state about where the user is in the recipe and what has been done. Every audio instruction is generated or chosen with context in mind. For example, if the user has already performed preparation steps (like preheating the oven or chopping onions in an earlier step), the assistant will not only skip repeating those details but might also remind the user of them when relevant (“...since we preheated earlier, the oven is ready now”). If the user deviates from the expected flow or the vision system indicates something unexpected (e.g., the user added an extra ingredient), the assistant can adapt – possibly asking for confirmation or adjusting the instructions. This dynamic flow is powered by the combination of the recipe state machine and AI reasoning to ensure the guidance feels *smart* and personalized rather than rigid.

* **Hands-Free Voice Interaction:** Beyond just listening, the app supports basic voice commands from the user, to maintain the hands-free experience. Users can control the app or ask questions by speaking – for example: “Next step,” “Repeat that,” “How much sugar was that?”, or “Pause.” The app utilizes iOS’s Speech Recognition framework to continuously (or on push-to-talk) listen for certain keywords or queries. Detected voice commands are parsed to intents (e.g., go to next step, give more detail, set a timer, etc.), which the app then executes. This ensures the user never needs to touch the screen, even to navigate the recipe or get help. (Voice control is implemented carefully to avoid accidental triggers, possibly requiring a wake-word like “Chef” or a tap with knuckle/elbow if needed to start listening).

* **Minimal Profile & Privacy:** The app does not require account creation or personal data entry. A minimal user profile is kept locally – mainly a history of recipes attempted, dates, and perhaps completion status or user ratings for personal reference. This history helps users remember what they’ve cooked before, but it is stored on-device. No video recordings are kept; the camera frames are analyzed in real time for feedback and then discarded (not saved or sent to long-term storage). This approach protects user privacy (kitchen footage is not stored) and simplifies compliance. Cloud AI services (for vision or language processing) are used in real-time, but no user identity is attached to those calls. Initially, personalized recipe recommendations or social sharing are out of scope; the focus is on being an effective single-user tool.

* **Monetization (Subscription & Premium Content):** The base app can be free to use with a selection of recipes and core features. Monetization is achieved by offering a subscription (e.g., monthly/yearly) that unlocks the full recipe library (including premium recipes or cuisines), and possibly advanced features such as *“pro”* feedback modules (for example, more detailed analysis of knife skills or plating tips). Premium recipe packs (bundles of recipes, like “Gourmet Desserts” or “Holiday Meals”) could also be one-time purchases. The app will *not* show ads during cooking (to avoid disruption); the business model centers on content unlocks and improved AI services for paying users. Even for subscribers, all processing remains on-device or cloud as designed – the subscription mainly gates content and extended AI usage. The design ensures that free users get a functional cooking assistant for basic needs, while enthusiasts can pay for more variety and depth.

Below is a **feature breakdown** table summarizing the main features, their purpose, and implementation approach:

| **Feature**                   | **Description**                                                                                                                                                        | **Implementation Notes**                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ingredient Recognition**    | Identify ingredients on camera and label/highlight them in real time. Helps verify needed ingredients are present and tracks their state (whole, chopped, etc.).       | **Computer Vision module** processes camera frames (≈1 FPS) to detect objects. Uses a powerful multimodal model (e.g. Google Gemini 2.5 Pro) to recognize a variety of ingredients with high accuracy. Bounding boxes or AR labels are drawn via ARKit overlay on the live camera view.                                                                                                                                                                               |
| **Audio Recipe Guidance**     | Step-by-step instructions read aloud to the user, fully hands-free. Each step is announced and explained contextually.                                                 | **Text-to-Speech** using iOS AVSpeechSynthesizer (on-device TTS) converts instruction text to natural speech. Pre-written script for built-in recipes; for user recipes or dynamic context, instructions may be generated or adjusted by an LLM. No user input needed to progress unless pause/clarify.                                                                                                                                                               |
| **Visual & Audio Feedback**   | Monitors user actions and provides feedback or corrections. Visual cues (boxes, arrows, alerts) highlight relevant items, while audio feedback gives tips or warnings. | **Computer Vision + AI** analysis of each step’s outcome. E.g., after a chopping step, the system checks via image if pieces are of the instructed size; if not, triggers an overlay highlight and voice tip. Uses ARKit for drawing overlays (e.g., a red outline on incorrectly cut items, or a checkmark on correct completion). Audio feedback is generated through TTS or pre-recorded phrases.                                                                  |
| **Recipe Library (Built-in)** | A curated collection of classic recipes with structured steps and metadata (ingredients, times, etc.). Users can pick from these to cook.                              | **Data Storage:** Recipes stored in local database (JSON or Core Data). Each recipe entry includes a list of ingredients and ordered steps (with timing, etc.). The structure is designed for easy parsing by the guidance engine. Recipes may include metadata like cuisine, difficulty, which can be used for filtering in UI.                                                                                                                                      |
| **Recipe Import & Parsing**   | Users can upload a recipe (text or PDF). The app parses it into structured steps to enable guided cooking for custom recipes.                                          | **NLP/LLM Parsing:** The raw text is processed by a language model or NLP pipeline. Techniques include Named Entity Recognition to find ingredient quantities, and dependency parsing to interpret instructions. Alternatively, a prompt to an LLM (like GPT-4/Gemini) can convert the recipe text into JSON (ingredients + steps). The parsed output is reviewed by the app (with user confirmation if needed) then used like a normal recipe.                       |
| **Context Awareness**         | The assistant remembers past steps and current progress to tailor instructions. e.g., referencing preheated oven, or combining steps if user is experienced.           | **State Management:** A recipe execution state machine tracks completed steps, active timers, and ingredient states. An LLM can be used for complex contextual reasoning – for instance, to decide if a user’s action fulfills a step or if a reminder is needed (“It looks like you haven’t added salt yet, don’t forget to add it before the next step”). Context-awareness logic is programmed into the assistant’s workflow, with rules and AI for flexibility.   |
| **Voice Command Support**     | Users can give voice commands or ask questions during cooking, without touching the device.                                                                            | **Speech Recognition:** Utilizes Apple’s `SFSpeechRecognizer` (with on-device recognition for English on iOS 15+ for offline use) to continuously listen or periodically prompt for commands. Key commands like “next step,” “repeat,” “pause,” or queries (“How much water did you say?”) are mapped to intents. A lightweight intent classification (could be rule-based or an NLP model) interprets the transcribed speech. The assistant then responds via voice. |
| **User History & Privacy**    | The app keeps a log of recipes cooked and basic stats for user reference. No accounts; data stays local. Camera data is not recorded.                                  | **Local Storage:** History stored in app’s sandbox (using Core Data or file). Contains recipe IDs, dates, perhaps user notes/ratings. No cloud sync (in this version). **Privacy:** No video saved; frames are processed in memory/in cloud and immediately discarded. Any cloud AI calls are transient (only image/frame data and recipe context). This is communicated to users for transparency.                                                                   |
| **Monetization Model**        | Subscription or in-app purchase unlocks more recipes and features. Free tier allows basic usage with limited content.                                                  | **In-App Purchases:** Uses StoreKit for managing subscriptions and one-time purchases. The app checks user’s subscription status to enable premium recipes in the library or advanced AI features. All core functionality (camera, voice, basic recipes) is available free to ensure value, while monetization adds breadth and depth.                                                                                                                                |

## System Architecture

The system is composed of several interacting components, divided broadly into **client-side modules (on the iPhone)** and **cloud-based AI services** (for heavy vision and language processing). The diagram below outlines the high-level architecture and data flow of the application:

* **Camera & Sensor Input:** The user positions their iPhone such that the **front-facing camera** captures the cooking workspace (e.g., cutting board, stovetop area). The app uses the camera feed (via AVFoundation or ARKit) and processes frames at roughly **1 FPS** for analysis. Lowering the frame rate reduces processing load while still capturing key changes in a typically slow-paced domain like cooking. (The assumption is that one frame per second is sufficient to detect state changes in ingredients or actions without missing critical events, as also done in video understanding research.)

* **Computer Vision Module:** Each frame is passed to the CV module. This can leverage **Core ML** (for on-device models) and/or cloud AI. Given the complexity of recognizing many ingredients and even interpreting cooking states, a cloud-based multimodal model like **Google’s Gemini 2.5 Pro (video mode)** is a strong choice. The CV module is responsible for: object detection (identifying ingredients, utensils, hands, etc.), scene recognition (e.g., detecting if something is boiling, or if stove burner is on via color/heat cues), and action recognition (e.g., user is chopping, stirring). If using Gemini 2.5 Pro, the app would send an image frame to the Gemini API with a prompt (for example: “Identify all ingredients and tools visible, and analyze the current cooking step progress”) and receive a response with identified items and possibly coordinates. For efficiency, certain simpler detections could be done on-device (e.g., using a smaller YOLOv8 model in Core ML for quick object bounding boxes) to draw overlays immediately, while the detailed analysis runs in parallel on Gemini. The CV module outputs structured data about the scene: a list of recognized ingredients (with positions), any detected action or change (e.g., “onion has been chopped”), and any anomalies (e.g., “meat appears undercooked” or “user’s hand positioning looks unsafe”). This information is fed into the higher-level assistant logic.

* **Recipe & Step Manager:** Once a recipe is selected (or imported and parsed), the app generates an internal **Recipe Model** – containing the step-by-step instructions, ingredient list, and any timers or branches. The **Recipe Manager** holds this data and current step index. It works like a state machine that moves from one step to the next when conditions are met (either automatically detected via CV or via user command). Each step’s data can include the textual instruction, the list of ingredients/actions involved, and conditions for completion (e.g., a timer duration or a visual cue like “pot appears boiling”). The manager ensures the guidance follows the recipe in order and coordinates with the vision and audio modules. It also records progress (for potential resuming if paused).

* **AI Reasoning & Contextual Assistance:** This logic layer ties everything together. It can be thought of as the “brain” of the assistant. It takes input from the Recipe Manager (current step info and context) and the CV module (current environment state), and decides on the app’s output (what to say or show next). A large language model (LLM) may be used here to enhance contextual responses – for example, using an LLM to generate a natural-language cooking tip based on what it sees (“Those carrot slices are a bit thick; try to cut them thinner for even cooking”). The same LLM or rule-based system can also handle user voice questions in context. For instance, if the user asks “How do I know if the chicken is cooked through?”, the app (via the LLM) can respond with a helpful answer drawing on general cooking knowledge (and even visually checking the chicken’s color if visible). While core navigation logic (moving to next step, starting timers) can be implemented with deterministic code, the LLM adds flexibility and expertise to the assistant’s interactions. Gemini 2.5 is a candidate for this too, since it’s multimodal – it can take the image data plus recipe context and user query as prompt, and produce a helpful answer or next instruction. If using Gemini or a similar LLM, careful prompt design and system messages will be used to keep it focused as a “sous-chef” persona.

* **Audio Output Module:** The app’s **Audio module** handles all spoken output. It uses Apple’s AVSpeechSynthesizer API to convert text to speech in real time. This covers the narration of recipe steps as well as any spontaneous feedback or answers. The voices can be chosen from Siri-like voices for naturalness, and possibly a custom voice font could be offered for premium (e.g., a famous chef’s voice if licensing allowed, or a distinct personable voice for the assistant). The audio module is triggered by the Recipe Manager and AI reasoning components whenever there is something to say. It also manages timing – for example, speaking at a clear but efficient pace, and pausing if it expects the user to perform an action or if listening for a response.

* **Visual Overlay UI:** On the iPhone screen, the main UI during a cooking session is the **camera view** with AR overlays. Using **ARKit**, the app initializes an ARSession with world tracking (if the phone remains stationary, we might use a simpler orientation tracking or even a 2D overlay mode – but ARKit gives flexibility for future movement). The AR overlay component receives drawing commands from the assistant logic: for example, “highlight object at coordinate (x,y)” or “display text ‘Done?’ above the pot”. It then uses ARKit’s capabilities (or simply drawing on the view using CALayers for a simpler 2D approach) to render these visuals in alignment with the camera feed. The UI also includes minimal chrome such as a *pause/end session* button, and maybe a small text panel showing the current step or listening status for voice input. However, the focus is to keep the screen largely hands-free. Any interactive UI elements (like a “Next” or “Repeat” button) are secondary to voice control, but provided as a fallback for accessibility. The visual UI also manages screen sleep (keeps device awake during a session) and orientation (likely locked in portrait for front camera usage).

* **Voice Input & NLP:** If voice interaction is enabled, the app continuously or intermittently activates the microphone via **Apple’s Speech framework**. When the user is expected to possibly respond (e.g., after the assistant asks a question or during idle waiting time), the app will listen for a short period. Speech is converted to text using on-device models (for privacy and offline reliability) when possible. iOS supports on-device speech recognition for English and some languages, which would cover basic commands offline. For more complex queries, the transcribed text can be sent to the LLM module for generating a contextual answer. A lightweight intent classification can be done to distinguish commands vs. questions vs. irrelevancies. Voice input flows into the same AI reasoning component, ensuring the assistant’s state updates based on user utterances (e.g., user says “I already did that earlier,” the system might skip ahead or at least not repeat itself).

* **Recipe Database & Parser:** Off-session (when browsing or importing recipes), the app has components for handling recipe data. The built-in recipes reside in a local database; a simple data access layer fetches the recipe details for display and for feeding into the Recipe Manager on start. For user-imported recipes, the **Parser** component (likely cloud-based for complex parsing) is invoked. For example, upon uploading a PDF, the app uses OCR (if needed) to get text, then calls an LLM API with a prompt like “Extract the ingredients and steps from this recipe” to get a structured result. Alternatively, a combination of rule-based parsing (looking for lines that start with numbers for steps, etc.) and ML (for ingredient entity extraction) is used. This part of the system interacts with the UI by possibly showing the parsed result for user confirmation/edit (ensuring no critical errors in understanding), then saving it into the user’s local recipe list.

* **Session Control & Integration:** Tying all these parts together is the main **app controller logic** (could be within the `ViewModel` if using SwiftUI MVVM pattern). This handles high-level transitions: starting a cooking session, moving between steps, pausing/resuming, and ending a session. It ensures synchronization between audio, visual, and logic. For example, when moving to a new step, it will update the AR overlay (clear old highlights, maybe display a number for the step), trigger the audio module to speak the instruction, reset or start relevant timers, and prime the CV module for what to look for (e.g., expecting a certain ingredient to appear in frame or a color change). The controller also handles interruptions – if a phone call comes or the app goes to background, it will pause the session safely and perhaps save state.

**Technical Interaction Workflow:** To illustrate how components interact, consider the scenario of a single step execution in detail:

1. **Current Step Context:** The Recipe Manager provides the next step details to the AI Reasoning module – e.g., “Step 3: Sauté onions until golden.” It includes knowledge that this step involves onions and a frying pan on heat.
2. **Instruction Delivery:** The Audio module (TTS) speaks: “Step 3: Add the chopped onions to the pan and sauté them until they turn golden brown. I’ll let you know when to check them.” The user hears this and proceeds. Simultaneously, the UI overlay might show an icon or text “Cooking...” and possibly highlight the pan on screen (from previous step tracking) to indicate where the action occurs.
3. **Vision Monitoring:** As the user cooks, every second a frame is analyzed. The CV module recognizes onions in the pan and their color. Initially they are white; it keeps monitoring. It also tracks if the user is actively stirring. No issues are detected at first – this is normal progress (passive monitoring).
4. **Intermediate Feedback:** Suppose the user asks via voice, “How long will this take?” The voice input is transcribed and caught by the assistant. The AI reasoning checks context (sautéing onions typically \~5 minutes until golden). It responds via audio: “It should take about five minutes. Keep stirring occasionally. I’ll let you know when they look ready.” This answer is either pulled from a knowledge database or generated by the LLM on the fly, demonstrating context-sensitive help.
5. **Detecting Completion:** After a few minutes, the CV module sees the onions have turned a light golden brown (it can detect a color change in the onion pieces). It might also detect more steam, indicating cooking. The module sends a signal “onions golden” to the reasoning layer. In addition, a timer running in the app knows \~5 minutes passed. With these cues, the assistant determines the step is likely complete.
6. **Active Feedback (if needed):** If the onions were starting to burn (turning too brown or black spots detected), the CV would send an alert. The reasoning could then interrupt: “Looks like the onions might be cooking too fast – consider lowering the heat.” and flash a warning overlay (like a red exclamation near the pan). This is an example of active feedback preventing a mistake. If everything is fine, no correction is given.
7. **Transition to Next Step:** The assistant says “Great, the onions are nicely golden now.” (positive reinforcement) “Pausing the heat. Ready for the next step?” If user says “yes” or simply if no action needed, it proceeds. The Recipe Manager marks step 3 done and loads step 4. The AR overlay might put a green checkmark on the pan or a brief text “Onions done” then clear it. The system then goes back to instruction delivery for the next step.

This workflow shows how the modules work in concert: vision providing real-time environment data, the recipe logic and AI providing the decision-making and instructional content, and the UI delivering this to the user through voice and visuals.

## Technical Components and Stack

To implement the above functionality on iOS, the following technologies and frameworks are recommended for each component:

* **Programming Language & UI:** The app will be built in **Swift**, using **SwiftUI** for the user interface. SwiftUI allows for reactive UI updates which are useful for dynamically changing overlays and status indications as the cooking session progresses. It also integrates with **UIKit/ARKit** for the camera view. SwiftUI will manage screens like recipe selection, and also overlay SwiftUI views on top of an ARKit scene for the cooking interface (using `ARView` or `UIViewRepresentable` to incorporate AR content). This choice ensures a modern, maintainable codebase and smooth UI experience on iOS.

* **Camera and AR:** Apple’s **ARKit** framework will be used to handle the camera and rendering of overlays in the real-world view. ARKit provides SLAM (simultaneous localization and mapping) which might be overkill if the phone is stationary, but it also provides a convenient `ARSCNView` or `ARView` for combining camera feed with drawn 3D or 2D content. Using ARKit, the app can place *AR anchors* on detected surfaces if needed (for instance, anchor labels to the cutting board plane so they stay in place). It also handles device motion tracking, which could help maintain overlay alignment if the device moves. If ARKit is not strictly needed (say the device is fixed), a simpler approach is to use **AVFoundation** to capture video frames and display them, drawing overlays with Core Animation. However, ARKit is future-proof and allows more advanced interactions (like potential 3D holograms of how to cut something, in future versions). The decision to focus on iOS means we can deeply integrate with ARKit for a polished AR interface.

* **Computer Vision (CV):** For ingredient and action recognition, leveraging **pre-trained deep learning models** is key. Since we target iOS, smaller models can be run on-device thanks to Core ML and the Neural Engine (for example, a MobileNet or YOLOv5 CoreML model for basic ingredient detection). However, to achieve high accuracy and more complex understanding (like judging cookness or technique), the design leans on **cloud AI**. **Google’s Gemini 2.5 Pro (multimodal)** is ideal for its state-of-the-art video/image understanding and reasoning. The app would use network calls to the Gemini API (via REST/ gRPC) sending frames and receiving analysis. This requires internet connectivity and incurs API costs (hence why monetization helps cover this). Gemini can handle identifying multiple ingredients and even complex queries about the scene, as it’s trained on cooking video data (e.g., YouCook2 dataset) and can caption/answer questions about videos. It was shown to perform well on YouCook2 dense captions and video QA tasks, indicating it can understand cooking actions effectively. *Backup approach:* If Gemini API is unavailable or for cost-saving in some scenarios, the app can fall back to local models for key tasks (like using **Vision framework** for basic image classification of a frame to find the dominant ingredient, or detecting objects via YOLOv8-nano model). This hybrid approach ensures the app still functions (perhaps with reduced feedback capabilities) offline or under poor network conditions, albeit the highest-level feedback features might be limited to online mode.

* **Natural Language Processing (NLP) & LLM:** The app’s language intelligence (for recipe parsing, generating contextual responses, etc.) will rely on a combination of on-device NLP and cloud-based **Large Language Models**. For parsing user recipes, a cloud LLM such as **OpenAI GPT-4** or **Gemini LLM** will produce the most accurate structuring of arbitrary recipe text. The prompt can instruct the model to output JSON with steps, ingredients, etc., which the app then uses. For real-time instructions and Q\&A, an LLM can also be used. For example, if the user asks a novel question (“Why do I need to add salt now?”), the app forwards this along with context (current step and image if needed) to an LLM which returns a helpful answer. Both OpenAI and Google’s APIs can be integrated; since we’re already using Gemini for vision, using the same ecosystem for text makes sense. However, to reduce latency, not every step’s instruction will call an LLM – standard recipes have pre-authored text. The LLM is mostly for parsing and unforeseen queries or generating *adaptive* remarks. It’s important to constrain the LLM with a defined persona and knowledge base (to ensure consistent style and accuracy in cooking advice). Apple’s frameworks don’t include large generative models natively as of 2025, so relying on external AI services is acceptable in design, given network access. The app must gracefully handle when the cloud LLM is not reachable (maybe default answers or require internet for full functionality).

* **Audio Synthesis (Text-to-Speech):** The app utilizes **AVSpeechSynthesizer** (part of AVFoundation) for text-to-speech conversion. This API allows choosing voice language, gender, and even voice variety (including Siri voices). It operates offline for built-in voices and produces high-quality speech. It also supports real-time interruptions and queueing, which the app can use to manage speech output (e.g., stop speaking if user asks a question mid-instruction). If a more custom or expressive voice is desired, we might consider third-party TTS services (Amazon Polly, Google Cloud TTS, or even ElevenLabs for a very natural voice). Those would require internet and possibly be part of premium due to cost. Initially, AVSpeechSynthesizer suffices and aligns with an on-device-first approach. One can also preload certain frequent phrases to speech if needed to avoid any latency.

* **Speech Recognition (Voice Commands):** For handling user voice input, we leverage Apple’s **Speech framework** (`SFSpeechRecognizer`). This provides realtime speech-to-text for user utterances. On newer iOS versions, Apple supports **on-device** recognition for many languages (which is faster and private). We will configure the recognizer for English (and potentially offer other languages if the recipe content is localized – but that might be future scope). The recognizer will be tuned with a custom vocabulary of cooking terms and commands to improve accuracy (Apple allows hinting or custom language models in iOS 16+). For open-ended questions, the general model should suffice. The voice processing can run continuously with some timeout (to avoid battery drain, perhaps it only actively listens right after giving an instruction or when a wake word is detected). We must manage user permissions for microphone and speech recognition, and provide visual feedback (e.g., a subtle indicator when listening). In case the on-device model misrecognizes something or doesn’t support certain languages, as fallback the app could use cloud STT (e.g., Google Cloud Speech as InData Labs did), though that introduces privacy considerations. For our design, we emphasize on-device as default.

* **Data Management:**

  * *Recipes:* The built-in recipe library can be packaged with the app or fetched from a server (if we plan to update recipes or add new ones dynamically). A lightweight database (like **SQLite via Core Data** or even just JSON files) will store these. Each recipe entry includes fields like `id`, `name`, `cuisine`, `ingredients` (array of {name, quantity}), `steps` (array of {instruction text, expected duration, ingredients involved, etc.}). Having this structured makes it easy to display and also to feed into the guidance engine.
  * *User Imported Recipes:* These can be saved similarly (perhaps tagged as user-provided). We’ll store the raw file (for reference) and the parsed result.
  * *User History:* Use Core Data or UserDefaults for a simple log (recipe id + timestamp + maybe a rating or note). This does not need a complex schema.
  * No external cloud storage is involved for user data to keep things private and simple. The app might use iCloud (optional) if we want the history or saved recipes to sync across user devices, but since this is iOS-only and not explicitly required, we can defer that.

* **Security & Privacy:** Because we use camera and mic, we will adhere to iOS privacy requirements – requesting camera and microphone permission from the user. Frames sent to cloud AI are not stored, but we will still disclose that images of ingredients might be sent to servers for analysis. Using Apple’s on-device capabilities where possible (e.g., on-device speech, on-device vision for simpler tasks) helps limit data leaving the device. We also ensure all network communication to AI services is encrypted (HTTPS). No personal info is collected, and no cooking footage is saved or shared without user action. This will be clearly stated in the app’s info.

* **Performance Considerations:** Analyzing video frames with AI can be intensive. By running heavy models in the cloud, we offload most CPU/GPU work, but network latency is a factor. We mitigate this by the 1 FPS rate and designing the UX such that immediate real-time feedback (<1s) is not usually required – cooking steps take minutes, so a 1-2 second delay in a tip is acceptable. On-device UI and TTS are very quick, so the user experiences no lag in hearing instructions. We will also utilize background threads for any processing to keep the UI smooth (e.g., using Combine or Grand Central Dispatch in Swift for asynchronous calls to the vision and NLP services). The app should target **modern iPhones (e.g., iPhone 12 and above)** for optimal Neural Engine and AR performance. Testing will ensure that even with continuous camera and AR rendering, the app remains responsive and does not overheat the device (we may drop camera resolution or frame rate if needed to reduce load – ARKit allows a lower capture resolution setting for performance).

## User Workflows

To clarify how a user interacts with the AI Cooking Assistant, this section describes the workflows from both the **user’s perspective** and the **system’s perspective** in parallel. There are two main phases: **Recipe Selection/Setup** and **Guided Cooking Session**.

### 1. Recipe Selection & Setup

**User Perspective:** Upon launching the app, the user is greeted with a simple home screen. They can choose a recipe from categories (cuisine/type) or use a search bar to find a specific dish. Alternatively, they tap “Import Recipe” to add their own. If choosing from the built-in library, tapping a recipe brings up a summary: image (if available), estimated time, ingredients list, and a “Start Cooking” button. If importing, the user is prompted to paste text, select a PDF, or even snap a photo of a recipe (future feature) – assume text/PDF for now. After providing the recipe, they hit “Parse” and the app shows the interpreted ingredients/steps for confirmation. The user can edit any mistakes in parsing or proceed if it looks correct. Next, the app may show a **“Prep” screen**: it lists all needed ingredients and tools for the selected recipe so the user can gather them. Once ready, the user positions their phone on a stand or leaning against a surface such that the front camera points at the workspace. They then press “Begin” (or say “start cooking” if voice-triggered start is implemented).

**System Perspective:** In the background, if a built-in recipe is selected, the app loads that recipe’s data from the local storage. If a user recipe is imported, the system invokes the Parser (possibly calling the LLM API) to parse the content into structured form. It handles OCR if needed (for PDFs) using Apple’s Vision framework text recognition. After parsing, it creates a new recipe entry in memory. The app then transitions to the preparation stage: it generates the list of ingredients/tools from the recipe data and possibly cross-references with the Vision module to see if those items are currently visible on camera (this could be a value-add: e.g., highlight which ingredients from the list are already in view, and which might be missing). The system might prompt the user via audio: “Let’s make sure you have everything. I see carrots, onions, and eggs on the counter. You’ll also need garlic and butter – go ahead and grab those before we start.” This is an example of AI enhancement before cooking. Once the user confirms readiness, the system initializes the AR session (starting camera capture and ARKit) and the CV module warms up (maybe doing an initial scan of the scene to identify all ingredients present). The Recipe Manager is set to step 0. The app is now ready to walk through the recipe.

### 2. Guided Cooking Session

Once cooking begins, the user mainly listens and follows instructions, occasionally interacting via voice. The system iteratively goes through the recipe steps with continuous environment monitoring. Below is a step-by-step flow combining user and system actions:

1. **Begin Step – Instruction Output:** The app announces the first step. For example: *“Step 1: Wash and peel the carrots, then cut them into thin slices.”* This is spoken aloud while the same text (or a summarized form) might appear on screen for reference. The camera view is on, and the app might simultaneously highlight the carrots on the counter with a faint glow to focus the user.

   * *System:* The Audio module plays the step narration. The Visual module draws any overlay (finding carrot objects via CV and highlighting them). The state now waits for the user to complete Step 1.

2. **User Performs Action:** The user starts peeling and chopping carrots as instructed. They do not need to touch the phone. If their hands are wet or busy, it doesn’t matter – the app is watching and ready to assist. Suppose the user is slicing and the pieces look quite thick.

   * *System (Passive Monitoring):* The CV module is processing frames. It recognizes the user’s action (cutting carrots) and the resulting pieces. It measures or qualitatively assesses the slice thickness. Since the instruction said “thin slices,” the system has an ideal range in mind (perhaps 2-3mm thick). If it sees significantly thicker slices (say 1cm), it flags a potential issue.

3. **Real-Time Feedback (Active):** The assistant decides to interject with a helpful tip: *“Try to slice the carrots thinner – about half the thickness of what you have there. Thinner slices will cook more evenly.”* Concurrently, on the screen, it might outline one of the thick carrot slices in red to show which ones are too thick.

   * *System:* The CV module triggers an event “carrot\_slices\_too\_thick” with the coordinates of offending pieces. The AI reasoning component chooses a feedback phrase (which could be pre-written for this common issue or generated on the fly). The Audio module speaks this advice, while the Overlay module draws a red box around the slice. This is done in a supportive tone so the user doesn’t feel criticized, just guided. The recipe flow pauses momentarily for the user to adjust.

4. **User Adjusts and Completes Step:** The user heeds the advice and slices thinner. Once done with chopping, they possibly say “Done” or just pause and look at the device.

   * *System:* The vision sees that there are now a bunch of carrot slices on the board and the action of chopping has stopped. It infers the task is complete. (If the user said “Done,” the Speech Recognizer would catch that and treat it as a command to proceed.) The system might double-check the result: all carrots are indeed sliced and generally of the right size.

5. **Step Transition:** The assistant confirms completion: *“Great, that looks good.”* It might even use the camera to quickly count how many slices and say, *“You have about 20 slices.”* Then it queues up the next instruction: *“Now, step 2: In a pot, bring water to a boil to cook the carrots.”* (assuming a hypothetical recipe). The user hears this and starts step 2.

   * *System:* Marks step 1 as done in the Recipe Manager, possibly logs it in history. It then moves to step 2, describing it via TTS. Meanwhile, the overlay may point out the pot on the stove if visible. If a timer is involved (boiling water might take time), the system could automatically start a timer and/or instruct the user to set heat to high.

6. **Concurrent Actions & Multitasking:** Some recipes require doing parallel tasks (e.g., “While the water boils, chop the onions”). The assistant can handle this by splitting the interface: it can maintain one step as active but give a secondary instruction. For example, after starting the water boiling (which takes several minutes), the assistant might say, *“While we wait for the water to boil, let’s move to the next step: chop the onions.”* The user then proceeds to chop onions. The app monitors both the onions (for chopping feedback) and the pot (for boil detection). It can manage a **timer** for boiling and visually perhaps show a small timer countdown on screen.

   * *System:* This requires the Recipe Manager to handle parallel steps or at least pseudo-parallel (one step with sub-tasks). It sets a timer for boiling (e.g., 5 minutes or a detection event “steam rising” via CV) and initiates the onion chopping guidance. The CV is now looking for two conditions: onion chopping completion and water boiling. It can handle multiple detection goals by prioritizing events (e.g., if water boils first, it will interrupt the user: “The water is boiling now, go ahead and add the carrots to the pot, then continue chopping the onion.”). This juggling showcases the context-aware and flexible nature of the assistant’s workflow.

7. **User Queries:** At any point, the user can ask questions. Suppose the user asks, *“Should I add salt to the boiling water?”* The assistant will answer appropriately: *“Yes, adding a pinch of salt to boiling water is a good idea. It enhances the flavor and helps the carrots cook better.”* The user adds salt as they wish.

   * *System:* The voice query is converted to text. The AI reasoning module, possibly via the LLM, processes this question in context (it knows we’re boiling carrots for, say, a soup, so salting water is reasonable). It generates a brief answer which the TTS speaks. This doesn’t necessarily change the recipe steps (unless it’s a critical omission, then the assistant might incorporate it as a new step). It’s just on-the-fly assistance, similar to having an expert in the kitchen to consult.

8. **Continuing through Steps:** The above cycle repeats for each step: announce step, monitor, give feedback, wait for completion, then move on. If a step requires the user to just wait (e.g., “Simmer for 10 minutes”), the assistant will start a **timer** and might play an optional gentle sound or announce when there are, say, 2 minutes left. It keeps vision on in case something goes wrong (like boiling over – it could alert user to lower heat if it sees a lot of foam or overflow). During waiting, if nothing needs doing, the assistant might even offer tips or trivia (“Did you know…”) as a premium feature, but that’s extraneous. The main point is it manages timing and ensures the user knows when to proceed.

9. **Completion:** After the final step (plating the dish, for instance), the assistant says something congratulatory: *“All done! Great job – your Bibimbap is ready to serve. Enjoy your meal!”* The session ends. The app might then ask, *“Would you like to save any notes or rate this recipe?”* or simply return to a summary screen. In the summary, the user sees the recipe completed, maybe total time taken vs. expected, and can input a personal note (like “Used less salt” for next time). This is optional.

   * *System:* On completion, stops camera and audio sessions to conserve resources. Records the session in history (recipe, date, maybe a success flag). If any analytics are being collected (like which steps users needed help on, to improve the model), that data is stored locally or sent anonymized to a server if within policy (not a core requirement, but could help improve the AI over time).

Throughout these workflows, the guiding principles are clarity, proactiveness, and non-intrusiveness. The user should feel guided but not dominated by the app – they remain the chef, and the AI is the assistant.

## UI/UX Design Notes

While this document focuses on functionality and technical design, a brief note on the user experience design:

* The **interface** during cooking will likely use a dark/translucent theme (to overlay on real video). Key information (current step, maybe a progress bar of recipe steps) could be shown unobtrusively. Because audio is the main channel, the UI can be minimal. However, accessibility options may allow toggling text captions for the instructions (for users with hearing impairment, or simply to reinforce audio).

* **Interactions** are primarily via voice and the implicit interaction of doing the cooking action. There should be clear voice feedback for any recognized command (e.g., user says “next step,” the app maybe chimes and says “Okay, moving on” so they know it heard them). If voice fails (not recognized), the app might gently say “Sorry, could you repeat that?” or provide an alternative (the user could tap “Next” button if needed). We should ensure the flow isn’t stuck if voice control fails occasionally.

* **Overlays** will use simple shapes and icons – e.g., bounding boxes, arrows, checkmarks, or warning symbols – to avoid cluttering the view. They will also likely be color-coded (green for correct, red for issue, yellow for caution/tips). ARKit allows anchoring labels to specific objects: e.g., a floating label “Carrots” over the carrots. This can be useful at the start to confirm what’s what.

* The app’s **tone** via audio is encouraging and calm. It should never scold the user; errors are framed as fixes (“Let’s try doing X for a better result”). The voice assistant persona can be configured in the LLM system prompt as a “knowledgeable, patient sous-chef”. This ensures consistency in how it speaks.

* **Localization:** While initial version might be English-only, the design could later include multiple languages (since recipe content and speech can be translated or localized). The speech synthesizer supports many languages, and the CV doesn’t depend on language. The LLM prompts for other languages could be adjusted. (This is future consideration.)

## Technical Challenges and Mitigations

It’s worth noting some key challenges in this project and how the design addresses them:

* **Ingredient Detection Accuracy:** Identifying a wide range of ingredients via camera is hard (many models can misclassify items or struggle in poor lighting). Earlier projects using models like YOLOv5 had accuracy issues with certain foods. We mitigate this by using state-of-the-art models (Gemini LLM’s vision, which has a higher accuracy and multimodal understanding). Additionally, because we know the recipe context, we can narrow the expected ingredients at a given time (contextual filtering). For example, if the recipe says the next step involves eggs and flour, the system can be extra sensitive to finding eggs and flour in the scene, and less concerned with recognizing other random objects.

* **Timing and Synchronization:** Ensuring the guidance doesn’t lag behind or rush ahead of the user is tricky. The app uses vision cues and possibly direct user feedback (“Hey, wait”) to adjust pacing. We plan to give the user control by saying “next” only when they are ready, *and* automatically progressing if it’s evident they finished a task. A combination of these ensures it neither leaves the user idle nor forces them before they’re ready. Extensive user testing will be needed to tune this.

* **Performance & Battery:** Real-time AR and continuous AI analysis can drain battery and CPU. Our approach of 1 FPS processing, combined with splitting load (device vs. cloud) and efficient use of ARKit’s optimizations, should keep performance in check. We will utilize instruments to profile memory and CPU. The app will also have settings to dial things down (for example, a “Battery saver” mode could reduce analysis frequency or disable AR overlays, only using audio).

* **Error Handling:** If the vision system fails to recognize something (say it cannot tell if an egg is undercooked due to lighting), the assistant should not give incorrect advice. It’s designed to either ask the user (“Make sure the egg yolk is set – is it still runny or firm?”) or just not comment unless sure. The LLM can help by expressing uncertainty when needed. Similarly, voice recognition errors need graceful recovery (maybe confirm critical commands like “Add 5 tablespoons of salt” via voice – if misheard, that could be disastrous, so important quantities could be double-checked visually or verbally).

* **User Trust and Comfort:** Some users might be wary of an AI watching them cook. By highlighting the privacy (no footage saved) and by the assistant’s friendly demeanor, we aim to make the experience feel like a helpful coaching session, not surveillance. The user is always in control – they can disable the camera at any time (the app would then just read steps without feedback). But the value proposition is that most will opt for the full experience once they trust it.

## Conclusion

This product design document has outlined a comprehensive plan for an **iOS-only AI Cooking Assistant app** that merges computer vision, audio interaction, and augmented reality to create a next-generation cooking experience. Focusing on the iOS ecosystem (Swift, ARKit, Core ML, AVFoundation) allows us to tightly integrate hardware and software for real-time guidance. The overall framework involves a synergy of technical components: a powerful CV module for understanding the kitchen scene, an intelligent LLM-driven logic for conversational and contextual instruction, and intuitive UX design for hands-free operation.

By guiding users through recipes with stepwise audio instructions and intervening with expert feedback when needed, the app acts as a personal sous-chef. Initial features emphasize reliability and clarity (with a curated recipe set and no need for accounts), while the architecture leaves room for future expansion – such as more personalization, social sharing of recipes, or even integration with smart kitchen appliances. Monetization through subscriptions will support the use of advanced AI services like Gemini Pro while offering users valuable content. In user testing of similar prototypes, such AR and AI-assisted cooking has proven to boost confidence and satisfaction, indicating strong potential for this app to resonate with home cooks.

In summary, the iOS AI Cooking Assistant is designed to **make cooking easier, smarter, and more engaging** by combining the tactile joy of cooking with the guidance of AI. It leverages the cutting-edge of CV and LLM technology within a practical mobile app framework, delivering an experience that could fundamentally transform how people learn and execute recipes at home. With careful implementation and iteration, this assistant can help novices and experienced cooks alike achieve better results and enjoy the process – all while keeping their hands on the task and off the screen, exactly where they should be in the kitchen.

**Sources:**

1. Vir, R. & Madinei, P. *ARChef: An iOS-Based Augmented Reality Cooking Assistant Powered by Multimodal Gemini LLM* (2024) – Leveraging ARKit and Gemini LLM for ingredient identification and guided recipes.
2. Google Developers Blog – *Advancing the frontier of video understanding with Gemini 2.5* (June 2025) – Describes Gemini 2.5 Pro’s video analysis capabilities, e.g. processing videos at 1 FPS for efficient understanding.
3. InData Labs – *Intelligent AI Cooking Assistant* (Case Study, 2022) – Showcases a voice-controlled cooking app and mentions recipe text parsing techniques (NER, dependency parsing).
4. PromptLayer Blog – *Your AI Sous Chef: Cooking With Augmented Reality* (Dec 2024) – Summary of ARChef and the benefits of AR and LLM integration in cooking assistants.
5. Nguyen et al. – *Augmented Reality Based Interactive Cooking Guide* (2022, IEEE Access) – Research on AR cooking systems using Magic Leap and voice/gesture control; highlights importance of hands-free interaction.
6. Apple Developer Documentation – **AVSpeechSynthesizer** (iOS Text-to-Speech API) and **Speech Framework** (iOS Speech Recognition WWDC Notes) – for implementing audio I/O on iOS.


### Short answer

**Yes — adding Retrieval‑Augmented Generation (RAG) to the cooking assistant is not only feasible, it will immediately improve answer quality, reduce hallucinations, and let you grow the knowledge base far beyond the handful of built‑in recipes.** Below is a concrete plan showing *where* RAG fits, *what* it adds, and *how* to implement it on iOS without breaking the hands‑free, low‑latency experience.

---

## 1  | Why RAG helps in a cooking app

| Pain‑point today                                                                                                                                     | How RAG fixes it                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **User Q\&A depth** – Today the LLM answers questions only from its baked‑in weights; it may hallucinate timings, temperatures or food‑safety facts. | Retrieve authoritative snippets (e.g. USDA doneness charts, Serious Eats technique articles) and ground every answer. |
| **Sparse knowledge** – Built‑in recipes cover spaghetti/ramen/bibimbap but not “vegan gluten‑free lasagne” or “Mom’s 1970s casserole”.               | Index public recipe sites + user uploads; any new doc becomes immediately answerable.                                 |
| **Personalization** – The app can’t recall what *you* cooked, what knives you own, or that you hate cilantro.                                        | Store your history + preferences as embeddings and retrieve them to tailor tips (“use parsley instead”).              |
| **Vision gaps** – CV may detect “steak looks dark”; it still needs culinary context (“dark but 45 °C internal is rare—keep cooking”).                | Convert CV findings to a text query, retrieve a “doneness guide” card, feed it to the LLM for precise advice.         |

> In short, RAG lets the LLM **reason over fresh, verifiable cooking knowledge at run‑time** instead of guessing. ([aws.amazon.com][1])

---

## 2  | Where RAG slots into the existing architecture

```
Camera ➜ CV (Gemini) ┐
                      │  scene + step context
Voice  ➜ STT ───────┐ │
User doc / query ──►│ │► ❶ Query builder
                    └─┘
                        ⇣
            ❷ Retriever (Vector DB, K‑NN)
                        ⇣ top‑k passages
            ❸ LLM (Gemini / GPT‑4)
                        ⇣ grounded answer / next instruction
Audio TTS ◄─────────── ❹ Response composer (adds overlays, timers)
```

* **❶ Query builder** – Assembles a retrieval prompt from:

  * Current step (“Sauté onions until golden”)
  * CV observations (“onions look very dark”)
  * User voice (“Is that okay?”)
* **❷ Retriever** – Looks up **passages** (not whole PDFs) in the knowledge store.
* **❸ LLM** – Receives: *system prompt* (sous‑chef persona) + retrieved snippets + live context, then generates the grounded answer or next instruction.
* **❹ Response composer** – Splits answer into (a) audio narration, (b) optional AR overlays, (c) state‑machine updates.

---

## 3  | Knowledge store design

| Corpus                       | Source                                           | Refresh cadence | Typical doc length | Notes                                                               |
| ---------------------------- | ------------------------------------------------ | --------------- | ------------------ | ------------------------------------------------------------------- |
| **Curated technique guides** | Serious Eats, America’s Test Kitchen, USDA, etc. | Quarterly       | 1–3 kB             | Gold‑standard for substitution tables, food‑safety, knife skills.   |
| **Built‑in recipes**         | Local JSON bundle                                | App release     | 1 kB               | Already structured → add as embeddings for fast similarity look‑up. |
| **User‑uploaded recipes**    | Text/PDF imports                                 | On upload       | 0.5–2 kB           | Embed on‑device; no cloud unless user opts‑in.                      |
| **Session memories**         | On‑device notes such as “cut thumb on 8 Feb”     | Real‑time       | <0.5 kB            | Personal context vector; never leaves device.                       |

*Vector DB options*

| Deployment    | Library / service                              | Pros                                                                    | Cons                                                                    |
| ------------- | ---------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **On‑device** | **SQLite‑vss** / Chroma‑Lite                   | Offline, private, zero latency for small corpora (<10 k docs).          | Limited to \~100 MB before queries slow.                                |
| **Cloud**     | **Pinecone** or Google Vertex AI Vector Search | Scales to millions of documents, built‑in filtering. ([pinecone.io][2]) | Needs network and billable quota; must strip images from docs for size. |

> Recommended hybrid: keep user recipes & session memories on‑device; use a cloud index for large public corpora.

---

## 4  | Retrieval workflow details

1. **Index build (offline)**

   ```bash
   for doc in corpus:
       chunks = split(doc, max_tokens=256, overlap=32)
       embeddings = embed(chunks, model="text-embedding-3-small")
       upsert(chunk_id, vector, metadata)
   ```
2. **At run‑time**

   ```swift
   let query = "\(currentStep). \(cvFinding). \(userQuestion)"
   let qVec  = embed(query)
   let topK  = vectorDB.similaritySearch(qVec, k:4, filter: {...})
   ```
3. **Prompt assembly**

   ```text
   System: You are "Remy", a patient sous‑chef...
   Context:
   ### Passage‑1 (Source=A‑1)
   ...
   ### Passage‑2 (UserRecipe‑3)
   ...
   ### Question
   Is it okay that my onions look quite dark?
   ```
4. **LLM call** → gets grounded answer (ex: “If onions are darker than light brown they’ll taste bitter; reduce heat”).
5. **Response** – App speaks answer and optionally flashes an orange overlay on the pan rim.

Latency budget (Wi‑Fi):

| Step                    | Expected time                                  |
| ----------------------- | ---------------------------------------------- |
| Embed query (on‑device) | ≤ 15 ms                                        |
| Vector search (cloud)   | 80–120 ms                                      |
| LLM (Gemini)            | 600–800 ms                                     |
| TTS synthesis           | 50 ms (can stream)                             |
| **Total**               | \~1 s end‑to‑end – acceptable for cooking pace |

---

## 5  | Code & framework pointers

* **Embedding:**

  * *OpenAI `text-embedding-3-small`* for < 700 tokens chunks (0.0001 \$/1k tokens).
  * On‑device alternative: Apple’s *`SentenceTransformers-Swift`* port (DistilBERT) for privacy.
* **Vector store client:**

  * Pinecone Swift SDK (`pinecone-client-swift`) or gRPC calls.
  * If on‑device: `SQLite.swift` + the `vss0` (vector‑similarity‑search) extension.
* **Query builder:**

  * In SwiftUI `ViewModel`, inject environment objects: `cvState`, `voiceTranscription`, `recipeStep`.
  * Serialize to a text block and embed.
* **LLM call:**

  * Gemini 2.5 multimodal endpoint: send retrieved passages + optional camera thumbnail as `model_input`.
  * Fallback: GPT‑4o with functions to handle “overlay\_action” vs “speak\_only”.
* **Caching:**

  * Cache embeddings for repeated queries within a session (`NSCache`).
  * Pre‑fetch top 2 passages for the *next* recipe step while the user works on the current one.

> Open‑source inspirations: **ChefAssistAI** and **Cook‑Assistant** both show RAG pipelines for culinary chatbots. ([medium.com][3], [github.com][4])

---

## 6  | Guardrails & UX considerations

| Challenge                  | Mitigation                                                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Incorrect or unsafe advice | RAG grounds answers in vetted passages; additionally, run a **safety filter** on LLM output (must not suggest raw‑chicken consumption, etc.).       |
| Latency feels long         | Pre‑fetch likely passages (next step), stream TTS as soon as first tokens arrive; show a “thinking” ear icon so silence is not confused with crash. |
| On‑device index size       | Store only user‑specific docs locally; compress embeddings (float16) to cut size in half; periodically prune least‑used vectors.                    |
| Privacy                    | Keep session frames only in RAM; send **blurred or down‑scaled** images to cloud; encrypt passage payloads.                                         |

---

## 7  | Phase‑in roadmap

| Phase              | Scope                                                                                                                                | Goal                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **v1.1**           | RAG only for *user‑uploaded recipes* (local vector DB).                                                                              | Fast import & Q/A over personal recipes.                      |
| **v1.2**           | Add curated “Cooking‑Science” corpus in cloud DB.                                                                                    | Up‑level technique explanations and substitution suggestions. |
| **v1.3**           | Vision‑aware RAG: convert CV events into retrieval queries (“burning smell”, “undercooked steak”).                                   | Expert‑like, context‑aware troubleshooting.                   |
| **v2.0 (premium)** | Full “agentic RAG” – LLM decides when to look up info vs. rely on prior context; supports plugin tools (e.g., nutrition calculator). | Differentiated premium tier.                                  |


# iOS AI Cooking Assistant

**Product Design Document – Gemini‑Only / No‑Local‑ML Revision**

> **Revision scope**
>
> * All computer‑vision and embedding work is off‑loaded to **Gemini 2.5 Pro** (multimodal) at ≈ 1 FPS.
> * **No custom machine‑learning models run on the device**—zero Core ML, no on‑device embeddings.
> * The vector store for Retrieval‑Augmented Generation is **ChromaDB** (self‑hosted or Chroma Cloud).
> * All other sections (UX flow, MCP, monetization, etc.) remain as previously specified unless explicitly changed below.

---

## 1   Updated Architecture

```
┌─────────────── iPhone ───────────────┐
│  ARKit Camera Preview (720p)         │
│  • capture 1 frame / second          │
│  • down‑scale & JPEG‑compress        │
│                                      │
│  Voice Input   ──►  Cloud STT (Google Speech v3) │
│                                      │
│          ┌─ HTTPS ──► Gemini 2.5 Pro ◄─┐
│          │  • ingredient detection     │
│          │  • action/state analysis    │
│          │  • text embeddings          │
│          │  • Q‑and‑A w/ passages      │
│          └─────────────────────────────┘
│                                      │
│  RAG Client │ queries                │
│             ▼                        │
│         ChromaDB (AWS Fargate)       │
│             ▲ passages               │
│                                      │
│  MCP Client ── timers / IoT / DBs    │
│                                      │
│  Response Composer ──► TTS (AVSpeech)│
│  + AR Overlays (ARKit)               │
└──────────────────────────────────────┘
```

### Key points

* **Vision & reasoning** – Each 1 FPS frame is sent to Gemini 2.5 Pro with a prompt like *“Identify all visible ingredients and assess current cooking progress.”*
* **Embeddings** – Gemini’s text‑embedding endpoint converts recipe chunks & user queries to vectors; those vectors are written/read from **ChromaDB**.
* **ChromaDB** – Runs as a micro‑service (containerised) in the same VPC as the Gemini gateway to minimise latency.
* **No fallback** – If the network is unavailable, the assistant gracefully downgrades to audio‑only static instructions (no CV feedback or Q‑and‑A).
* **On‑device logic** = UI, recipe state machine, MCP client, TTS (system‑provided; acceptable under “no custom ML”). All model inference happens in the cloud.

---

## 2   How RAG Works with ChromaDB

1. **Index build (offline / initial load)**

   * Break each recipe or reference document into ≤ 256‑token chunks.
   * Call `gemini:generate-embedding` → receive 768‑D vector.
   * `chroma_client.add(doc_id, chunk_id, vector, metadata)`.

2. **Run‑time retrieval**

   ```swift
   let queryText = "\(currentStep) \(cvObservation) \(userQuestion)"
   let qVec = gemini.embed(text: queryText)
   let passages = chroma.query(
       vector: qVec,
       top_k: 4,
       filter: ["tier":"public"|"user"]
   )
   ```

3. **Prompt assembly & Gemini chat**
   Passages + current context → Gemini chat endpoint (function‑calling enabled).
   Gemini may output an **MCP tool call** (`timer.start`, `iot.oven.setTemp`, etc.) or direct answer text.

4. **Latency**

   * Embed: \~30 ms (network)
   * Chroma search: \~50 ms (vector index in‑memory)
   * Gemini chat: 600–800 ms
   * TTS streaming starts at first token → perceived delay ≤ 1 s.

---

## 3   Module Changes

| Module            | Before                      | **Now**                                                |
| ----------------- | --------------------------- | ------------------------------------------------------ |
| **Vision Engine** | Core ML fallback + Gemini   | **100 % Gemini 2.5 Pro**; device only captures frames. |
| **Embeddings**    | Local or OpenAI             | **Gemini embedding API only** (remote).                |
| **Vector DB**     | Pinecone + SQLite‑vss       | **ChromaDB** (container or Chroma Cloud).              |
| **STT**           | On‑device Apple STT         | **Cloud Google Speech v3** (no local ML).              |
| **TTS**           | AVSpeechSynthesizer (local) | *Retained* – considered OS service, not custom ML.     |
| **Offline Mode**  | Local guidance + limited CV | **Audio‑only; no CV, no Q‑and‑A**.                     |

---

## 4   Revised Data‑Flow for a Single Step

1. **Instruction** – App speaks step N via TTS.
2. **Frame capture** – At t+1 s phone sends a JPEG frame → Gemini image‑analysis prompt.
3. **Gemini response** – JSON: `{ "objects":[…], "action":"stirring", "issues":[] }`.
4. **Query build** – Combine instruction + Gemini findings + any user vocal query.
5. **Embedding** – Gemini embedding API.
6. **Chroma query** – Top‑k passages returned.
7. **Gemini chat** – Grounded answer + (optional) MCP call.
8. **Execute** – Timer set, overlay rendered, answer spoken.
9. **Loop** – Next 1‑second frame captured, repeat.

---

## 5   Updated Risk Table

| Risk                                 | Mitigation                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| **Cloud dependency (no offline CV)** | Inform user; degrade gracefully to audio‑only.                                         |
| **Latency spikes**                   | Co‑locate ChromaDB and Gemini in same region; batch frame uploads on 1 FPS schedule.   |
| **Cost overruns**                    | 1 FPS cap; compress images; throttle Q‑and‑A for free users.                           |
| **Privacy**                          | Down‑scale frames (e.g., 640 × 480), strip EXIF, TLS in transit; no storage on server. |

---

## 6   ChromaDB Deployment Notes

| Option                          | Pros                           | Cons                               |
| ------------------------------- | ------------------------------ | ---------------------------------- |
| **Self‑hosted (Fargate / GKE)** | Full control, data residency   | DevOps overhead                    |
| **Chroma Cloud**                | Zero maintenance, auto‑scaling | Usage‑based pricing, external SaaS |

* Index fits comfortably in RAM for ≤ 50 k recipe chunks (< 1 GB vectors).
* Use **HNSW** index type; `metric="cosine"`; **namespace** split (`public`, `user`).

---

## 7   Open Items

1. **Speech‑to‑Text provider** – If “no local ML” extends to TTS, swap AVSpeech→Google TTS.
2. **Bandwidth ceiling** – 1 FPS @ 720p ≈ 300 KB/s; acceptable on Wi‑Fi, add cellular warning.
3. **Chroma auth** – Implement signed JWT per device; rotation every 24 h.
4. **Fallback recipes** – Pre‑bundle static text in app so cooking remains possible offline.

---

### Signed‑off Revision

All local ML components have been removed; computer‑vision, embeddings, and retrieval now rely exclusively on **Gemini 2.5 Pro** + **ChromaDB**.