import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import VillageScene from './scenes/VillageScene.js';
import HouseScene from './scenes/HouseScene.js';
import { HUD } from './ui/HUD.js';
import { ModalManager } from './ui/ModalManager.js';

const initMobileControls = () => {
  if (document.getElementById('mobile-controls')) return;

  const container = document.createElement('div');
  container.id = 'mobile-controls';
  container.className = 'mobile-controls';
  container.innerHTML = `
    <div class="mobile-stick-zone" aria-label="Movement controls">
      <div class="mobile-stick-base" id="move-pad">
        <div class="mobile-stick-thumb" id="move-thumb"></div>
      </div>
    </div>
    <div class="mobile-action-zone" aria-label="Action controls">
      <button class="mobile-action-btn jump-btn" data-action="jump" type="button">JUMP</button>
      <button class="mobile-action-btn attack-btn" data-action="attack" type="button">ATK</button>
      <button class="mobile-action-btn interact-btn" data-action="interact" type="button">E</button>
    </div>
  `;

  document.body.appendChild(container);

  const state = {
    vx: 0,
    vy: 0,
    attackPressed: false,
    jumpPressed: false,
    interactPressed: false
  };

  const movePad = document.getElementById('move-pad');
  const moveThumb = document.getElementById('move-thumb');
  const radius = 52;

  const updateStick = (clientX, clientY) => {
    const rect = movePad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (clientX - centerX) / radius));
    const dy = Math.max(-1, Math.min(1, (clientY - centerY) / radius));
    const distance = Math.min(Math.hypot(dx, dy), 1);
    const angle = Math.atan2(dy, dx);

    const clampedX = Math.cos(angle) * distance;
    const clampedY = Math.sin(angle) * distance;

    state.vx = Math.abs(clampedX) < 0.08 ? 0 : clampedX;
    state.vy = Math.abs(clampedY) < 0.08 ? 0 : clampedY;
    moveThumb.style.transform = `translate(${clampedX * radius}px, ${clampedY * radius}px)`;
  };

  const resetStick = () => {
    state.vx = 0;
    state.vy = 0;
    moveThumb.style.transform = 'translate(0, 0)';
  };

  movePad.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    movePad.setPointerCapture(event.pointerId);
    updateStick(event.clientX, event.clientY);
  });

  movePad.addEventListener('pointermove', (event) => {
    if (event.pressure === 0) return;
    updateStick(event.clientX, event.clientY);
  });

  movePad.addEventListener('pointerup', resetStick);
  movePad.addEventListener('pointerleave', resetStick);
  movePad.addEventListener('pointercancel', resetStick);

  const actionButtons = container.querySelectorAll('.mobile-action-btn');
  actionButtons.forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const action = button.dataset.action;
      if (action === 'jump') state.jumpPressed = true;
      if (action === 'attack') state.attackPressed = true;
      if (action === 'interact') state.interactPressed = true;
      button.classList.add('pressed');
      setTimeout(() => button.classList.remove('pressed'), 120);
    });
  });

  window.MobileControls = state;

  const syncVisibility = () => {
    const isMobile = window.innerWidth <= 900 || window.matchMedia('(pointer: coarse)').matches;
    container.classList.toggle('visible', isMobile);
    if (!isMobile) resetStick();
  };

  window.addEventListener('resize', syncVisibility);
  syncVisibility();
};

window.addEventListener('DOMContentLoaded', () => {
  // Initialize HTML DOM HUD and Modal System
  const hud = new HUD();
  const modalManager = new ModalManager();
  initMobileControls();

  // Phaser 3 2D Engine Configuration
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    backgroundColor: '#0d1117',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, PreloadScene, VillageScene, HouseScene]
  };

  const game = new Phaser.Game(config);
  window.game = game;

  // Greet visitor with Welcome & Contact Portal on website entry
  setTimeout(() => {
    modalManager.renderWelcomeContactModal();
  }, 350);
});
