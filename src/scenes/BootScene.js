import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Create immediate visual feedback (retro progress background)
    const { width, height } = this.cameras.main;
    const bar = this.add.graphics();
    bar.fillStyle(0x1a1c23, 1);
    bar.fillRect(0, 0, width, height);

    const title = this.add.text(width / 2, height / 2 - 30, "DIGONTA'S REALM", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3
    }).setOrigin(0.5);

    const subtitle = this.add.text(width / 2, height / 2 + 10, "Initializing 2D Canvas Engine...", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#8ecae6',
      resolution: 3
    }).setOrigin(0.5);
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
