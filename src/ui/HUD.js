import { GameBridge, EVENTS } from '../systems/GameBridge.js';
import { AudioFX } from '../systems/AudioManager.js';
import { PERSONAL_INFO, SKILLS_CATALOG, PROJECTS_MATRIX, CERTIFICATES_MATRIX } from '../systems/PortfolioData.js';

export class HUD {
  constructor() {
    this.discoveredProjects = new Set();
    this.inspectedRelics = new Set();
    this.currentLocation = "Village Square";
    this.activeSkills = new Set();

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    const container = document.createElement('div');
    container.id = 'rpg-hud-root';
    container.innerHTML = `
      <!-- TOP STATUS & RESOURCE BAR -->
      <header class="hud-top-bar">
        <!-- KNIGHT HEALTH & AGE BAR -->
        <div class="hud-widget life-health-widget" title="Knight Level & Age: 24">
          <div class="widget-header">
            <span class="widget-label">HP</span>
            <span class="life-calc-text" id="life-stats-label">AGE: 24</span>
          </div>
          <div class="heart-containers-row" id="heart-row">
            <!-- Dynamically generated hearts -->
          </div>
        </div>

        <!-- LOCATION BADGE -->
        <div class="hud-widget location-widget">
          <span class="loc-text" id="hud-location-text">Village Grounds</span>
        </div>

        <!-- PROGRESS STATS WITH QUICK ACCESS -->
        <div class="hud-widget counters-widget">
          <button class="stat-pill clickable-pill" id="toggle-projects-menu" title="Click to view all 10 Projects">
            <span class="stat-value" id="projects-counter">0 / 10 PROJECTS</span>
          </button>
          <button class="stat-pill clickable-pill" id="toggle-relics-menu" title="Click to view all 4 Relics & Certs">
            <span class="stat-value" id="relics-counter">0 / 4 CERTS</span>
          </button>
        </div>

        <!-- SOCIALS & UTILITIES -->
        <div class="hud-actions-group">
          <a href="${PERSONAL_INFO.socials.github}" target="_blank" rel="noopener noreferrer" class="hud-btn social-mini-btn" title="Visit GitHub (@DigontaDas)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="${PERSONAL_INFO.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="hud-btn social-mini-btn" title="Connect on LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="${PERSONAL_INFO.socials.cvFile}" download="Digonta_Das_CV.pdf" class="hud-btn cv-btn" title="Download Official PDF Resume">
            RESUME PDF
          </a>
          <button class="hud-btn contact-btn" id="open-welcome-modal-btn" title="Contact Digonta or view portfolio menu" style="background: rgba(255, 209, 102, 0.15); border-color: #ffd166; color: #ffd166; font-weight: 700;">
            CONTACT ME
          </button>
          <button class="hud-btn audio-btn" id="audio-toggle-btn" title="Toggle Sound">
            <span class="btn-icon" id="audio-icon">SOUND ON</span>
          </button>
        </div>
      </header>

      <!-- QUICK EXPLORER POPDOWN MENUS -->
      <div class="quick-menu-drawer hidden" id="projects-quick-menu">
        <div class="quick-menu-header">
          <span>ALL 10 PROJECTS (INSIDE MANOR)</span>
          <button class="quick-close-btn" id="close-proj-menu">✖</button>
        </div>
        <div class="quick-menu-grid">
          ${PROJECTS_MATRIX.map(p => `
            <div class="quick-item-card" data-project-id="${p.id}">
              <div class="q-item-top">
                <span class="q-station">#${p.stationNumber}</span>
                <span class="q-badge">${p.badge}</span>
              </div>
              <h5 class="q-title">${p.title}</h5>
              <p class="q-tagline">${p.tagline}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="quick-menu-drawer hidden" id="relics-quick-menu">
        <div class="quick-menu-header">
          <span>ALL 4 CERTIFICATES (CAVERN)</span>
          <button class="quick-close-btn" id="close-relic-menu">✖</button>
        </div>
        <div class="quick-menu-grid">
          ${CERTIFICATES_MATRIX.map(c => `
            <div class="quick-item-card relic-card" data-relic-id="${c.id}">
              <div class="q-item-top">
                <span class="q-station" style="color:${c.gemColor}">${c.gemType}</span>
                <span class="q-badge">${c.issuer}</span>
              </div>
              <h5 class="q-title">${c.title}</h5>
              <p class="q-tagline">${c.summary}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- LEFT SIDE: REACTIVE TECHNICAL ARSENAL & SKILLS -->
      <aside class="hud-left-skills" id="skills-panel">
        <div class="skills-sidebar-header">
          <span class="skills-sidebar-title">TECHNICAL ARSENAL</span>
          <span class="skills-sidebar-sub">Reacts to Project Labs</span>
        </div>
        <div class="skills-vertical-list" id="skills-hotbar">
          <!-- Dynamically populated skills -->
        </div>
      </aside>

      <!-- RIGHT SIDE: PROMINENT ENLARGED CONTROLS CARD -->
      <aside class="hud-controls-card" id="hud-controls-card">
        <div class="controls-card-header">
          <span class="controls-card-title">CONTROLS</span>
        </div>
        <div class="controls-card-body">
          <div class="control-card-row">
            <span class="key-pill-large">WASD / ARROWS</span>
            <span class="control-desc">Move Knight</span>
          </div>
          <div class="control-card-row">
            <span class="key-pill-large">SHIFT</span>
            <span class="control-desc">Sprint / Dash</span>
          </div>
          <div class="control-card-row">
            <span class="key-pill-large">SPACE / K</span>
            <span class="control-desc">Jump</span>
          </div>
          <div class="control-card-row">
            <span class="key-pill-large">J / F / CLICK</span>
            <span class="control-desc">Sword Attack</span>
          </div>
          <div class="control-card-row">
            <span class="key-pill-large">E / CLICK</span>
            <span class="control-desc">Interact / Inspect</span>
          </div>
        </div>
      </aside>
    `;

    document.body.appendChild(container);
    this.renderHearts();
    this.renderSkills();
    this.setupAudioButton();
    this.setupQuickMenus();
  }

  bindEvents() {
    GameBridge.on(EVENTS.PROJECT_DISCOVERED, (projectId) => {
      this.discoveredProjects.add(projectId);
      this.updateProjectCounter();
    });

    GameBridge.on(EVENTS.RELIC_INSPECTED, (relicId) => {
      this.inspectedRelics.add(relicId);
      this.updateRelicsCounter();
    });

    GameBridge.on(EVENTS.LOCATION_CHANGED, (locData) => {
      const locText = document.getElementById('hud-location-text');
      if (locText && locData) {
        locText.textContent = locData.title;
      }
    });

    GameBridge.on(EVENTS.HIGHLIGHT_SKILLS, (skillIds) => {
      this.highlightSkills(skillIds);
    });

    GameBridge.on(EVENTS.RESET_SKILLS, () => {
      this.resetSkills();
    });
  }

  setupQuickMenus() {
    const projBtn = document.getElementById('toggle-projects-menu');
    const relicBtn = document.getElementById('toggle-relics-menu');
    const projDrawer = document.getElementById('projects-quick-menu');
    const relicDrawer = document.getElementById('relics-quick-menu');

    const closeProj = document.getElementById('close-proj-menu');
    const closeRelic = document.getElementById('close-relic-menu');

    projBtn?.addEventListener('click', () => {
      relicDrawer?.classList.add('hidden');
      projDrawer?.classList.toggle('hidden');
      AudioFX.playInspect();
    });

    relicBtn?.addEventListener('click', () => {
      projDrawer?.classList.add('hidden');
      relicDrawer?.classList.toggle('hidden');
      AudioFX.playInspect();
    });

    closeProj?.addEventListener('click', () => {
      projDrawer?.classList.add('hidden');
    });

    closeRelic?.addEventListener('click', () => {
      relicDrawer?.classList.add('hidden');
    });

    document.getElementById('open-welcome-modal-btn')?.addEventListener('click', () => {
      AudioFX.playInspect();
      GameBridge.emit(EVENTS.OPEN_WELCOME_MODAL);
    });

    // Handle clicks on project cards inside drawer
    document.querySelectorAll('#projects-quick-menu .quick-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const pid = card.getAttribute('data-project-id');
        const proj = PROJECTS_MATRIX.find(p => p.id === pid);
        if (proj) {
          projDrawer.classList.add('hidden');
          AudioFX.playInspect();
          GameBridge.emit(EVENTS.OPEN_PROJECT_MODAL, proj);
        }
      });
    });

