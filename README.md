# Sync Pro - Team Collaboration Workspace

Public repository: https://github.com/jagadeeshodayar-dev/Team-collab-Tool

Live deployment: https://team-collaboration-tool-f1169.web.app

## Chosen Vertical

Sync Pro targets team collaboration and workflow coordination for product, engineering, and operations teams. The app focuses on the daily work loop: plan tasks, assign owners, track progress, coordinate with teammates, read notifications, and use AI to identify risks or next actions.

## Approach And Logic

The solution is built as a React + Vite single page application with a local workspace data model. The UI uses a dashboard-first layout with a fixed desktop sidebar, mobile bottom navigation, and Poppins-based brand styling. Recharts powers the analytics view, Firebase powers hosting and app initialization, and Google Gemini powers the AI assistant.

The app uses a context-driven workspace store in `src/context/WorkspaceContext.tsx` and `src/hooks/useWorkspaceData.ts`. Workspace data is persisted in `localStorage` so users can refresh without losing tasks, notifications, team chats, settings, or AI chat history. Seed data remains available as a fallback through `src/data/workspaceSchema.ts`.

## How The Solution Works

- Login creates a local user session.
- Dashboard summarizes tasks, progress, active members, and critical work.
- Workflows lets users create tasks, assign owners, update status, update progress, and add comments.
- Assignment, progress, comments, and chat actions create notifications.
- Directory shows team workload and per-member chat threads.
- Notifications can be marked read, cleared, and reviewed from the header bell.
- AI History stores persistent Gemini chat conversations.
- Syncro AI receives workspace context including tasks, owners, progress, notifications, team members, and chat count.
- Global search in the header finds tasks, people, notifications, and AI conversations.
- Guide page explains how to use the app.
- Export downloads the current workspace state as JSON.

## Google Services Integration

- Google Gemini API via `@google/genai`
  - Primary model: `gemini-2.5-flash`
  - Fallback model: `gemini-2.0-flash`
  - Used for workspace-aware planning, risk analysis, ownership guidance, and workflow suggestions.
- Firebase
  - Firebase JavaScript SDK initialization in `src/lib/firebase.ts`.
  - Firebase Hosting deployment with `firebase.json`.

## Security Notes

- Secrets are loaded from environment variables and `.env` is ignored by Git.
- The browser build uses `VITE_GEMINI_API_KEY` because Vite only exposes variables prefixed with `VITE_`.
- This prototype uses local browser persistence, not a production database or server-side auth.
- For production, Gemini calls should be proxied through a server endpoint so API keys are never shipped to the browser.

## Assumptions

- This is a frontend prototype intended for review and demonstration.
- Local persistence is acceptable for the submitted version.
- Seed data acts as fallback data when no saved workspace exists.
- Firebase Hosting is the deployment target.
- The user has a valid Gemini API key enabled for Gemini models.

## Testing And Validation

Validation commands:

```bash
npm run lint
npm run build
```

Manual validation performed:

- Login flow opens the workspace.
- Header search returns results across tasks, people, notifications, and AI history.
- Workflow task creation works.
- Task assignment works.
- Progress and status updates work.
- Task comments create notifications.
- Team member chat creates persistent messages and notifications.
- Notifications can be marked read and cleared.
- AI chat persists into AI History.
- Export downloads workspace JSON.
- Firebase Hosting deploy succeeds.

## Accessibility And UX

- Semantic buttons and form inputs are used throughout the app.
- Icon buttons include accessible labels where needed.
- Layout is responsive across desktop and mobile.
- Mobile uses bottom navigation for reachable thumb access.
- Color is paired with text labels for status clarity.
- Motion is limited to the dashboard hero and AI drawer.

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
VITE_GEMINI_API_KEY=your_gemini_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Deploy to Firebase Hosting:

```bash
npx firebase deploy --only hosting
```

## Project Structure

```text
src/
  components/          UI screens and product surfaces
  context/             Workspace provider
  data/                Seed schema and fallback data
  hooks/               Persistent workspace actions
  lib/                 Firebase and utility helpers
  types.ts             Shared TypeScript contracts
```

## Brand Guidelines

See `BRAND_GUIDELINES.md` for typography, color, layout, and motion rules.
