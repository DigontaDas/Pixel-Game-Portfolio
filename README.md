https://pixel-game-portfolio-nine.vercel.app/
https://digonta-das.vercel.app/

# Digonta Das | Interactive 16-Bit RPG Portfolio

An interactive, gamified 2D top-down RPG developer portfolio built with **Phaser 4**, **Vite**, and **Vanilla JavaScript/CSS**. Explore an open medieval fantasy realm, tour research laboratories, inspect AI/ML and full-stack projects, sparring with training dummies, and interact with characters to review credentials and roadmaps.

---

## Live Demo & Links

- **Main Portfolio (3D)**: [digonta-das.vercel.app](https://digonta-das.vercel.app/)
- **Interactive RPG Portfolio**: [digontadas.github.io/Pixel-Game-Portfolio](https://digontadas.github.io/Pixel-Game-Portfolio/)
- **RPG Portfolio Source**: [GitHub repository](https://github.com/DigontaDas/Pixel-Game-Portfolio)

---

## World Map & Exploration Zones

### 1. Village Square & Manor Grounds (Exterior World)
- **Digonta's Emerald Manor**: Central estate with 10 interactive project research labs inside.
- **The Cavern of Relics**: Stone shrine guarded by Sentinel Malakor, displaying academic credentials and competition awards.
- **The GitHub Forge**: Blacksmith workshop linking directly to open-source code repositories (`@DigontaDas`).
- **The LinkedIn Embassy**: Guildhall dedicated to professional connections and network inquiries.
- **Botanical Sanctuary & Town Well**: Decorative water features, swaying flora, and wind-blown pollen particles.

### 2. Manor Interior & Research Labs
- **Medical AI Laboratory (West Wing)**:
  - 3D Tiled CNN (Undergrad Thesis - Volumetric Scans)
  - OT Safety Gate (IoT & Hospital Safety)
  - SE-Mobile UNet (Edge Segmentation)
  - Brain Tumor Segmentation (Multi-Modal MRI)
  - Skin Disease Diagnosis (Dermatological AI)
  - Algorithm Chef NPC with research breakdown.
- **Grand Hall & Systems Studio (East Wing)**:
  - MaSheba Maternal Health Platform (Offline-First Edge Inference)
  - REMEDY Healthcare Scheduling & Triage System
  - Clarity Enterprise Analytics Engine
  - Movie Recommendation Engine (LangChain RAG)
  - Dhaka Tesla Pool (Real-time Ride Dispatch Simulator)
  - Master Innkeeper NPC and Visiting Researcher NPC.
- **Elevated Second Floor**:
  - VIP dining room accessible via staircase.

---

## Controls & Movement System

| Key / Input | Action | Description |
| :--- | :--- | :--- |
| **W, A, S, D** or **Arrow Keys** | **Move Hero** | 8-directional movement with diagonal normalization |
| **Shift** (Hold) | **Sprint** | Increases movement speed from 135 to 215 px/s |
| **E** | **Interact** | Open stations, talk to NPCs, view projects/credentials |
| **Left-Click** | **Sword Slash** | Knight combat attack with sword hitboxes and sound FX |
| **Space** | **Jump** | Physics-grounded visual jump arc with dynamic shadow scaling |
| **Escape** | **Close Modal** | Closes any open dialog, modal, or welcome portal |

> **Movement Engine Feature**: Built with a dedicated hardware key-state arbiter (`activeKeyCodes`), guaranteeing keys never get stuck or repeat phantom movements even during window blur or tab changes.

---

## Technology Stack

- **Game Engine**: [Phaser 4](https://phaser.io/) (`phaser` v4.2.1)
  - Canvas / WebGL rendering
  - Arcade Physics with discrete foot hitboxes
  - Dynamic Y-sorting depth system
  - Camera tracking with smooth lerp and easing
- **Build Tool & Bundler**: [Vite](https://vitejs.dev/) (`vite` v8.3.1)
  - Fast Hot Module Replacement (HMR)
  - Optimized production bundling
- **UI & Modals**: Pure Vanilla JavaScript (ES6 Modules) & Custom CSS3
  - Zero heavy UI frameworks (no React/Vue overhead) for instant 60 FPS loading
  - Retro glassmorphism, responsive dialog cards, matte slate credential pills
- **Audio Engine**: Web Audio API
  - Procedural 8-bit sound effects (footsteps, sword slashes, menu chime) synthesized in real time
  - Background music system with user audio unlock
- **Typography**: Google Fonts
  - `Press Start 2P` (Authentic 16-bit headings)
  - `Plus Jakarta Sans` (Clean, high-legibility UI text)

---

## Step-by-Step Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- `npm` (bundled with Node.js) or `pnpm` / `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/DigontaDas/Pixel-Game-Portfolio.git
cd Pixel-Game-Portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000/` (or the port displayed in your terminal).

### 4. Build for Production
```bash
npm run build
```
Production assets will be generated in the `dist/` directory.

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## Step-by-Step Deployment Guide

### Option 1: GitHub Pages (Automatic via GitHub Actions) - Recommended

This repository is pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages** (under Code and automation).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every commit pushed to `main` will automatically build and publish your game portfolio to `https://<username>.github.io/Pixel-Game-Portfolio/`.

### Option 2: Deploy to Vercel (1 Click)

1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Select `Pixel-Game-Portfolio` from your repositories.
4. Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will give you a live production URL instantly.

### Option 3: Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com/) and log in.
2. Click **Add new site** > **Import an existing project**.
3. Connect your GitHub repository `Pixel-Game-Portfolio`.
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy Pixel-Game-Portfolio**.

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── assets/                 # Game sprite sheets, tiles, audio, environment
│   ├── Digonta_CV.pdf          # Official Resume / CV PDF
│   └── portfolio.png           # 16-bit Pokémon trainer profile card
├── src/
│   ├── main.js                 # Phaser game bootstrapper & config
│   ├── scenes/
│   │   ├── BootScene.js        # Minimal pre-loader
│   │   ├── PreloadScene.js     # Asset loading & animation factory
│   │   ├── VillageScene.js     # Exterior open world & landmarks
│   │   └── HouseScene.js       # Manor interior, research labs, stairs
│   ├── systems/
│   │   ├── AudioManager.js     # Web Audio API sound generator & BGM
│   │   ├── GameBridge.js       # Event emitter decoupling Phaser from DOM
│   │   └── PortfolioData.js    # Data matrix for all 10 projects & certs
│   └── ui/
│       ├── HUD.js              # Overlay HUD, audio toggle, social buttons
│       └── ModalManager.js     # Welcome portal, project dialogs, email form
├── index.html                  # HTML entry point with typography
├── style.css                   # Custom UI styling & retro theme
├── vite.config.js              # Vite configuration
└── package.json                # Project dependencies and scripts
```

---

## Author & Contact

**Digonta Das**  
*AI Engineer & Full-Stack Developer*  
BRAC University CSE Graduate  
Specialist in Volumetric 3D CNNs, Deep Learning, and Distributed Cloud Systems.

- **Email**: [digontadas0171@gmail.com](mailto:digontadas0171@gmail.com)
- **LinkedIn**: [linkedin.com/in/digonta-das-b54130282](https://linkedin.com/in/digonta-das-b54130282)
- **GitHub**: [@DigontaDas](https://github.com/DigontaDas)
