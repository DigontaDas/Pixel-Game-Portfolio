# Interactive 2D Top-Down RPG Portfolio - Task Tracker

## Phase 1: Planning & Architectural Design (Completed & Strictly Locked)
- [x] Analyze reference screenshot (`9fd389f6-d086-4d86-b1c8-ea9d25a0d230.jpg`) and map structure <!-- id: 1-1 -->
- [x] Audit `Pixel Crawler - Free Pack` assets (Body_A animations, Interior tiles, Furniture, Props, Stations) <!-- id: 1-2 -->
- [x] Parse exact CV credentials, skills, experience, and awards from `Digonta_CV.pdf` <!-- id: 1-3 -->
- [x] Remove SAW and C++; strictly align with the 10 provided GitHub project repositories <!-- id: 1-4 -->
- [x] Architect Enterable Multi-Section Main House with 10 Project Stations (5 Medical AI & 5 Full-Stack/AI Systems) <!-- id: 1-5 -->
- [x] Architect Cave of Relics with 4 Precious Gemstones for certificates & achievements <!-- id: 1-6 -->
- [x] Architect Village Social Houses (GitHub Forge & LinkedIn Embassy) <!-- id: 1-7 -->
- [x] Architect Dynamic Skill Light-Up system linked to CV skills hotbar <!-- id: 1-8 -->
- [x] RPG Knight Health Bar: Level 24 Vitality (100% HP, 8 full glowing red heart containers; completely removed 75-year lifespan math) <!-- id: 1-9 -->
- [x] Full Paladin Knight Character Model: Plate armor, broadsword in hand, heraldic shield on back, combat slashing, jumping, and sprinting <!-- id: 1-10 -->
- [x] Enterable Emerald Manor House with reliable doorway and interior foyer <!-- id: 1-11 -->
- [x] Grand 16-bit Mountain Cliff Backdrop framing the Cavern of Relics <!-- id: 1-12 -->
- [x] Sir Valen Gate Knight NPC at South Boulevard <!-- id: 1-13 -->
- [x] Final architecture reviewed and approved <!-- id: 1-14 -->

## Strict 10 Projects Directory Matrix
1. **Efficient 3D Tiled CNN Architecture** (Primary Thesis: Coronary Artery Block Detection) — `https://github.com/DigontaDas/Efficient-3D-Tiled-CNN-Architecture.git`
2. **Dhaka Tesla Pool** (Distributed EV Ride-Pooling Backend Engine) — `https://github.com/DigontaDas/Dhaka-Tesla-Pool.git`
3. **MaSheba AI** (Offline Maternal Health Platform, Infinity AI Finalist) — `https://github.com/DigontaDas/MaSheba--AI.git`
4. **Clarity** (B2B Supply Chain Finance Platform & KYB Verification Vault) — `https://github.com/DigontaDas/Clarity.git`
5. **OT Pre-Surgical Safety Gate** (Clinical Safety Automation & Checklist Verification) — `https://github.com/DigontaDas/OT-Pre-Surgical-Safety-Gate`
6. **Skin Disease AI** (Dermatology Diagnostic CNN) — `https://github.com/DigontaDas/Skin_Disease_AI.git`
7. **Movie Recommendation AI** (RAG Pipeline with ChromaDB & LLaMA) — `https://github.com/DigontaDas/Movie-Recommendation-AI.git`
8. **Hybrid Model on Efficient SE-Net** (Cross-Vendor Cardiac MRI Segmentation) — `https://github.com/DigontaDas/Hybrid-Model-on-Efficient-SE-Net.git`
9. **Brain Tumor Classification & Segmentation** (Multi-Modal MRI Analysis) — `https://github.com/DigontaDas/Brain-Tumor-Classification-Segmentation-Project.git`
10. **REMEDY** (Smart Healthcare Triage & Recommendation Engine) — `https://github.com/DigontaDas/REMEDY.git`

## Phase 2: Project Setup & Engine Boilerplate (Completed)
- [x] Initialize project with Vite + Phaser 3 (ESM configuration) <!-- id: 2-1 -->
- [x] Set up asset directories and serve `Pixel Crawler` spritesheets & certificates in `public/` <!-- id: 2-2 -->
- [x] Configure Phaser 3 pixel-art rendering (`pixelArt: true`, `roundPixels: true`, custom retro font) <!-- id: 2-3 -->
- [x] Implement Web Audio 8-bit procedural sound synthesizer (footsteps, inspect, portal whoosh, skill glow chime, close chirps) <!-- id: 2-4 -->

