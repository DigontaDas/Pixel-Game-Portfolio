import { GameBridge, EVENTS } from '../systems/GameBridge.js';
import { AudioFX } from '../systems/AudioManager.js';
import { SKILLS_CATALOG } from '../systems/PortfolioData.js';

export class ModalManager {
  constructor() {
    this.modalRoot = null;
    this.isOpen = false;
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.modalRoot = document.createElement('div');
    this.modalRoot.id = 'rpg-modal-backdrop';
    this.modalRoot.className = 'modal-backdrop hidden';
    this.modalRoot.innerHTML = `
      <div class="modal-card" id="modal-card-content" role="dialog" aria-modal="true">
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">✖</button>
        <div class="modal-body-container" id="modal-body">
          <!-- Dynamic Content Injected Here -->
        </div>
      </div>
    `;

    document.body.appendChild(this.modalRoot);

    // Close on backdrop click
    this.modalRoot.addEventListener('click', (e) => {
      if (e.target === this.modalRoot) {
        this.closeModal();
      }
    });

    // Close on button click
    document.getElementById('modal-close-btn').addEventListener('click', () => {
      this.closeModal();
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });
  }

  bindEvents() {
    GameBridge.on(EVENTS.OPEN_PROJECT_MODAL, (project) => {
      this.renderProjectModal(project);
    });

    GameBridge.on(EVENTS.OPEN_CERTIFICATE_MODAL, (cert) => {
      this.renderCertificateModal(cert);
    });

    GameBridge.on(EVENTS.OPEN_SOCIAL_MODAL, (social) => {
      this.renderSocialModal(social);
    });

    GameBridge.on(EVENTS.OPEN_NPC_MODAL, (npc) => {
      this.renderNpcModal(npc);
    });

    GameBridge.on(EVENTS.OPEN_WITCH_MODAL, (witch) => {
      this.renderWitchCvModal(witch);
    });

    GameBridge.on(EVENTS.OPEN_VILLAIN_MODAL, (villain) => {
      this.renderVillainModal(villain);
    });

    GameBridge.on(EVENTS.OPEN_WELCOME_MODAL, () => {
      this.renderWelcomeModal();
    });

    GameBridge.on(EVENTS.CLOSE_ALL_MODALS, () => {
      this.closeModal();
    });
  }

  openModal() {
    this.isOpen = true;
    this.modalRoot.classList.remove('hidden');
    GameBridge.emit(EVENTS.SET_INPUT_PAUSED, true);
  }

