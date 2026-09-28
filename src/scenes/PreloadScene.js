import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.cameras.main;

    const barWidth = 320;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;

    const bgBox = this.add.graphics();
    bgBox.fillStyle(0x0f111a, 0.9);
    bgBox.fillRoundedRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8, 4);
    bgBox.lineStyle(2, 0xe2b714, 1);
    bgBox.strokeRoundedRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8, 4);

    const progressBar = this.add.graphics();

    this.add.text(width / 2, barY - 40, "ENTERING DIGONTA'S ADVENTURE", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3
    }).setOrigin(0.5);

    const statusText = this.add.text(width / 2, barY + 45, "Loading Pixel Assets...", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#8ecae6',
      resolution: 3
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x06d6a0, 1);
      progressBar.fillRoundedRect(barX, barY, barWidth * value, barHeight, 2);
    });

    this.load.on('fileprogress', (file) => {
      statusText.setText(`Loading: ${file.key}`);
    });

    // 1. Knight Hero Player Sprite Sheets (64x64, Plate Armor, Sword in Hand, Shield on Back, Attack Slashing)
    this.load.spritesheet('player_idle_down', '/assets/characters/knight/Idle_Down-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_idle_side', '/assets/characters/knight/Idle_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_idle_up', '/assets/characters/knight/Idle_Up-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_run_down', '/assets/characters/knight/Run_Down-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_run_side', '/assets/characters/knight/Run_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_run_up', '/assets/characters/knight/Run_Up-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_attack_down', '/assets/characters/knight/Attack_Down-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_attack_side', '/assets/characters/knight/Attack_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_attack_up', '/assets/characters/knight/Attack_Up-Sheet.png', { frameWidth: 64, frameHeight: 64 });

    // 2. NPCs & Boss Guardian
    this.load.spritesheet('npc_wizard', '/assets/npcs/Wizzard_Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('npc_knight', '/assets/npcs/Knight_Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('npc_rogue', '/assets/npcs/Rogue_Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('mob_orc_warrior', '/assets/npcs/Orc_Warrior_Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('npc_witch', '/assets/npcs/Witch_Mage_Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('npc_cook', '/assets/npcs/Tavern_Cook_Idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('npc_barkeep', '/assets/npcs/Tavern_Barkeep_Idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('npc_guest', '/assets/npcs/Tavern_Guest_Idle.png', { frameWidth: 64, frameHeight: 64 });

    // 3. Environment Base Tiles
    this.load.image('tiles_floors', '/assets/environment/tilesets/Floors_Tiles.png');
    this.load.image('tiles_walls', '/assets/environment/tilesets/Wall_Tiles.png');
    this.load.image('tile_grass_solid', '/assets/environment/clean_props/tile_grass_solid.png');
    this.load.image('tile_dirt_solid', '/assets/environment/clean_props/tile_dirt_solid.png');

    // 4. Clean Standalone Props & Buildings (Image 2 Emerald Manor Exterior)
    this.load.image('house_manor', '/assets/environment/clean_props/house_manor_emerald.png');
    this.load.image('house_manor_emerald', '/assets/environment/clean_props/house_manor_emerald.png');
    this.load.image('house_github', '/assets/environment/clean_props/house_github.png');
    this.load.image('house_linkedin', '/assets/environment/clean_props/house_linkedin.png');
    this.load.image('cave_entrance', '/assets/environment/clean_props/cave_entrance.png');
    this.load.image('tree_oak', '/assets/environment/clean_props/tree_oak.png');
    this.load.image('tree_pine', '/assets/environment/clean_props/tree_pine.png');
    this.load.image('tree_spruce', '/assets/environment/clean_props/tree_spruce.png');
    this.load.image('tree_small', '/assets/environment/clean_props/tree_small.png');
    this.load.image('station_furnace_clean', '/assets/environment/clean_props/station_furnace.png');
    this.load.image('station_anvil_clean', '/assets/environment/clean_props/station_anvil.png');
    this.load.image('station_witch_alchemy', '/assets/environment/clean_props/station_witch_alchemy.png');
    this.load.image('village_well', '/assets/environment/clean_props/village_well.png');
    this.load.image('training_dummy', '/assets/environment/clean_props/training_dummy.png');

    // 5. Handcrafted Interior Map (Tavern Manor Interior 1280x1280 - Image 1)
    this.load.image('interior_tavern_map', '/assets/environment/interior/Tavern.png');

    // 6. Vegetation & Nature Decorations
    this.load.image('bush_large', '/assets/environment/clean_props/bush_large.png');
    this.load.image('bush_small', '/assets/environment/clean_props/bush_small.png');
    this.load.image('flower_patch_1', '/assets/environment/clean_props/flower_patch_1.png');
    this.load.image('flower_patch_2', '/assets/environment/clean_props/flower_patch_2.png');
    this.load.image('grass_tuft', '/assets/environment/clean_props/grass_tuft.png');
    this.load.image('tall_grass', '/assets/environment/clean_props/tall_grass.png');
    this.load.image('purple_flower', '/assets/environment/clean_props/purple_flower.png');

    // 7. Rocks & Grand Mountain Cliff Backdrop (Cave surroundings)
    this.load.image('mountain_cliff_backdrop', '/assets/environment/clean_props/mountain_cliff_backdrop.png');
    this.load.image('boulder_large', '/assets/environment/clean_props/boulder_large.png');
    this.load.image('rock_medium', '/assets/environment/clean_props/rock_medium.png');
    this.load.image('rock_small', '/assets/environment/clean_props/rock_small.png');
    this.load.image('rock_dark', '/assets/environment/clean_props/rock_dark.png');
    this.load.image('hill_cave_mountain', '/assets/environment/clean_props/hill_cave_mountain.png');

    // 8. Garden & Farm Decorations
    this.load.image('garden_flower_bed', '/assets/environment/clean_props/garden_flower_bed.png');
    this.load.image('garden_bush_blooming', '/assets/environment/clean_props/garden_bush_blooming.png');
    this.load.image('garden_bush_roses', '/assets/environment/clean_props/garden_bush_roses.png');
    this.load.image('garden_flowers_mix', '/assets/environment/clean_props/garden_flowers_mix.png');
    this.load.image('garden_fence_horizontal', '/assets/environment/clean_props/garden_fence_horizontal.png');
    this.load.image('garden_fence_vertical', '/assets/environment/clean_props/garden_fence_vertical.png');
    this.load.image('garden_bench', '/assets/environment/clean_props/garden_bench.png');
    this.load.image('garden_planter_box', '/assets/environment/clean_props/garden_planter_box.png');
    this.load.image('garden_lavender', '/assets/environment/clean_props/garden_lavender.png');
    this.load.image('garden_crop_patch', '/assets/environment/clean_props/garden_crop_patch.png');
    this.load.image('pond_small', '/assets/environment/clean_props/pond_small.png');
    this.load.image('fence_section', '/assets/environment/clean_props/fence_section.png');
    this.load.image('scarecrow', '/assets/environment/clean_props/scarecrow.png');
    this.load.image('garden_row', '/assets/environment/clean_props/garden_row.png');
    this.load.image('cave_rock', '/assets/environment/clean_props/cave_rock.png');
    this.load.image('tree_pine_tall', '/assets/environment/clean_props/tree_pine_tall.png');
    this.load.image('garden_pond_deluxe', '/assets/environment/clean_props/garden_pond_deluxe.png');
    this.load.image('garden_planter_carrots', '/assets/environment/clean_props/garden_planter_carrots.png');
    this.load.image('garden_planter_cabbages', '/assets/environment/clean_props/garden_planter_cabbages.png');
    this.load.image('garden_planter_beets', '/assets/environment/clean_props/garden_planter_beets.png');
    this.load.image('garden_stepping_stone', '/assets/environment/clean_props/garden_stepping_stone.png');
    this.load.image('grass_tuft_01', '/assets/environment/clean_props/grass_tuft_01.png');
    this.load.image('grass_tuft_02', '/assets/environment/clean_props/grass_tuft_02.png');
    this.load.image('grass_tuft_03', '/assets/environment/clean_props/grass_tuft_03.png');
    this.load.image('grass_tuft_flowers', '/assets/environment/clean_props/grass_tuft_flowers.png');
  }

  create() {
    this.createGemstoneTextures();
    this.createPlayerAnimations();
    this.createNpcAnimations();

    this.cameras.main.fade(250, 0, 0, 0);
    this.time.delayedCall(250, () => {
      this.scene.start('VillageScene');
    });
  }

  createPlayerAnimations() {
    this.anims.create({
      key: 'player-idle-down',
      frames: this.anims.generateFrameNumbers('player_idle_down', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'player-idle-side',
      frames: this.anims.generateFrameNumbers('player_idle_side', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'player-idle-up',
      frames: this.anims.generateFrameNumbers('player_idle_up', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'player-run-down',
      frames: this.anims.generateFrameNumbers('player_run_down', { start: 0, end: 5 }),
      frameRate: 11,
      repeat: -1
    });

    this.anims.create({
      key: 'player-run-side',
      frames: this.anims.generateFrameNumbers('player_run_side', { start: 0, end: 5 }),
      frameRate: 11,
      repeat: -1
    });

    this.anims.create({
      key: 'player-run-up',
      frames: this.anims.generateFrameNumbers('player_run_up', { start: 0, end: 5 }),
      frameRate: 11,
      repeat: -1
    });

    // Knight Attack / Slash Animations
    this.anims.create({
      key: 'player-attack-down',
      frames: this.anims.generateFrameNumbers('player_attack_down', { start: 0, end: 7 }),
      frameRate: 16,
      repeat: 0
    });

    this.anims.create({
      key: 'player-attack-side',
      frames: this.anims.generateFrameNumbers('player_attack_side', { start: 0, end: 7 }),
      frameRate: 16,
      repeat: 0
    });

    this.anims.create({
      key: 'player-attack-up',
      frames: this.anims.generateFrameNumbers('player_attack_up', { start: 0, end: 7 }),
      frameRate: 16,
      repeat: 0
    });
  }

  createNpcAnimations() {
    this.anims.create({
      key: 'npc-wizard-idle',
      frames: this.anims.generateFrameNumbers('npc_wizard', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'npc-knight-idle',
      frames: this.anims.generateFrameNumbers('npc_knight', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'npc-rogue-idle',
      frames: this.anims.generateFrameNumbers('npc_rogue', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'mob-orc-idle',
      frames: this.anims.generateFrameNumbers('mob_orc_warrior', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'npc-witch-idle',
      frames: this.anims.generateFrameNumbers('npc_witch', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'npc-cook-idle',
      frames: this.anims.generateFrameNumbers('npc_cook', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'npc-barkeep-idle',
      frames: this.anims.generateFrameNumbers('npc_barkeep', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'npc-guest-idle',
      frames: this.anims.generateFrameNumbers('npc_guest', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
  }

  createGemstoneTextures() {
    const gems = [
      { key: 'gem_diamond', color: 0x4deeea, rim: 0xffffff },
      { key: 'gem_emerald', color: 0x74ee15, rim: 0xa6ff00 },
      { key: 'gem_sapphire', color: 0x00b4d8, rim: 0x90e0ef },
      { key: 'gem_amethyst', color: 0xbf55ec, rim: 0xe0aaff }
    ];

    gems.forEach(({ key, color, rim }) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      
      // Pedestal
      g.fillStyle(0x334155, 1);
      g.fillRect(3, 16, 18, 6);
      g.fillStyle(0x1e293b, 1);
      g.fillRect(5, 14, 14, 3);

      // Glow
      g.fillStyle(color, 0.35);
      g.fillCircle(12, 10, 9);

      // Gem shape
      g.fillStyle(color, 1);
      g.beginPath();
      g.moveTo(12, 2);
      g.lineTo(19, 8);
      g.lineTo(12, 15);
      g.lineTo(5, 8);
      g.closePath();
      g.fillPath();

      // Highlight facet
      g.fillStyle(rim, 0.9);
      g.beginPath();
      g.moveTo(12, 4);
      g.lineTo(16, 8);
      g.lineTo(12, 8);
      g.closePath();
      g.fillPath();

      g.generateTexture(key, 24, 24);
      g.destroy();
    });

    const promptG = this.make.graphics({ x: 0, y: 0, add: false });
    promptG.fillStyle(0x0f172a, 0.92);
    promptG.fillRoundedRect(0, 0, 36, 16, 4);
    promptG.lineStyle(1, 0xffd166, 1);
    promptG.strokeRoundedRect(0, 0, 36, 16, 4);
    promptG.generateTexture('ui_prompt_box', 36, 16);
    promptG.destroy();

    const blankG = this.make.graphics({ x: 0, y: 0, add: false });
    blankG.fillStyle(0xffffff, 1);
    blankG.fillRect(0, 0, 16, 16);
    blankG.generateTexture('blank_collider', 16, 16);
    blankG.destroy();
  }
}