## Phase 3: Asset Loading & Animation Pipeline (Completed)
- [x] Build `BootScene` and `PreloadScene` with retro progress bar <!-- id: 3-1 -->
- [x] Load 64x64 player sprite sheets (`Idle_Down`, `Idle_Side`, `Idle_Up`, `Run_Down`, `Run_Side`, `Run_Up`) <!-- id: 3-2 -->
- [x] Create 4-direction animations with horizontal flipping for left movement <!-- id: 3-3 -->
- [x] Load solid grass, dirt road tiles, pine trees, composite buildings, and stations <!-- id: 3-4 -->
- [x] Load handcrafted 1280x1280 interior map (`Tavern.png`) for Digonta's Manor <!-- id: 3-5 -->
- [x] Generate glowing gemstone crystal textures (Diamond, Emerald, Sapphire, Amethyst) <!-- id: 3-6 -->

## Phase 4: World Construction & Dual-Zone Architecture (Completed)
- [x] **Exterior Village Scene**:
  - Build lush cozy village layout with seamless grass and earth boulevards <!-- id: 4-1-1 -->
  - Place Enterable Main Manor House with open doorway portal sensor at north <!-- id: 4-1-2 -->
  - Place GitHub Forge with anvil & furnace and LinkedIn Embassy with blue roof <!-- id: 4-1-3 -->
  - Place North/West Cavern of Relics with 4 glowing gemstone shrines <!-- id: 4-1-4 -->
  - Place Town Square with Elder Scholar NPC and village well <!-- id: 4-1-5 -->
  - Configure Arcade Physics static bounding boxes (walls, fences, trees, rocks) <!-- id: 4-1-6 -->
- [x] **Interior Main House Scene**:
  - Handcrafted interior map (`Tavern.png`) divided into themed wings:
    - West Wing: Medical AI & Computer Vision Lab (Projects 1, 8, 9, 6, 5) <!-- id: 4-2-1 -->
    - East Wing: AI Systems, Healthcare & Full-Stack Platform Studio (Projects 3, 10, 4, 7, 2) <!-- id: 4-2-2 -->
    - Southern Staircase: Entrance/Exit mat returning smoothly to village square <!-- id: 4-2-3 -->
  - Position 10 interactive project tables aligned with real furniture and holographic orbs <!-- id: 4-2-4 -->
- [x] Smooth scene transitions with camera fade-out / fade-in and audio portal swoosh <!-- id: 4-3 -->
- [x] Player physics controller with 16x10 foot collision box for fluid movement <!-- id: 4-4 -->
- [x] Smooth camera follow with zoom (2.2x-2.3x) and world boundaries <!-- id: 4-5 -->

## Phase 5: Player Controller & Proximity Trigger Engine (Completed)
- [x] 8-directional movement with normalized diagonal velocity (WASD & Arrow Keys) <!-- id: 5-1 -->
- [x] Directional animation state machine (Idle vs Running for 4 directions) <!-- id: 5-2 -->
- [x] Spatial proximity sensors for:
  - 10 Project Tables inside the Main House <!-- id: 5-3-1 -->
  - 4 Gemstone Relics at the Ancient Cave <!-- id: 5-3-2 -->
  - GitHub & LinkedIn Social Houses <!-- id: 5-3-3 -->
  - Town Square Elder Scholar NPC <!-- id: 5-3-4 -->
- [x] Floating interactive badge (`[E] Inspect` / `[E] Read Project`) <!-- id: 5-4 -->

## Phase 6: Interactive Skills Bar & Dynamic Lighting Mechanism (Completed)
- [x] Bottom HUD Skill Hotbar displaying all technical skills categorized from CV:
  - Deep Learning (PyTorch, TensorFlow, 3D CNN, U-Net, ONNX, XGBoost)
  - Vision & NLP (Segmentation, HU Normalization, RAG, Sentence Transformers, LLMs)
  - Backend & Infra (FastAPI, Node.js, Express.js, Docker, GitHub Actions)
  - Databases (PostgreSQL, Supabase, ChromaDB, SQLite)
  - Languages (Python, JavaScript, C, Kotlin)
- [x] Reactive lighting engine: Approaching any of the 10 project tables illuminates the exact skills used in that project with golden pulsing glow, elevated shadow, and chime SFX <!-- id: 6-2 -->
- [x] Stepping away smoothly restores skills to neutral state <!-- id: 6-3 -->

## Phase 7: In-Website Modals & HUD Overlays (Completed)
- [x] Top HUD Bar:
  - RPG Knight Vitality Meter (Age: 24 | 100% HP with 8 full glowing red heart containers) <!-- id: 7-1-1 -->
  - Interactive Project Counter with clickable drawer listing all 10 projects <!-- id: 7-1-2 -->
  - Interactive Relics Counter with clickable drawer listing all 4 certificates <!-- id: 7-1-3 -->
  - One-click GitHub & LinkedIn quick access buttons <!-- id: 7-1-4 -->
  - Sound Toggle & Controls Modal <!-- id: 7-1-5 -->
  - Instant CV Download button (`Digonta_CV.pdf`) <!-- id: 7-1-6 -->