  closeModal() {
    if (!this.isOpen) return;
    this.isOpen = false;
    AudioFX.playClose();
    this.modalRoot.classList.add('hidden');
    if (this.modalRoot.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    const card = document.getElementById('modal-card-content');
    card?.classList.remove('welcome-card');
    GameBridge.emit(EVENTS.SET_INPUT_PAUSED, false);
  }

  // -------------------------------------------------------------
  // 1. PROJECT DETAILS MODAL
  // -------------------------------------------------------------
  renderProjectModal(project) {
    const body = document.getElementById('modal-body');
    if (!body) return;

    // Map skill IDs to rich chips without emojis
    const skillsHtml = project.skills.map(sid => {
      const s = SKILLS_CATALOG.find(x => x.id === sid);
      return s ? `<span class="modal-skill-tag">${s.name}</span>` : '';
    }).join('');

    const highlightsHtml = project.highlights.map(h => `
      <li class="modal-highlight-item">
        <span class="highlight-bullet">•</span>
        <span>${h}</span>
      </li>
    `).join('');

    body.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-breadcrumbs">
          <span class="location-crumb">Digonta's Manor</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">Station #${project.stationNumber} (${project.wing})</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title">${project.title}</h2>
          <span class="modal-badge">${project.badge}</span>
        </div>
        <p class="modal-tagline">${project.tagline}</p>
      </div>

      <div class="modal-content-grid">
        <div class="modal-main-column">
          <h4 class="section-heading">PROJECT OVERVIEW</h4>
          <p class="modal-description">${project.description}</p>

          <h4 class="section-heading">KEY ARCHITECTURE AND HIGHLIGHTS</h4>
          <ul class="modal-highlights-list">
            ${highlightsHtml}
          </ul>
        </div>

        <div class="modal-side-column">
          <h4 class="section-heading">TECHNOLOGIES ENGAGED</h4>
          <div class="modal-skills-grid">
            ${skillsHtml}
          </div>

          <div class="modal-actions-box">
            <h4 class="section-heading">VERIFIED REPOSITORY</h4>
            <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn github-btn">
              VIEW GITHUB REPOSITORY
            </a>
            ${project.demoUrl ? `
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn demo-btn">
                LAUNCH LIVE DEMO
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    this.openModal();
  }

  // -------------------------------------------------------------
  // 2. CERTIFICATE / GEMSTONE MODAL (In-Site Viewer)
  // -------------------------------------------------------------
  renderCertificateModal(cert) {
    const body = document.getElementById('modal-body');
    if (!body) return;

    let mediaHtml = '';

    if (cert.imageRound2) {
      // Dual image tabs (EduPro Round 1 & Round 2)
      mediaHtml = `
        <div class="cert-dual-tabs">
          <div class="cert-tab-buttons">
            <button class="cert-tab-btn active" id="tab-btn-r1" onclick="document.getElementById('cert-img-r1').style.display='block'; document.getElementById('cert-img-r2').style.display='none'; this.classList.add('active'); document.getElementById('tab-btn-r2').classList.remove('active');">ROUND 1 CERTIFICATE</button>
            <button class="cert-tab-btn" id="tab-btn-r2" onclick="document.getElementById('cert-img-r1').style.display='none'; document.getElementById('cert-img-r2').style.display='block'; this.classList.add('active'); document.getElementById('tab-btn-r1').classList.remove('active');">ROUND 2 PARTICIPATION</button>
          </div>
          <div class="cert-image-frame">
            <img id="cert-img-r1" src="${cert.image}" alt="${cert.title} - Round 1" class="cert-preview-img" />
            <img id="cert-img-r2" src="${cert.imageRound2}" alt="${cert.title} - Round 2" class="cert-preview-img" style="display:none;" />
          </div>
        </div>
      `;
    } else if (cert.image) {
      mediaHtml = `
        <div class="cert-image-frame">
          <img src="${cert.image}" alt="${cert.title}" class="cert-preview-img" />
        </div>
      `;
    } else if (cert.pdf) {
      mediaHtml = `
        <div class="cert-pdf-frame">
          <div class="pdf-notice">
            <p>DataCamp Verified Professional Certification Proof Document</p>
            <a href="${cert.pdf}" download="DataCamp_Certified_Associate_Data_Scientist.pdf" class="modal-btn cv-btn">
              DOWNLOAD DATACAMP PDF
            </a>
          </div>
        </div>
      `;
    } else {
      mediaHtml = `
        <div class="cert-academic-card">
          <div class="academic-badge">BRAC UNIVERSITY</div>
          <h3 class="academic-degree">B.Sc. in Computer Science and Engineering</h3>
          <p class="academic-gpa">Current CGPA: <strong>3.6 / 4.0</strong> (Expected Graduation: Jan 2027)</p>
          <div class="roadmap-box">
            <h4 class="roadmap-title">MASTER'S DEGREE TIMELINE (2027 / 2028)</h4>
            <p class="roadmap-desc">Targeting admissions in premier global graduate programs specializing in Artificial Intelligence, Volumetric Medical Vision, and High-Throughput Distributed Systems.</p>
          </div>
        </div>
      `;
    }

    body.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-breadcrumbs">
          <span class="location-crumb" style="color:${cert.gemColor}">Cavern of Relics</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">${cert.gemType} Crystal</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title">${cert.title}</h2>
          <span class="modal-badge" style="border-color:${cert.gemColor}; color:${cert.gemColor}">${cert.issuer}</span>
        </div>
        <p class="modal-tagline">${cert.summary}</p>
      </div>

      <div class="modal-media-wrapper">
        ${mediaHtml}
      </div>
    `;

    this.openModal();
  }

  // -------------------------------------------------------------
  // 3. SOCIALS MODAL (GitHub / LinkedIn)
  // -------------------------------------------------------------
  renderSocialModal(social) {
    const body = document.getElementById('modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-breadcrumbs">
          <span class="location-crumb">Village Landmark</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">${social.platform} Embassy</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title">${social.platform}: ${social.username}</h2>
        </div>
        <p class="modal-tagline">${social.tagline}</p>
      </div>

      <div class="modal-social-body">
        <div class="social-hero-box">
          <p class="social-bio">Visit ${social.username}'s official profile to view network connections, code contributions, and ongoing research.</p>
          <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="modal-btn social-action-btn">
            OPEN ${social.platform.toUpperCase()} PROFILE
          </a>
        </div>
      </div>
    `;

    this.openModal();
  }

  // -------------------------------------------------------------
  // 4. ELDER SCHOLAR / ACADEMIC BIO MODAL
  // -------------------------------------------------------------
  renderNpcModal(npc) {
    const body = document.getElementById('modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-breadcrumbs">
          <span class="location-crumb">Village Town Square</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">${npc.name}</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title">Scholar's Chronicles: Digonta Das</h2>
          <span class="modal-badge">BRAC University '27</span>
        </div>
        <p class="modal-tagline">${npc.bio}</p>
      </div>

      <div class="modal-content-grid">
        <div class="modal-main-column">
          <h4 class="section-heading">GRADUATE ROADMAP</h4>
          <p class="modal-description">${npc.roadmap}</p>

          <h4 class="section-heading">COMPLETED ADVANCED COURSEWORK</h4>
          <div class="modal-skills-grid">
            ${npc.coursework.map(c => `<span class="modal-skill-tag">${c}</span>`).join('')}
          </div>
        </div>

        <div class="modal-side-column">
          <div class="modal-actions-box">
            <h4 class="section-heading">OFFICIAL CURRICULUM VITAE</h4>
            <a href="${npc.cvUrl}" download="Digonta_DAs_CV.pdf" class="modal-btn cv-btn">
              DOWNLOAD COMPLETE CV (PDF)
            </a>
          </div>
        </div>
      </div>
    `;

    this.openModal();
  }

  // -------------------------------------------------------------
  // 5. ARCANE WITCH MODAL (Auto-Download CV & Lore)
  // -------------------------------------------------------------
  renderWitchCvModal(witch) {
    const body = document.getElementById('modal-body');
    if (!body) return;

    // Automatic download trigger
    try {
      const link = document.createElement('a');
      link.href = witch.cvUrl || '/Digonta_CV.pdf';
      link.download = 'Digonta_DAs_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Auto CV download triggered:', err);
    }

    body.innerHTML = `
      <div class="modal-header-section" style="border-bottom: 2px solid #a855f7;">
        <div class="modal-breadcrumbs">
          <span class="location-crumb" style="color: #c084fc;">Arcane Grove</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">${witch.name || 'Witch Morgana'}</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title" style="color: #e9d5ff;">${witch.name || 'Witch Morgana [Keeper of Scrolls]'}</h2>
          <span class="modal-badge" style="border-color: #a855f7; color: #d8b4fe; background: rgba(168, 85, 247, 0.2);">CV AUTO-DOWNLOADED</span>
        </div>
        <p class="modal-tagline" style="color: #e9d5ff; font-style: italic;">
          "By the ancient compilers and the sacred sands of BRAC University! Behold, traveler: I have summoned the sacred parchment of Digonta Das directly into your archives!"
        </p>
      </div>

      <div class="modal-content-grid">
        <div class="modal-main-column">
          <div style="background: rgba(88, 28, 135, 0.2); border: 1px solid #7e22ce; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
            <h4 style="color: #f3e8ff; font-size: 11px; margin-top: 0; margin-bottom: 8px; font-family: 'Plus Jakarta Sans', sans-serif;">CURRICULUM VITAE CONJURED</h4>
            <p style="color: #d8b4fe; font-size: 13px; line-height: 1.6; margin: 0;">
              Your browser has automatically initiated the download of <strong>Digonta_DAs_CV.pdf</strong>. Check your Downloads folder to inspect Digonta's complete publication record, machine learning pipelines, and backend architectures!
            </p>
          </div>

          <h4 class="section-heading">KEY CREDENTIALS AT A GLANCE</h4>
          <ul class="modal-highlights-list" style="margin-top: 6px;">
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Target Role:</strong> AI Engineer / Medical Vision Specialist / Backend Architect</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Alma Mater:</strong> BRAC University — B.Sc. in Computer Science & Engineering (CGPA 3.6/4.0)</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Primary Thesis:</strong> Efficient 3D Tiled CNN Architecture for Coronary Block Detection</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Honors:</strong> Finalist, Infinity AI Buildfest (MaSheba AI) & EduPro UK Leeds Scholar</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Verified Direct Repositories:</strong> 10 High-Impact GitHub Projects in Deep Learning & Systems</span></li>
          </ul>
        </div>

        <div class="modal-side-column">
          <div class="modal-actions-box" style="border-color: #a855f7;">
            <h4 class="section-heading" style="color: #c084fc;">ACTIONS</h4>
            <a href="${witch.cvUrl || '/Digonta_CV.pdf'}" download="Digonta_DAs_CV.pdf" class="modal-btn cv-btn" style="background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%);">
              DOWNLOAD AGAIN (PDF)
            </a>
            <button class="modal-btn secondary-btn" onclick="document.getElementById('modal-close-btn').click();" style="margin-top: 8px; width: 100%;">
              RESUME EXPLORATION
            </button>
          </div>
        </div>
      </div>
    `;

    this.openModal();
  }

  // -------------------------------------------------------------
  // 6. CAVE SENTINEL VILLAIN MODAL (Malakor Boss Guardian)
  // -------------------------------------------------------------
  renderVillainModal(villain) {
    const body = document.getElementById('modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="modal-header-section" style="border-bottom: 2px solid #ef4444;">
        <div class="modal-breadcrumbs">
          <span class="location-crumb" style="color: #f87171;">Entrance to Cavern of Relics</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">Cave Boss Guardian</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title" style="color: #fca5a5;">Malakor the Certification Sentinel</h2>
          <span class="modal-badge" style="border-color: #ef4444; color: #f87171; background: rgba(239, 68, 68, 0.2);">CHALLENGE CLEARED</span>
        </div>
        <p class="modal-tagline" style="color: #fca5a5;">
          "HALT, TRAVELER! None may cast their gaze upon the 4 Sacred Relics of Certification unless they possess true mastery of neural networks and distributed systems!"
        </p>
      </div>

      <div class="modal-content-grid">
        <div class="modal-main-column">
          <div style="background: rgba(127, 29, 29, 0.25); border: 1px solid #b91c1c; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
            <p style="color: #fecaca; font-size: 13px; line-height: 1.6; margin: 0;">
              <em>*The armored guardian lowers his heavy greataxe and recognizes your heroic armor.*</em><br><br>
              "Hold... I recognize that aura! You are <strong>Digonta Das</strong>, the builder who conquered DataCamp, stood tall at the Infinity AI Buildfest, and mastered Computer Science at BRAC University! The seal is broken — step forth and inspect the trophies!"
            </p>
          </div>

          <h4 class="section-heading">SANCTUARY RELICS AHEAD</h4>
          <ul class="modal-highlights-list" style="margin-top: 6px;">
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Diamond Shrine:</strong> Infinity AI Buildfest 2024 — Offline Maternal Health Finalist</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Emerald Shrine:</strong> EduPro UK Award of Excellence — Global Innovation Track</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Sapphire Shrine:</strong> DataCamp Certified Associate Data Scientist</span></li>
            <li class="modal-highlight-item"><span class="highlight-bullet">•</span><span><strong>Amethyst Shrine:</strong> BRAC University CSE Degree & Master's Roadmap (2027/2028)</span></li>
          </ul>
        </div>

        <div class="modal-side-column">
          <div class="modal-actions-box" style="border-color: #ef4444;">
            <h4 class="section-heading" style="color: #f87171;">PASS INTO CAVERN</h4>
            <button class="modal-btn code-btn" onclick="document.getElementById('modal-close-btn').click();" style="width: 100%; justify-content: center;">
              ENTER & EXAMINE RELICS
            </button>
          </div>
        </div>
      </div>
    `;

    this.openModal();
  }

  // -------------------------------------------------------------
  // 7. WELCOME & CONTACT INTRO MODAL
  // -------------------------------------------------------------
  renderWelcomeModal() {
    const body = document.getElementById('modal-body');
    if (!body) return;

    const card = document.getElementById('modal-card-content');
    card?.classList.add('welcome-card');

    body.innerHTML = `
      <div class="modal-header-section" style="border-bottom: 2px solid #ffd166; padding-bottom: 12px;">
        <div class="modal-breadcrumbs">
          <span class="location-crumb" style="color: #ffd166;">Welcome Portal</span>
          <span class="crumb-separator">&bull;</span>
          <span class="station-crumb">Interactive 16-Bit RPG Portfolio</span>
        </div>
        <div class="modal-title-row">
          <h2 class="modal-title" style="color: #ffd166; font-size: 16px;">Welcome to My Portfolio</h2>
          <span class="modal-badge" style="border-color: #ffd166; color: #ffd166; background: rgba(255, 209, 102, 0.15);">Digonta Das</span>
        </div>
        <p class="modal-tagline" style="color: #cbd5e1; font-size: 13px; margin: 4px 0 0;">
          Welcome! I’m an AI engineer and computer vision researcher. Explore my work and professional credentials in this interactive portfolio.
        </p>
      </div>

      <!-- CENTER HERO EXPLORE BUTTON -->
      <div class="welcome-hero-cta" style="margin: 14px 0; text-align: center;">
        <button class="modal-btn primary-btn" id="welcome-explore-btn" style="width: 100%; max-width: 520px; margin: 0 auto; padding: 13px 26px; font-size: 14px; font-weight: 800; letter-spacing: 0.6px; justify-content: center; box-shadow: 0 0 24px rgba(255, 209, 102, 0.35);">
          START EXPLORING MY PORTFOLIO
        </button>
      </div>

      <!-- INTRODUCTION AND PROFILE IMAGE -->
      <div class="modal-content-grid welcome-grid" style="grid-template-columns: 1fr 1fr; gap: 24px; align-items: stretch;">
        <div class="modal-main-column welcome-intro-copy" style="display: flex; flex-direction: column; justify-content: center;">
          <h4 class="section-heading" style="color: #ffd166; margin-bottom: 8px;">AI ENGINEER · COMPUTER VISION · FULL-STACK</h4>
          <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
            I build practical AI systems and thoughtful digital products. Explore my projects, research, and professional background below.
          </p>
        </div>

        <!-- PROFILE IMAGE -->
        <div class="modal-side-column welcome-image-column" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div class="welcome-image-container">
            <img src="/portfolio.png" alt="Digonta Das - AI Engineer" class="welcome-profile-large-img" />
          </div>
        </div>
      </div>

      <!-- MATTE CREDENTIALS BAR ACROSS BOTTOM -->
      <div class="welcome-credentials-row">
        <a href="https://github.com/DigontaDas" target="_blank" rel="noopener noreferrer" class="matte-link-pill" title="GitHub Profile">
          <span class="matte-label">GITHUB</span> @DigontaDas
        </a>
        <a href="https://linkedin.com/in/digonta-das-b54130282" target="_blank" rel="noopener noreferrer" class="matte-link-pill" title="LinkedIn Profile">
          <span class="matte-label">LINKEDIN</span> Digonta Das
        </a>
        <a href="/Digonta_CV.pdf" download="Digonta_DAs_CV.pdf" class="matte-link-pill" title="Download Official Resume PDF">
          <span class="matte-label">RESUME</span> PDF Download
        </a>
      </div>
    `;

    // Wire up events
    document.getElementById('welcome-explore-btn')?.addEventListener('click', () => {
      AudioFX.playInspect();
      AudioFX.startMusic();
      this.closeModal();
    });

    this.openModal();
  }
}
