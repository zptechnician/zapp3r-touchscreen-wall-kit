# Zapp3r Partner Wall Kit: Self-Hosted Interactive Display Engine

Zapp3r Partner Wall Kit is a logic-driven React framework designed to transform any touchscreen into a professional, multi-collection interactive wall. Built for high-stakes environments, it replaces static presentations with a performance-optimized, self-hosted experience that is entirely driven by data.

## The Solution

Quickly deploy interactive "Sponsor," "Partner," or "Customer" walls. This engine handles the routing, layout, and interaction logic so you can focus on the content.

## Core Features

- **Dual-Collection Engine**: Supports multiple "Walls" within a single deployment. Toggle between distinct visual themes (e.g., a Light Partner Grid and a Dark Customer Grid) instantly.
- **The "T-Layout" Standard**: A professional-grade detail page template featuring a horizontal header, full-width hero image, and a split-column data view.
- **Inferred Content Flow**: Designed for clean aesthetics, the engine renders primary lead-in text directly under the visual assets without redundant headers, following professional deck architecture.
- **JSON-First Logic**: Every brand, image, and text block is managed via a single manifest. Non-technical users can update the entire display by editing a text file.
- **Hardware-Ready Performance**: Optimized for local-area network hosting with multi-stage container support for instant load times on physical hardware.

## Architecture

- **Grid System**: Responsive, touch-optimized grids (3-column or 2-column) designed for clear thumb-targets.
- **Navigation**: Manual, state-aware "Back" functionality that preserves the user's path between different collections.
- **Asset Hygiene**: Built-in support for optimized WebP imagery to ensure zero-lag scrolling and transitions.

## Quick Start

1. **Clone**: Pull the repository to your local display server.
2. **Configure**: Update the settings and entries in the central JSON manifest (`public/kiosk-data.json`).
3. **Deploy**: Run the self-hosted container to serve the static application locally.

```bash
docker build -t zapp3r-partner-wall-kit .
docker run -p 8080:80 zapp3r-partner-wall-kit
```

## Starter Kit Philosophy

This engine is provided as a "Sanitized Kit." All data fields are pre-populated with instructional placeholders (e.g., "This section is for measurable impact") to act as a content guide for your team.

---
*A Zapp3r Open Source Project*
