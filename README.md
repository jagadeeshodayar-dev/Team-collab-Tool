# Syncro - Team Coordination Platform

Syncro is a high-performance, AI-integrated platform designed to simplify team workflows and enhance task visibility. This prototype demonstrates a complete "Operations Center" for modern engineering and product teams.

## Chosen Vertical: Team Coordination & Communication
Designed for fast-moving product teams that need real-time data visibility, structured task management, and intelligent assistance.

## Key Features
- **Operations Center (Dashboard)**: Real-time analytics tracking workflow velocity and task allocation using Recharts.
- **Workflow Pipeline (Kanban)**: A specialized task board designed for clarity and scannable status updates.
- **Cortex Sub-Routine (Syncro AI)**: A built-in assistant powered by Google Gemini (gemini-3-flash-preview) to analyze workflows and provide insights.
- **Broadcast System**: A unified notification feed for team-wide event tracking.
- **Personnel Directory**: Comprehensive node management (team member tracking).

## Approach and Logic
- **Architecture**: A React-based Single Page Application (SPA) with a modular component structure.
- **Styling**: Leverages Tailwind CSS 4.0 with custom theme variables. 
- **Responsive Design**: Uses `em` for component-level spacing and `vw` for large-scale typography to ensure consistent visual hierarchy across all devices.
- **Aesthetic**: "Technical / Data Grid" mood with a neon-accented dark palette, visibility into system structures through grid lines, and a high-energy "brand line" design.
- **AI Integration**: Uses Gemini to process natural language queries about team coordination, providing a "smart assistant" layer on top of the raw data.

## Implementation Details
- **Responsive Scaling**: The `display-title` component uses `clamp` with `vw` units to dominate the screen on large displays while scaling gracefully on mobile.
- **Custom Spacing**: All major UI containers use `em` units, ensuring that padding and margins scale proportionally with the local font size.
- **Data-Driven**: The platform is built around a centralized state model (mockData), simulating a real-world SaaS environment.

## Assumptions
- Assumes a "Standard" environment where Gemini API keys are provided via biological/environment injection (`process.env.GEMINI_API_KEY`).
- Assumes the user prioritizes information density and technical scannability.

---
Built with Google AI Studio Build.
