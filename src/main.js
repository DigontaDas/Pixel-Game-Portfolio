import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import VillageScene from './scenes/VillageScene.js';
import HouseScene from './scenes/HouseScene.js';
import { HUD } from './ui/HUD.js';
import { ModalManager } from './ui/ModalManager.js';

window.addEventListener('DOMContentLoaded', () => {
  // Initialize HTML DOM HUD and Modal System
  const hud = new HUD();
  const modalManager = new ModalManager();

  // Phaser 3 2D Engine Configuration
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 960,
    height: 540,
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
      mode: Phaser.Scale.FIT,
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