    // Handle clicks on relic cards inside drawer
    document.querySelectorAll('#relics-quick-menu .quick-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const rid = card.getAttribute('data-relic-id');
        const relic = CERTIFICATES_MATRIX.find(c => c.id === rid);
        if (relic) {
          relicDrawer.classList.add('hidden');
          AudioFX.playInspect();
          GameBridge.emit(EVENTS.OPEN_CERTIFICATE_MODAL, relic);
        }
      });
    });

    // Close drawers when clicking outside
    document.addEventListener('click', (e) => {
      if (projDrawer && !projDrawer.contains(e.target) && e.target !== projBtn && !projBtn.contains(e.target)) {
        projDrawer.classList.add('hidden');
      }
      if (relicDrawer && !relicDrawer.contains(e.target) && e.target !== relicBtn && !relicBtn.contains(e.target)) {
        relicDrawer.classList.add('hidden');
      }
    });
  }

  renderHearts() {
    const row = document.getElementById('heart-row');
    if (!row) return;

    // Knight Vitality & Level 24: 8 full glowing vector heart containers (no OS emojis)
    const totalHearts = 8;
    let html = '';
    const heartSvg = `<svg width="13" height="12" viewBox="0 0 24 24" fill="#ef476f"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    for (let i = 0; i < totalHearts; i++) {
      html += `<span class="pixel-heart full" title="Knight Vitality: Level 24 (100% HP)">${heartSvg}</span>`;
    }
    row.innerHTML = html;
  }

  renderSkills() {
    const hotbar = document.getElementById('skills-hotbar');
    if (!hotbar) return;

    hotbar.innerHTML = SKILLS_CATALOG.map(skill => `
      <div class="skill-chip" id="skill-chip-${skill.id}" data-category="${skill.category}">
        <span class="chip-name">${skill.name}</span>
        <span class="chip-badge">${skill.category}</span>
      </div>
    `).join('');
  }

  setupAudioButton() {
    const btn = document.getElementById('audio-toggle-btn');
    const icon = document.getElementById('audio-icon');
    if (!btn || !icon) return;

    btn.addEventListener('click', () => {
      const isMuted = AudioFX.toggleMute();
      icon.textContent = isMuted ? "SOUND OFF" : "SOUND ON";
      btn.classList.toggle('muted', isMuted);
    });
  }

  updateProjectCounter() {
    const el = document.getElementById('projects-counter');
    if (el) {
      el.textContent = `${this.discoveredProjects.size} / ${PROJECTS_MATRIX.length} PROJECTS`;
    }
  }

  updateRelicsCounter() {
    const el = document.getElementById('relics-counter');
    if (el) {
      el.textContent = `${this.inspectedRelics.size} / ${CERTIFICATES_MATRIX.length} CERTS`;
    }
  }

  highlightSkills(skillIds) {
    if (!skillIds || !Array.isArray(skillIds)) return;

    this.resetSkills();

    skillIds.forEach(id => {
      const chip = document.getElementById(`skill-chip-${id}`);
      if (chip) {
        chip.classList.add('highlighted');
        this.activeSkills.add(id);

        chip.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    });
  }

  resetSkills() {
    this.activeSkills.forEach(id => {
      const chip = document.getElementById(`skill-chip-${id}`);
      if (chip) {
        chip.classList.remove('highlighted');
      }
    });
    this.activeSkills.clear();
  }
}