- [x] In-Website Project Details Modal:
  - Detailed overview for each of the 10 projects, architecture highlights, tech tags, and verified GitHub link <!-- id: 7-2-1 -->
- [x] In-Website Certificate & Award Lightbox:
  - Full-resolution dual image viewer for EduPro (Round 1 & 2) <!-- id: 7-3-1 -->
  - Full-resolution image viewer for Infinity AI BuildFest 2026 Finalist <!-- id: 7-3-2 -->
  - Direct PDF certificate download and preview for DataCamp <!-- id: 7-3-3 -->
- [x] In-Website Socials & Bio Modal:
  - GitHub profile stats card & LinkedIn connect modal <!-- id: 7-4-1 -->
- [x] Bi-directional Game <-> DOM Bridge:
  - Freeze player movement during modal display <!-- id: 7-5-1 -->
  - ESC key, close button, and backdrop click dismissal <!-- id: 7-5-2 -->

## Phase 8: Verification & Production Polish (Completed)
- [x] Verified collision boundaries in village and house interior <!-- id: 8-1 -->
- [x] Verified all 10 GitHub links, project modal contents, and tags <!-- id: 8-2 -->
- [x] Verified certificate image modal previews <!-- id: 8-3 -->
- [x] Verified dynamic skill lighting triggers for each of the 10 projects <!-- id: 8-4 -->
- [x] Verified life bar calculation (July 3, 2002 -> Age 24 / 75 years = 32.0%) <!-- id: 8-5 -->
- [x] Tested production build with `vite build` (completed in <1s with 0 errors) <!-- id: 8-6 -->

## Phase 9: Cave Guardian Villain, Witch CV Auto-Download, Emerald Manor Exterior & Hero Character (Completed)
- [x] **Hero Character with Sword & Hero Body (Matching Image 2)**:
  - Composited spiky adventurer hair, athletic hero physique, khaki tunic with leather trim, belt with silver buckle, adventurer trousers, boots, green eyes, and silver broadsword sheathed across back <!-- id: 9-1-1 -->
  - Generated all 6 directional sprite sheets (`Idle_Down`, `Idle_Side`, `Idle_Up`, `Run_Down`, `Run_Side`, `Run_Up`) in `public/assets/characters/hero/` <!-- id: 9-1-2 -->
- [x] **Cave Sentinel Villain (Malakor the Boss Guardian)**:
  - Placed Orc Warrior guardian (`mob_orc_warrior`) at the entrance of the Cavern of Certification <!-- id: 9-2-1 -->
  - Animated idle with battle greataxe and armored helm <!-- id: 9-2-2 -->
  - Confrontation modal where Malakor acknowledges Digonta Das's credentials (DataCamp, Infinity AI Buildfest, EduPro, BRACU) and opens the sanctuary to inspect the 4 gemstone shrines <!-- id: 9-2-3 -->
- [x] **Witch Morgana (Automatic CV Conjurer & Downloader)**:
  - Placed Witch Morgana (`npc_witch`) beside an alchemy cauldron station in the village grove <!-- id: 9-3-1 -->
  - Proximity interaction: `[E] Ask Witch Morgana for CV` <!-- id: 9-3-2 -->
  - Automatically triggers the browser download of `Digonta_CV.pdf` (`Digonta_Das_CV.pdf`) upon interaction <!-- id: 9-3-3 -->
  - Displays arcane parchment dialog modal with lore, key credentials, and a re-download action <!-- id: 9-3-4 -->
- [x] **Emerald Manor Exterior (Matching Image 2)**:
  - Generated `house_manor_emerald.png` with emerald/teal green roof tiles, gabled attic dormer with timber lattice window, left tower with shuttered window and flower planter box, cream stucco & brick wainscot, arched wooden entrance door with stone surround, and covered front porch with two wooden round pillars <!-- id: 9-4-1 -->
  - Integrated into `VillageScene.js` with entrance portal sensor at the arched door steps <!-- id: 9-4-2 -->
- [x] **Tavern Interior Matching Image 1**:
  - Maintained handcrafted `Tavern.png` layout with 10 project tables mapped to real furniture <!-- id: 9-5-1 -->
  - Added Tavern NPCs: Kitchen Algorithm Chef, Master Innkeeper behind the bar, and Bedroom Guest Researcher with rich contextual dialogue <!-- id: 9-5-2 -->

