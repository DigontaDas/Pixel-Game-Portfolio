import Phaser from 'phaser';
import { GameBridge, EVENTS } from '../systems/GameBridge.js';
import { AudioFX } from '../systems/AudioManager.js';
import { CERTIFICATES_MATRIX, PERSONAL_INFO } from '../systems/PortfolioData.js';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super('VillageScene');
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.keys = null;
    this.currentInteractable = null;
    this.isInputPaused = false;
    this.lastDirection = 'down';
    this.isTransitioning = true;
    
    // Knight Combat & Jumping State
    this.isAttacking = false;
    this.isJumping = false;
    this.jumpStartTime = 0;
    this.jumpDuration = 360;
    this.jumpHeight = 22;
    this.playerBaseY = 0;
    this.lastStepTime = 0;
    this.lastDustTime = 0;

    // Grass & Garden Animation System
    this.swayingFlora = [];
    this.lastRustleTime = 0;
  }

  init(data) {
    this.spawnCoords = data && data.spawn ? data.spawn : { x: 640, y: 440 };
    this.isTransitioning = true;
    this.time.delayedCall(200, () => {
      this.isTransitioning = false;
    });
  }

  create() {
    const mapW = 1600;
    const mapH = 1200;
    this.physics.world.setBounds(0, 0, mapW, mapH);

    // Audio & Pause listener
    GameBridge.on(EVENTS.SET_INPUT_PAUSED, (paused) => {
      this.isInputPaused = paused;
      if (this.player && this.player.body) {
        this.player.body.setVelocity(0, 0);
        if (!this.isAttacking) {
          this.player.anims.play(`player-idle-${this.lastDirection}`, true);
        }
      }
    });

    GameBridge.emit(EVENTS.LOCATION_CHANGED, {
      title: "Village Square & Manor Grounds",
      badge: "Town Exterior"
    });

    // 1. Terrain & Pathways
    this.buildVillageTerrain(mapW, mapH);

    // 2. Dense Forest & Complete Trees
    this.buildLushForest(mapW, mapH);

    // 3. Cave Hills & Grand Mountain Cliff Backdrop with airtight colliders
    this.buildCaveHills();

    // 4. Botanical Gardens & Floral Borders
    this.buildGardens();

    // 5. Structures & Landmarks (Manor, Forge, Embassy, Well)
    this.buildStructures();

    // 6. Gemstone Pedestals at the Cave
    this.setupGemstonePedestals();

    // 7. Sparring Training Dummy
    this.setupTrainingDummy();

    // 8. NPCs (Scholar, Cave Guardian, Witch Morgana, Sir Valen Gate Knight, Rogue)
    this.setupNpcs();

    // 9. Knight Hero Player
    this.createPlayer();

    // 10. Ambient Weather & Pollen Particles
    this.setupAmbientWeather(mapW, mapH);

    // 11. Camera
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(2.2);
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // 12. Input Setup
    this.setupInputs();

    // 13. Floating Interaction Prompt
    this.createInteractionPrompt();
  }

  buildVillageTerrain(mapW, mapH) {
    // 1. Lush Green Grass Base (Seamless isotropic meadow grass)
    const grass = this.add.tileSprite(mapW / 2, mapH / 2, mapW, mapH, 'tile_grass_solid');
    grass.setDepth(0);

    // 2. Earth Pathways & Plaza
    // North-South Main Boulevard
    const mainAvenue = this.add.tileSprite(640, 600, 110, 900, 'tile_dirt_solid');
    mainAvenue.setDepth(1);

    // Central Plaza
    const plaza = this.add.tileSprite(640, 680, 240, 200, 'tile_dirt_solid');
    plaza.setDepth(1);

    // Path West to Cavern
    const pathCave = this.add.tileSprite(370, 300, 320, 56, 'tile_dirt_solid');
    pathCave.setDepth(1);

    // Path East to GitHub Forge
    const pathGit = this.add.tileSprite(900, 350, 280, 56, 'tile_dirt_solid');
    pathGit.setDepth(1);

    // Path South-West to LinkedIn Embassy
    const pathLink = this.add.tileSprite(400, 820, 300, 56, 'tile_dirt_solid');
    pathLink.setDepth(1);

    // Path South-East to Botanical Garden
    const pathGarden = this.add.tileSprite(900, 750, 250, 56, 'tile_dirt_solid');
    pathGarden.setDepth(1);

    // Subtle path borders
    const pathBorder = this.add.graphics();
    pathBorder.setDepth(2);
    pathBorder.lineStyle(2, 0x5a3e28, 0.35);
    pathBorder.strokeRect(585, 150, 110, 900);
    pathBorder.strokeRect(520, 580, 240, 200);

    // Static obstacles group
    this.obstacles = this.physics.add.staticGroup();

    // Map boundary barriers (North, South, West, East)
    const addBoundary = (x, y, bw, bh) => {
      const b = this.obstacles.create(x, y, 'blank_collider');
      b.setVisible(false);
      b.body.setSize(bw, bh);
      b.body.setOffset(8 - bw / 2, 8 - bh / 2);
      b.refreshBody();
      return b;
    };

    addBoundary(mapW / 2, 10, mapW, 20); // North edge
    addBoundary(mapW / 2, mapH - 10, mapW, 20); // South edge
    addBoundary(10, mapH / 2, 20, mapH); // West edge
    addBoundary(mapW - 10, mapH / 2, 20, mapH); // East edge
  }

  buildLushForest(mapW, mapH) {
    // ===== COMPLETE, NON-CLIPPED TREES =====
    const treePositions = [
      // North Border
      { x: 80, y: 50, type: 'tree_spruce' },
      { x: 150, y: 45, type: 'tree_pine' },
      { x: 220, y: 55, type: 'tree_oak' },
      { x: 310, y: 40, type: 'tree_spruce' },
      { x: 420, y: 50, type: 'tree_pine_tall' },
      { x: 530, y: 45, type: 'tree_oak' },
      { x: 750, y: 50, type: 'tree_spruce' },
      { x: 860, y: 45, type: 'tree_pine_tall' },
      { x: 970, y: 55, type: 'tree_oak' },
      { x: 1080, y: 40, type: 'tree_spruce' },
      { x: 1190, y: 50, type: 'tree_pine' },
      { x: 1300, y: 45, type: 'tree_oak' },
      { x: 1410, y: 55, type: 'tree_spruce' },
      { x: 1520, y: 45, type: 'tree_pine_tall' },

      // Second row canopy
      { x: 50, y: 95, type: 'tree_oak' },
      { x: 120, y: 90, type: 'tree_spruce' },
      { x: 360, y: 85, type: 'tree_pine' },
      { x: 470, y: 95, type: 'tree_oak' },
      { x: 800, y: 90, type: 'tree_pine' },
      { x: 920, y: 95, type: 'tree_spruce' },
      { x: 1030, y: 85, type: 'tree_oak' },
      { x: 1140, y: 95, type: 'tree_pine_tall' },
      { x: 1250, y: 90, type: 'tree_spruce' },
      { x: 1360, y: 95, type: 'tree_oak' },
      { x: 1470, y: 85, type: 'tree_pine' },

      // West Border
      { x: 45, y: 160, type: 'tree_pine_tall' },
      { x: 50, y: 280, type: 'tree_oak' },
      { x: 45, y: 400, type: 'tree_spruce' },
      { x: 55, y: 520, type: 'tree_pine' },
      { x: 45, y: 640, type: 'tree_oak' },
      { x: 50, y: 760, type: 'tree_spruce' },
      { x: 45, y: 880, type: 'tree_pine_tall' },
      { x: 55, y: 1000, type: 'tree_oak' },
      { x: 45, y: 1120, type: 'tree_spruce' },

      // West second depth
      { x: 95, y: 220, type: 'tree_small' },
      { x: 100, y: 380, type: 'tree_small' },
      { x: 95, y: 580, type: 'tree_small' },
      { x: 105, y: 740, type: 'tree_small' },
      { x: 95, y: 920, type: 'tree_small' },
      { x: 100, y: 1060, type: 'tree_small' },

      // East Border
      { x: 1540, y: 160, type: 'tree_spruce' },
      { x: 1545, y: 280, type: 'tree_pine_tall' },
      { x: 1535, y: 400, type: 'tree_oak' },
      { x: 1545, y: 520, type: 'tree_spruce' },
      { x: 1535, y: 640, type: 'tree_pine' },
      { x: 1545, y: 760, type: 'tree_oak' },
      { x: 1535, y: 880, type: 'tree_spruce' },
      { x: 1545, y: 1000, type: 'tree_pine_tall' },
      { x: 1540, y: 1120, type: 'tree_oak' },

      // East second depth
      { x: 1480, y: 220, type: 'tree_small' },
      { x: 1485, y: 380, type: 'tree_small' },
      { x: 1475, y: 580, type: 'tree_small' },
      { x: 1485, y: 740, type: 'tree_small' },
      { x: 1475, y: 920, type: 'tree_small' },
      { x: 1480, y: 1060, type: 'tree_small' },

      // South Border
      { x: 80, y: 1150, type: 'tree_oak' },
      { x: 200, y: 1145, type: 'tree_spruce' },
      { x: 340, y: 1155, type: 'tree_pine_tall' },
      { x: 480, y: 1145, type: 'tree_oak' },
      { x: 780, y: 1145, type: 'tree_spruce' },
      { x: 920, y: 1155, type: 'tree_pine' },
      { x: 1060, y: 1145, type: 'tree_oak' },
      { x: 1200, y: 1150, type: 'tree_spruce' },
      { x: 1340, y: 1145, type: 'tree_pine_tall' },
      { x: 1480, y: 1155, type: 'tree_oak' },

      // South second depth
      { x: 140, y: 1100, type: 'tree_small' },
      { x: 270, y: 1105, type: 'tree_small' },
      { x: 410, y: 1095, type: 'tree_small' },
      { x: 850, y: 1100, type: 'tree_small' },
      { x: 990, y: 1105, type: 'tree_small' },
      { x: 1130, y: 1095, type: 'tree_small' },
      { x: 1270, y: 1100, type: 'tree_small' },
      { x: 1410, y: 1105, type: 'tree_small' },

      // Natural woodland clusters
      { x: 120, y: 480, type: 'tree_oak' },
      { x: 140, y: 560, type: 'tree_pine' },
      { x: 320, y: 460, type: 'tree_spruce' },
      { x: 340, y: 530, type: 'tree_small' },
      { x: 780, y: 470, type: 'tree_pine' },
      { x: 800, y: 540, type: 'tree_oak' },
      { x: 960, y: 520, type: 'tree_spruce' },
      { x: 980, y: 590, type: 'tree_small' },
      { x: 1220, y: 220, type: 'tree_oak' },
      { x: 1250, y: 290, type: 'tree_pine' },
      { x: 1340, y: 230, type: 'tree_spruce' },
      { x: 1370, y: 300, type: 'tree_small' },
      { x: 1320, y: 480, type: 'tree_oak' },
      { x: 1350, y: 550, type: 'tree_pine_tall' },
      { x: 1420, y: 490, type: 'tree_spruce' },
      { x: 360, y: 950, type: 'tree_spruce' },
      { x: 380, y: 1020, type: 'tree_pine' },
      { x: 450, y: 960, type: 'tree_oak' },
      { x: 840, y: 930, type: 'tree_pine' },
      { x: 860, y: 1000, type: 'tree_oak' },
      { x: 930, y: 940, type: 'tree_spruce' },
      { x: 1240, y: 900, type: 'tree_oak' },
      { x: 1260, y: 970, type: 'tree_pine_tall' },
      { x: 1330, y: 910, type: 'tree_spruce' }
    ];

    treePositions.forEach(cfg => {
      const tree = this.obstacles.create(cfg.x, cfg.y, cfg.type);
      tree.setDepth(cfg.y + 25);

      if (cfg.type === 'tree_oak') {
        tree.body.setSize(20, 14);
        tree.body.setOffset(13, 80);
      } else if (cfg.type === 'tree_spruce') {
        tree.body.setSize(22, 16);
        tree.body.setOffset(21, 124);
      } else if (cfg.type === 'tree_pine_tall') {
        tree.body.setSize(24, 18);
        tree.body.setOffset(36, 186);
      } else if (cfg.type === 'tree_pine') {
        tree.body.setSize(18, 14);
        tree.body.setOffset(10, 60);
      } else {
        tree.body.setSize(16, 12);
        tree.body.setOffset(8, 48);
      }
      tree.refreshBody();
    });

    // ===== INTERACTIVE CUTTABLE / SHAKEABLE BUSHES =====
    this.bushes = [];
    const bushPositions = [
      [550, 480], [730, 480],
      [990, 380], [1210, 380], [150, 890], [350, 890],
      [420, 620], [840, 620], [1060, 480], [1180, 580],
      [380, 720], [480, 720], [820, 850], [940, 850],
      [460, 640], [820, 640], [460, 730], [820, 730],
      [280, 420], [280, 520], [980, 820], [1100, 820]
    ];

    bushPositions.forEach(([bx, by]) => {
      const bush = this.physics.add.sprite(bx, by, 'bush_large');
      bush.setDepth(by);
      bush.body.setSize(24, 18);
      bush.body.setOffset(5, 16);
      bush.body.setImmovable(true);
      bush.health = 2;
      this.bushes.push(bush);
    });

    // ===== SWAYING ANIMATED GRASS & WILDFLOWERS =====
    const meadowDecorations = [
      // Northwest / Cavern Meadow
      { x: 140, y: 320, type: 'tall_grass' },
      { x: 180, y: 340, type: 'grass_tuft_01' },
      { x: 220, y: 390, type: 'flower_patch_1' },
      { x: 280, y: 360, type: 'grass_tuft_02' },
      { x: 310, y: 400, type: 'grass_tuft_flowers' },
      { x: 340, y: 340, type: 'grass_tuft' },
      { x: 440, y: 220, type: 'purple_flower' },
      { x: 480, y: 260, type: 'tall_grass' },
      { x: 500, y: 340, type: 'flower_patch_2' },
      { x: 520, y: 390, type: 'grass_tuft_03' },

      // North Central / Manor Grounds
      { x: 740, y: 340, type: 'purple_flower' },
      { x: 760, y: 390, type: 'grass_tuft_flowers' },
      { x: 790, y: 250, type: 'tall_grass' },
      { x: 820, y: 380, type: 'grass_tuft_01' },
      { x: 860, y: 290, type: 'flower_patch_1' },
      { x: 890, y: 420, type: 'grass_tuft_02' },

      // West Meadow & Path to LinkedIn Embassy
      { x: 140, y: 640, type: 'grass_tuft_03' },
      { x: 180, y: 680, type: 'tall_grass' },
      { x: 220, y: 750, type: 'grass_tuft_flowers' },
      { x: 260, y: 720, type: 'flower_patch_2' },
      { x: 340, y: 660, type: 'grass_tuft_01' },
      { x: 380, y: 760, type: 'grass_tuft_02' },
      { x: 420, y: 710, type: 'purple_flower' },
      { x: 480, y: 660, type: 'tall_grass' },
      { x: 510, y: 740, type: 'grass_tuft_flowers' },

      // Southwest Zone
      { x: 140, y: 880, type: 'grass_tuft_01' },
      { x: 180, y: 920, type: 'flower_patch_2' },
      { x: 240, y: 960, type: 'grass_tuft_02' },
      { x: 280, y: 1020, type: 'grass_tuft_flowers' },
      { x: 320, y: 910, type: 'purple_flower' },
      { x: 380, y: 970, type: 'grass_tuft_03' },
      { x: 440, y: 880, type: 'tall_grass' },
      { x: 500, y: 930, type: 'flower_patch_1' },
      { x: 520, y: 1010, type: 'grass_tuft_01' },

      // Central Plaza Surrounds
      { x: 540, y: 590, type: 'grass_tuft_flowers' },
      { x: 740, y: 590, type: 'grass_tuft_02' },
      { x: 540, y: 770, type: 'purple_flower' },
      { x: 740, y: 770, type: 'flower_patch_1' },
      { x: 740, y: 880, type: 'grass_tuft_01' },
      { x: 800, y: 920, type: 'flower_patch_2' },
      { x: 860, y: 870, type: 'purple_flower' },
      { x: 920, y: 910, type: 'tall_grass' },
      { x: 950, y: 970, type: 'grass_tuft_flowers' },
      { x: 980, y: 870, type: 'flower_patch_1' },

      // East Meadow & Forge Grounds
      { x: 1220, y: 380, type: 'grass_tuft_01' },
      { x: 1250, y: 460, type: 'grass_tuft_flowers' },
      { x: 1280, y: 430, type: 'flower_patch_1' },
      { x: 1340, y: 390, type: 'flower_patch_2' },
      { x: 1370, y: 460, type: 'grass_tuft_02' },
      { x: 1400, y: 440, type: 'tall_grass' },
      { x: 1440, y: 380, type: 'purple_flower' },

      // Southeast Meadow (Flanking Botanical Garden)
      { x: 780, y: 710, type: 'grass_tuft_flowers' },
      { x: 810, y: 750, type: 'tall_grass' },
      { x: 1200, y: 620, type: 'grass_tuft_02' },
      { x: 1260, y: 660, type: 'purple_flower' },
      { x: 1320, y: 610, type: 'flower_patch_1' },
      { x: 1350, y: 690, type: 'grass_tuft_flowers' },
      { x: 1380, y: 650, type: 'flower_patch_2' },
      { x: 1440, y: 610, type: 'tall_grass' },
      { x: 1180, y: 860, type: 'grass_tuft_01' },
      { x: 1210, y: 920, type: 'grass_tuft_flowers' },
      { x: 1240, y: 900, type: 'flower_patch_1' },
      { x: 1300, y: 850, type: 'flower_patch_2' },
      { x: 1360, y: 890, type: 'tall_grass' }
    ];

    meadowDecorations.forEach(item => {
      const sprite = this.add.image(item.x, item.y, item.type);
      sprite.setDepth(3);
      if (item.type === 'tall_grass') {
        sprite.setScale(1.25);
      } else {
        sprite.setScale(1.0);
      }

      // Living wind oscillation tween with randomized duration
      this.tweens.add({
        targets: sprite,
        angle: { from: -4, to: 4 },
        duration: Phaser.Math.Between(1800, 2600),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 1400)
      });

      this.swayingFlora.push(sprite);
    });
  }

  buildCaveHills() {
    const caveX = 240;
    const caveY = 220;

    // 1. GRAND 16-BIT MOUNTAIN CLIFF BACKDROP BEHIND CAVE
    const mountainBackdrop = this.add.image(caveX + 10, caveY - 60, 'mountain_cliff_backdrop');
    mountainBackdrop.setDepth(3);
    mountainBackdrop.setScale(0.5);

    // Pines along high cliff rim
    const cliffPines = [
      { x: caveX - 180, y: caveY - 140 },
      { x: caveX - 80, y: caveY - 155 },
      { x: caveX + 60, y: caveY - 150 },
      { x: caveX + 160, y: caveY - 135 }
    ];
    cliffPines.forEach(pos => {
      const p = this.add.image(pos.x, pos.y, 'tree_pine_tall');
      p.setDepth(4);
      p.setScale(0.8);
    });

    // 2. High-Fidelity 3D Terraced Mountain with Arched Cavern Entrance
    const mountain = this.add.image(caveX, caveY, 'hill_cave_mountain');
    mountain.setDepth(6);

    // 3. Flanking Evergreen Spruces framing the Cavern entrance (Whole, complete trees)
    const spruceLeft = this.add.image(caveX - 135, caveY + 45, 'tree_spruce');
    spruceLeft.setDepth(8).setScale(0.85);

    const spruceRight = this.add.image(caveX + 145, caveY + 45, 'tree_spruce');
    spruceRight.setDepth(8).setScale(0.85);

    // 4. Heavy Mountain Boulders along perimeter
    const boulderPositions = [
      [caveX - 145, caveY + 25, 'boulder_large'],
      [caveX + 155, caveY + 30, 'boulder_large'],
      [caveX - 165, caveY - 20, 'rock_dark'],
      [caveX + 165, caveY - 15, 'rock_dark'],
      [caveX - 105, caveY + 95, 'rock_medium'],
      [caveX + 115, caveY + 95, 'rock_medium']
    ];

    boulderPositions.forEach(([bx, by, key]) => {
      const boulder = this.obstacles.create(bx, by, key);
      boulder.setDepth(7);
      boulder.body.setSize(20, 16);
      boulder.body.setOffset(4, 8);
      boulder.refreshBody();
    });

    // 5. AIRTIGHT MOUNTAIN & CAVE COLLIDERS (Completely prevents player walking on top of cave or climbing mountain)
    const addMountainWall = (x, y, bw, bh) => {
      const b = this.obstacles.create(x, y, 'blank_collider');
      b.setVisible(false);
      b.body.setSize(bw, bh);
      b.body.setOffset(8 - bw / 2, 8 - bh / 2);
      b.refreshBody();
      return b;
    };

    // Upper mountain cliff ridge: seals entire northern zone from x:0 to x:520, y:0 to y:260
    addMountainWall(260, 130, 520, 260);
    // Left mountain cliff wing: blocks x:0 to x:225, y:220 to y:340
    addMountainWall(112, 280, 225, 120);
    // Right mountain cliff wing: blocks x:255 to x:540, y:220 to y:340
    addMountainWall(397, 280, 285, 120);
    // Arched cave ceiling dome (blocks top of cave while keeping entrance accessible at caveY + 75)
    addMountainWall(caveX, caveY + 15, 120, 50);
  }

  buildGardens() {
    // ===== 1. ROYAL BOTANICAL & HERBAL GARDENS (Expanded Southeast Sanctuary) =====
    const gardenX = 1040;
    const gardenY = 760;
    const gW = 360;
    const gH = 260;
    const halfW = gW / 2;
    const halfH = gH / 2;

    // Rich, natural dark loam soil bed with soft rounded border
    const gardenSoil = this.add.graphics();
    gardenSoil.fillStyle(0x2d1b10, 0.92);
    gardenSoil.fillRoundedRect(gardenX - halfW, gardenY - halfH, gW, gH, 16);
    gardenSoil.lineStyle(3, 0x4a331c, 0.85);
    gardenSoil.strokeRoundedRect(gardenX - halfW, gardenY - halfH, gW, gH, 16);
    gardenSoil.setDepth(2);

    // Stone stepping path from West entrance to Pond and Rest Plaza
    const steppingStonePositions = [
      { x: gardenX - 170, y: gardenY },
      { x: gardenX - 135, y: gardenY },
      { x: gardenX - 100, y: gardenY },
      { x: gardenX - 65, y: gardenY },
      { x: gardenX - 30, y: gardenY + 25 },
      { x: gardenX + 10, y: gardenY + 45 },
      { x: gardenX + 50, y: gardenY + 45 },
      { x: gardenX + 90, y: gardenY + 45 },
      { x: gardenX + 130, y: gardenY + 25 }
    ];
    steppingStonePositions.forEach(pos => {
      const stone = this.add.image(pos.x, pos.y, 'garden_stepping_stone');
      stone.setDepth(3).setScale(1.1);
    });

    // Perimeter Wooden Picket Fences
    // North Fence
    for (let fx = gardenX - halfW + 16; fx <= gardenX + halfW - 16; fx += 32) {
      const fence = this.obstacles.create(fx, gardenY - halfH, 'garden_fence_horizontal');
      fence.setDepth(gardenY - halfH + 10);
      fence.body.setSize(30, 14);
      fence.body.setOffset(1, 10);
      fence.refreshBody();
    }

    // South Fence
    for (let fx = gardenX - halfW + 16; fx <= gardenX + halfW - 16; fx += 32) {
      const fence = this.obstacles.create(fx, gardenY + halfH, 'garden_fence_horizontal');
      fence.setDepth(gardenY + halfH + 10);
      fence.body.setSize(30, 14);
      fence.body.setOffset(1, 10);
      fence.refreshBody();
    }

    // East Fence
    for (let fy = gardenY - halfH + 20; fy <= gardenY + halfH - 20; fy += 28) {
      const fence = this.obstacles.create(gardenX + halfW, fy, 'garden_fence_vertical');
      fence.setDepth(fy + 10);
      fence.body.setSize(12, 26);
      fence.body.setOffset(0, 2);
      fence.refreshBody();
    }

    // West Fence (with 60px grand entrance opening at center: y from gardenY - 30 to gardenY + 30)
    for (let fy = gardenY - halfH + 20; fy <= gardenY - 35; fy += 28) {
      const fence = this.obstacles.create(gardenX - halfW, fy, 'garden_fence_vertical');
      fence.setDepth(fy + 10);
      fence.body.setSize(12, 26);
      fence.body.setOffset(0, 2);
      fence.refreshBody();
    }
    for (let fy = gardenY + 35; fy <= gardenY + halfH - 20; fy += 28) {
      const fence = this.obstacles.create(gardenX - halfW, fy, 'garden_fence_vertical');
      fence.setDepth(fy + 10);
      fence.body.setSize(12, 26);
      fence.body.setOffset(0, 2);
      fence.refreshBody();
    }

    // 1. Deluxe Stone Pond with Living Water Ripples
    const pond = this.add.image(gardenX - 55, gardenY - 25, 'garden_pond_deluxe').setDepth(4).setScale(1.2);
    this.tweens.add({
      targets: pond,
      scaleX: 1.23,
      scaleY: 1.17,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 2. Vegetable Planters with Real Crops
    const planters = [
      { x: gardenX + 45, y: gardenY - 70, type: 'garden_planter_carrots' },
      { x: gardenX + 75, y: gardenY - 70, type: 'garden_planter_cabbages' },
      { x: gardenX + 105, y: gardenY - 70, type: 'garden_planter_beets' },
      { x: gardenX + 135, y: gardenY - 70, type: 'garden_planter_carrots' },
      { x: gardenX + 60, y: gardenY + 80, type: 'garden_planter_cabbages' },
      { x: gardenX + 90, y: gardenY + 80, type: 'garden_planter_beets' },
      { x: gardenX + 120, y: gardenY + 80, type: 'garden_planter_carrots' }
    ];
    planters.forEach(p => {
      this.add.image(p.x, p.y, p.type).setDepth(p.y).setScale(1.2);
    });

    // 3. Scarecrow guarding the harvest
    this.add.image(gardenX + 155, gardenY - 50, 'scarecrow').setDepth(gardenY - 45).setScale(1.3);

    // 4. Two Wooden Park Benches
    const bench1 = this.obstacles.create(gardenX - 110, gardenY + 60, 'garden_bench');
    bench1.setDepth(gardenY + 65);
    bench1.body.setSize(36, 16);
    bench1.body.setOffset(12, 10);
    bench1.refreshBody();

    const bench2 = this.obstacles.create(gardenX + 40, gardenY - 15, 'garden_bench');
    bench2.setDepth(gardenY - 10);
    bench2.body.setSize(36, 16);
    bench2.body.setOffset(12, 10);
    bench2.refreshBody();

    // 5. Tall Purple Lavender Beds with Wind Sway
    const lavenderCoords = [
      { x: gardenX - 140, y: gardenY - 80 },
      { x: gardenX - 110, y: gardenY - 80 },
      { x: gardenX - 80, y: gardenY - 80 },
      { x: gardenX - 50, y: gardenY - 80 },
      { x: gardenX - 20, y: gardenY - 80 },
      { x: gardenX - 145, y: gardenY + 20 },
      { x: gardenX - 145, y: gardenY + 50 }
    ];
    lavenderCoords.forEach(pos => {
      const lav = this.add.image(pos.x, pos.y, 'garden_lavender').setDepth(pos.y).setScale(0.95);
      this.tweens.add({
        targets: lav,
        angle: { from: -4, to: 4 },
        duration: 1800 + Math.random() * 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.swayingFlora.push(lav);
    });

    // 6. Blooming Rose & Summer Flower Bushes
    const flowerBushes = [
      { x: gardenX - 145, y: gardenY - 40, type: 'garden_bush_roses' },
      { x: gardenX + 2, y: gardenY - 30, type: 'garden_bush_blooming' },
      { x: gardenX - 60, y: gardenY + 80, type: 'garden_bush_roses' },
      { x: gardenX - 20, y: gardenY + 80, type: 'garden_bush_blooming' },
      { x: gardenX + 145, y: gardenY + 40, type: 'garden_bush_roses' }
    ];
    flowerBushes.forEach(fb => {
      const bush = this.add.image(fb.x, fb.y, fb.type).setDepth(fb.y).setScale(0.9);
      this.swayingFlora.push(bush);
    });

    // 7. Animated Fluttering Butterflies in the Garden
    const createButterfly = (startX, startY, tintColor) => {
      const bfly = this.add.graphics();
      bfly.fillStyle(tintColor, 0.95);
      bfly.fillCircle(-2, -2, 2);
      bfly.fillCircle(2, -2, 2);
      bfly.fillEllipse(0, 0, 1.5, 4);
      bfly.setPosition(startX, startY);
      bfly.setDepth(15);

      this.tweens.add({
        targets: bfly,
        x: startX + Phaser.Math.Between(40, 80),
        y: startY + Phaser.Math.Between(-30, 30),
        duration: 3500 + Math.random() * 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.tweens.add({
        targets: bfly,
        scaleX: 0.35,
        duration: 120,
        yoyo: true,
        repeat: -1,
        ease: 'Linear'
      });
    };

    createButterfly(gardenX - 60, gardenY - 50, 0x4deeea);
    createButterfly(gardenX + 50, gardenY - 40, 0xffd166);
    createButterfly(gardenX + 80, gardenY + 30, 0xef476f);

    // 8. Signboard with razor-sharp modern font and zero emojis
    this.add.text(gardenX, gardenY - halfH - 24, "ROYAL BOTANICAL GARDENS\nRare Flora and Herbal Sanctuary", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#74ee15',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 9, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    // ===== 2. NATURAL MANOR AVENUE FLOWER BORDERS =====
    const leftBorderPositions = [
      { x: 570, y: 440 }, { x: 565, y: 470 }, { x: 570, y: 500 }, { x: 565, y: 530 }
    ];
    leftBorderPositions.forEach((pos, i) => {
      const fl = this.add.image(pos.x, pos.y, i % 2 === 0 ? 'garden_bush_blooming' : 'purple_flower');
      fl.setDepth(pos.y);
      fl.setScale(0.85);
      this.swayingFlora.push(fl);
    });

    const rightBorderPositions = [
      { x: 710, y: 440 }, { x: 715, y: 470 }, { x: 710, y: 500 }, { x: 715, y: 530 }
    ];
    rightBorderPositions.forEach((pos, i) => {
      const fl = this.add.image(pos.x, pos.y, i % 2 === 0 ? 'garden_bush_roses' : 'flower_patch_1');
      fl.setDepth(pos.y);
      fl.setScale(0.85);
      this.swayingFlora.push(fl);
    });
  }

  buildStructures() {
    // -----------------------------------------------------------------
    // 1. DIGONTA'S MANOR (Enterable - Authentic Medieval Emerald Manor)
    // -----------------------------------------------------------------
    const manorX = 640;
    const manorY = 270;

    this.manor = this.add.image(manorX, manorY, 'house_manor_emerald');
    this.manor.setDepth(manorY + 70); // 340 (allows player at y >= 370 in front of doorway to render in front)

    const addBuildingWall = (x, y, bw, bh) => {
      const b = this.obstacles.create(x, y, 'blank_collider');
      b.setVisible(false);
      b.body.setSize(bw, bh);
      b.body.setOffset(8 - bw / 2, 8 - bh / 2);
      b.refreshBody();
      return b;
    };

    // Complete solid roof, attic dormer, upper floor, and north perimeter colliders
    addBuildingWall(manorX, manorY - 80, 290, 220); // covers y=60 to 280, x=495 to 785
    // Left ground facade wall:
    addBuildingWall(manorX - 75, manorY + 65, 95, 70);
    // Right ground facade wall:
    addBuildingWall(manorX + 75, manorY + 65, 95, 70);
    // Solid door backstop wall (stops player from walking into or behind the closed wooden door above y=380):
    addBuildingWall(manorX, manorY + 80, 56, 30);

    // Arched Entrance Doorway sensor zone centered right at the door (640, 395)
    this.manorDoor = this.add.zone(manorX, 395, 64, 40);
    this.physics.world.enable(this.manorDoor);
    this.manorDoor.body.setAllowGravity(false);

    // Entrance Red Welcome Mat & Stone Steps centered at door (640, 390)
    const mat = this.add.graphics();
    mat.fillStyle(0x991b1b, 0.95);
    mat.fillRoundedRect(manorX - 24, 382, 48, 22, 4);
    mat.lineStyle(1.5, 0xffd166, 0.9);
    mat.strokeRoundedRect(manorX - 24, 382, 48, 22, 4);
    mat.setDepth(2);

    // Signboard with modern high-res font and zero emojis
    this.add.text(manorX, manorY - 135, "DIGONTA'S MANOR\n10 Project Labs Inside", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    // -----------------------------------------------------------------
    // 2. THE CAVERN OF RELICS (Achievements & Certs)
    // -----------------------------------------------------------------
    const caveX = 240;
    const caveY = 220;

    this.add.text(caveX, caveY - 120, "CAVERN OF RELICS\nAchievements and Honors", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#4deeea',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    // -----------------------------------------------------------------
    // 3. THE GITHUB FORGE (Blacksmith Shop)
    // -----------------------------------------------------------------
    const gitX = 1100;
    const gitY = 320;

    this.gitHouse = this.add.image(gitX, gitY, 'house_github');
    this.gitHouse.setDepth(gitY + 70);

    // Airtight solid collider covering entire GitHub house footprint, roof, chimney, and perimeter
    addBuildingWall(gitX, gitY - 15, 230, 240);

    const anvil = this.obstacles.create(gitX - 45, gitY + 90, 'station_anvil_clean');
    anvil.setDepth(gitY + 90);
    anvil.body.setSize(28, 24);
    anvil.refreshBody();

    const furnace = this.obstacles.create(gitX + 45, gitY + 90, 'station_furnace_clean');
    furnace.setDepth(gitY + 90);
    furnace.body.setSize(32, 40);
    furnace.refreshBody();

    this.add.text(gitX, gitY - 110, "THE GITHUB FORGE\n@DigontaDas", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    this.gitTrigger = this.add.zone(gitX, gitY + 90, 100, 60);
    this.physics.world.enable(this.gitTrigger);
    this.gitTrigger.body.setAllowGravity(false);
    this.gitTrigger.customType = 'github';

    // -----------------------------------------------------------------
    // 4. THE LINKEDIN EMBASSY (Guildhall)
    // -----------------------------------------------------------------
    const linkX = 250;
    const linkY = 820;

    this.linkHouse = this.add.image(linkX, linkY, 'house_linkedin');
    this.linkHouse.setDepth(linkY + 70);

    // Airtight solid collider covering entire LinkedIn house and roof
    addBuildingWall(linkX, linkY - 10, 220, 220);

    this.add.text(linkX, linkY - 105, "LINKEDIN EMBASSY\nProfessional Network", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#00b4d8',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    this.linkTrigger = this.add.zone(linkX, linkY + 90, 90, 60);
    this.physics.world.enable(this.linkTrigger);
    this.linkTrigger.body.setAllowGravity(false);
    this.linkTrigger.customType = 'linkedin';

    // -----------------------------------------------------------------
    // 5. TOWN SQUARE WELL
    // -----------------------------------------------------------------
    const wellX = 640;
    const wellY = 680;

    const well = this.obstacles.create(wellX, wellY, 'village_well');
    well.setDepth(8);
    well.body.setSize(30, 24);
    well.refreshBody();

    this.add.text(wellX, wellY - 32, "VILLAGE WELL", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#90e0ef',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);
  }

  setupGemstonePedestals() {
    this.gemstones = [];
    const caveX = 240;
    const caveY = 220;
    // Position gemstones with generous clearance below Malakor (who is at caveY + 75 = 295)
    const stoneConfigs = [
      { id: "cert-infinity", key: "gem_diamond", x: caveX - 80, y: caveY + 130, label: "[E] Infinity AI Finalist" },
      { id: "cert-edupro", key: "gem_emerald", x: caveX - 28, y: caveY + 140, label: "[E] EduPro Leeds Award" },
      { id: "cert-datacamp", key: "gem_sapphire", x: caveX + 28, y: caveY + 140, label: "[E] DataCamp Scientist" },
      { id: "cert-academic", key: "gem_amethyst", x: caveX + 80, y: caveY + 130, label: "[E] BRAC CSE & Master's" }
    ];

    stoneConfigs.forEach((cfg) => {
      const gem = this.add.image(cfg.x, cfg.y, cfg.key);
      gem.setDepth(cfg.y);

      this.tweens.add({
        targets: gem,
        y: cfg.y - 4,
        duration: 1000 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      const certData = CERTIFICATES_MATRIX.find(c => c.id === cfg.id);
      const sensor = this.add.zone(cfg.x, cfg.y, 40, 40);
      this.physics.world.enable(sensor);
      sensor.body.setAllowGravity(false);
      sensor.gemData = certData;
      sensor.promptLabel = cfg.label;

      this.gemstones.push(sensor);
    });
  }

  setupTrainingDummy() {
    const dummyX = 640;
    const dummyY = 560;

    this.dummy = this.physics.add.sprite(dummyX, dummyY, 'training_dummy');
    this.dummy.setDepth(dummyY);
    this.dummy.setScale(1.0);
    this.dummy.body.setSize(18, 14);
    this.dummy.body.setOffset(7, 32);
    this.dummy.body.setImmovable(true);
    this.dummy.health = 9999;

    this.add.text(dummyX, dummyY - 32, "TRAINING DUMMY\nAttack with J / F / Click", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);
  }

  setupNpcs() {
    // Standardized uniform character scaling: all NPCs scale 1.0
    // 1. Scholar NPC in the Town Square (west garden terrace alcove: 130px away from Village Well)
    this.scholar = this.physics.add.sprite(510, 675, 'npc_wizard');
    this.scholar.setScale(1.0);
    this.scholar.setDepth(675);
    this.scholar.body.setSize(18, 14);
    this.scholar.body.setOffset(7, 18);
    this.scholar.body.setImmovable(true);
    this.scholar.anims.play('npc-wizard-idle');

    this.add.text(510, 638, "ELDER SCHOLAR\nBRAC University Mentor", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

    this.scholarZone = this.add.zone(510, 675, 60, 60);
    this.physics.world.enable(this.scholarZone);
    this.scholarZone.body.setAllowGravity(false);
    this.scholarZone.customType = 'npc_scholar';

    // 2. Cave Guardian Villain Malakor at Cave entrance
    const caveX = 240;
    const caveY = 220;

    this.villain = this.physics.add.sprite(caveX, caveY + 75, 'mob_orc_warrior');
    this.villain.setScale(1.0);
    this.villain.setDepth(caveY + 75);
    this.villain.body.setSize(18, 14);
    this.villain.body.setOffset(7, 18);
    this.villain.body.setImmovable(true);
    this.villain.anims.play('mob-orc-idle');

    this.add.text(caveX, caveY + 45, "MALAKOR\nCave Sentinel", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ef4444',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

    this.villainZone = this.add.zone(caveX, caveY + 75, 60, 60);
    this.physics.world.enable(this.villainZone);
    this.villainZone.body.setAllowGravity(false);
    this.villainZone.customType = 'villain';

    // 3. Witch Morgana (Keeper of CV)
    const witchX = 450;
    const witchY = 550;
    const alchemyTable = this.obstacles.create(witchX - 30, witchY, 'station_witch_alchemy');
    alchemyTable.setDepth(witchY);
    alchemyTable.body.setSize(36, 32);

    this.witch = this.physics.add.sprite(witchX, witchY, 'npc_witch');
    this.witch.setScale(1.0);
    this.witch.setDepth(witchY);
    this.witch.body.setSize(18, 14);
    this.witch.body.setOffset(7, 18);
    this.witch.body.setImmovable(true);
    this.witch.anims.play('npc-witch-idle');

    this.add.text(witchX, witchY - 30, "WITCH MORGANA\nDownload Resume (PDF)", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#c084fc',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

    this.witchZone = this.add.zone(witchX, witchY, 60, 60);
    this.physics.world.enable(this.witchZone);
    this.witchZone.body.setAllowGravity(false);
    this.witchZone.customType = 'witch';

    // 4. SIR VALEN - Gate Guard Knight at South Boulevard
    const knightX = 640;
    const knightY = 1060;
    this.gateKnight = this.physics.add.sprite(knightX, knightY, 'npc_knight');
    this.gateKnight.setDepth(knightY);
    this.gateKnight.setScale(1.0);
    this.gateKnight.body.setSize(18, 14);
    this.gateKnight.body.setOffset(7, 18);
    this.gateKnight.body.setImmovable(true);
    this.gateKnight.anims.play('npc-knight-idle');

    this.add.text(knightX, knightY - 26, "SIR VALEN\nGate Knight", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

    this.knightZone = this.add.zone(knightX, knightY, 60, 60);
    this.physics.world.enable(this.knightZone);
    this.knightZone.body.setAllowGravity(false);
    this.knightZone.customType = 'guard_knight';

    // 5. Rogue Scout near East path
    this.rogue = this.physics.add.sprite(880, 350, 'npc_rogue');
    this.rogue.setDepth(350);
    this.rogue.setScale(1.0);
    this.rogue.body.setSize(18, 14);
    this.rogue.body.setOffset(7, 18);
    this.rogue.body.setImmovable(true);
    this.rogue.anims.play('npc-rogue-idle');

    this.add.text(880, 320, "SCOUT SHADOW\nEast Glade Watcher", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#38bdf8',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

    this.rogueZone = this.add.zone(880, 350, 60, 60);
    this.physics.world.enable(this.rogueZone);
    this.rogueZone.body.setAllowGravity(false);
    this.rogueZone.customType = 'rogue_scout';
  }

  createPlayer() {
    // Knight ground shadow
    this.playerShadow = this.add.ellipse(this.spawnCoords.x, this.spawnCoords.y + 16, 20, 9, 0x000000, 0.35);
    this.playerShadow.setDepth(9);

    // Uniform character scaling: player is scale 1.0 (matching all NPCs)
    this.player = this.physics.add.sprite(this.spawnCoords.x, this.spawnCoords.y, 'player_idle_down');
    this.player.setDepth(this.spawnCoords.y);
    this.player.setScale(1.0);

    // Precise foot hitbox
    this.player.body.setSize(18, 12);
    this.player.body.setOffset(23, 46);
    this.player.setCollideWorldBounds(true);

    // Collide with obstacles, buildings, interactive bushes, and ALL NPCs so character CANNOT go through them
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.bushes);
    this.physics.add.collider(this.player, [
      this.scholar,
      this.villain,
      this.witch,
      this.gateKnight,
      this.rogue,
      this.dummy
    ]);

    // Attack complete reset
    this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
      if (anim.key.startsWith('player-attack')) {
        this.isAttacking = false;
        this.player.anims.play(`player-idle-${this.lastDirection}`, true);
      }
    });
  }

  setupAmbientWeather(mapW, mapH) {
    // Subtle wind drifting particles (green leaves & dandelion spores)
    const graphics = this.add.graphics();
    graphics.fillStyle(0x74ee15, 0.8);
    graphics.fillCircle(3, 3, 2);
    graphics.generateTexture('wind_particle', 6, 6);
    graphics.destroy();

    const particles = this.add.particles(0, 0, 'wind_particle', {
      x: { min: 0, max: mapW },
      y: { min: 0, max: 20 },
      speedX: { min: -35, max: -15 },
      speedY: { min: 10, max: 25 },
      lifespan: 8000,
      scale: { start: 0.8, end: 0.2 },
      alpha: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 400
    });
    particles.setDepth(15);
  }

  setupInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.keys = this.input.keyboard.addKeys({
      attackJ: Phaser.Input.Keyboard.KeyCodes.J,
      attackF: Phaser.Input.Keyboard.KeyCodes.F,
      jumpK: Phaser.Input.Keyboard.KeyCodes.K,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });

    // Left-click for sword attack
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown() && !this.isInputPaused) {
        this.triggerAttack();
      }
    });
  }

  createInteractionPrompt() {
    this.promptContainer = this.add.container(0, 0);
    this.promptContainer.setDepth(100);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.graphics();

    this.promptText = this.add.text(0, 0, "", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center'
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);

    this.tweens.add({
      targets: this.promptContainer,
      y: '-=3',
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  showPrompt(text, targetY) {
    this.promptText.setText(text);
    const boxW = Math.max(120, this.promptText.width + 24);
    this.promptBg.clear();
    this.promptBg.fillStyle(0x0f172a, 0.95);
    this.promptBg.fillRoundedRect(-boxW / 2, -14, boxW, 28, 6);
    this.promptBg.lineStyle(1.5, 0xffd166, 0.9);
    this.promptBg.strokeRoundedRect(-boxW / 2, -14, boxW, 28, 6);

    // If target is above player (or at top), position prompt below player so it never obscures the NPC or object
    const isAbove = targetY !== undefined ? targetY < this.player.y : true;
    const promptY = isAbove ? this.player.y + 34 : this.player.y - 36;
    this.promptContainer.setPosition(this.player.x, promptY);
    this.promptContainer.setVisible(true);
  }

  enterManor() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    AudioFX.playPortal();

    this.cameras.main.fade(200, 0, 0, 0);
    this.time.delayedCall(200, () => {
      this.scene.start('HouseScene', { spawn: { x: 520, y: 460 } });
    });
  }

  triggerAttack() {
    if (this.isAttacking || this.isInputPaused || !this.player) return;

    this.isAttacking = true;
    AudioFX.playSlash();

    const animKey = `player-attack-${this.lastDirection}`;
    this.player.anims.play(animKey, true);

    // Hit detection area in front of sword swing
    let hitX = this.player.x;
    let hitY = this.player.y;
    const reach = 32;

    if (this.lastDirection === 'side') {
      hitX += this.player.flipX ? -reach : reach;
    } else if (this.lastDirection === 'up') {
      hitY -= reach;
    } else if (this.lastDirection === 'down') {
      hitY += reach;
    }

    // 1. Sparring Training Dummy hit
    if (this.dummy && Phaser.Math.Distance.Between(hitX, hitY, this.dummy.x, this.dummy.y) < 38) {
      AudioFX.playHit();
      this.tweens.add({
        targets: this.dummy,
        angle: { from: -10, to: 10 },
        duration: 80,
        yoyo: true,
        repeat: 3,
        ease: 'Linear',
        onComplete: () => { this.dummy.setAngle(0); }
      });

      this.showDamageNumber(this.dummy.x, this.dummy.y - 25, "45 DMG");
    }

    // 2. Interactive Bushes hit
    this.bushes.forEach(bush => {
      if (bush.active && Phaser.Math.Distance.Between(hitX, hitY, bush.x, bush.y) < 36) {
        AudioFX.playHit();
        bush.health -= 1;

        this.tweens.add({
          targets: bush,
          scaleX: 1.25,
          scaleY: 0.85,
          duration: 70,
          yoyo: true,
          repeat: 1
        });

        if (bush.health <= 0) {
          bush.destroy();
          AudioFX.playSkillGlow();
        }
      }
    });
  }

  showDamageNumber(x, y, text) {
    const dmg = this.add.text(x, y, text, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(50);

    this.tweens.add({
      targets: dmg,
      y: y - 28,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      onComplete: () => { dmg.destroy(); }
    });
  }

  triggerJump() {
    if (this.isJumping || this.isInputPaused || !this.player) return;

    this.isJumping = true;
    this.jumpStartTime = this.time.now;
    AudioFX.playJump();
  }

  update(time, delta) {
    if (!this.player || !this.player.body) return;

    // Dynamic Y-based depth sorting: player renders behind buildings when above them, in front when below
    this.player.setDepth(this.player.y);
    this.playerShadow.setDepth(this.player.y - 1);

    // Jumping visual arc: visual offset ONLY so player's physics body NEVER leaves the 2D ground plane
    if (this.isJumping) {
      const elapsed = time - this.jumpStartTime;
      const progress = Math.min(elapsed / this.jumpDuration, 1);
      const arc = Math.sin(progress * Math.PI);

      const jumpVisualOffset = arc * this.jumpHeight;
      this.player.displayOriginY = (this.player.height * 0.5) + jumpVisualOffset;
      const shadowScale = 1 - (arc * 0.4);
      this.playerShadow.setScale(shadowScale, shadowScale);

      if (progress >= 1) {
        this.isJumping = false;
        this.player.displayOriginY = this.player.height * 0.5;
        this.playerShadow.setScale(1, 1);
      }
    }
    this.playerShadow.setPosition(this.player.x, this.player.y + 16);

    if (this.isInputPaused) return;

    // Combat & Jump Key Triggers
    if (Phaser.Input.Keyboard.JustDown(this.keys.attackJ) || Phaser.Input.Keyboard.JustDown(this.keys.attackF)) {
      this.triggerAttack();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.jumpK)) {
      this.triggerJump();
    }

    let vx = 0;
    let vy = 0;

    const isLeft = this.cursors.left.isDown || this.wasd.left.isDown;
    const isRight = this.cursors.right.isDown || this.wasd.right.isDown;
    const isUp = this.cursors.up.isDown || this.wasd.up.isDown;
    const isDown = this.cursors.down.isDown || this.wasd.down.isDown;

    if (isLeft) vx -= 1;
    if (isRight) vx += 1;
    if (isUp) vy -= 1;
    if (isDown) vy += 1;

    const isSprinting = this.keys.shift.isDown;
    const currentSpeed = isSprinting ? 215 : 135;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    if (!this.isAttacking) {
      this.player.body.setVelocity(vx * currentSpeed, vy * currentSpeed);
    } else {
      this.player.body.setVelocity(vx * (currentSpeed * 0.3), vy * (currentSpeed * 0.3));
    }

    // Footstep Sound System
    const isMoving = vx !== 0 || vy !== 0;
    if (isMoving && !this.isJumping && time - this.lastStepTime > (isSprinting ? 220 : 320)) {
      this.lastStepTime = time;
      AudioFX.playStep();
    }

    // Grass rustling when player moves near swaying flora
    if (isMoving && time - this.lastRustleTime > 300) {
      for (let i = 0; i < this.swayingFlora.length; i++) {
        const item = this.swayingFlora[i];
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y) < 26) {
          this.lastRustleTime = time;
          this.tweens.add({
            targets: item,
            scaleX: 1.3,
            scaleY: 0.8,
            duration: 80,
            yoyo: true,
            repeat: 1
          });
          break;
        }
      }
    }

    // Directional Animation State Machine
    if (!this.isAttacking) {
      if (isLeft) {
        this.lastDirection = 'side';
        this.player.setFlipX(true);
        this.player.anims.play('player-run-side', true);
      } else if (isRight) {
        this.lastDirection = 'side';
        this.player.setFlipX(false);
        this.player.anims.play('player-run-side', true);
      } else if (isUp) {
        this.lastDirection = 'up';
        this.player.setFlipX(false);
        this.player.anims.play('player-run-up', true);
      } else if (isDown) {
        this.lastDirection = 'down';
        this.player.setFlipX(false);
        this.player.anims.play('player-run-down', true);
      } else {
        this.player.anims.play(`player-idle-${this.lastDirection}`, true);
      }
    }

    // Proximity Trigger Checks
    this.checkProximities();

    // Interact Action (Space)
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
      if (this.currentInteractable) {
        this.triggerActiveInteraction();
      } else {
        this.triggerJump();
      }
    }

    // Interact Action (E)
    if (Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
      this.triggerActiveInteraction();
    }
  }

  checkProximities() {
    let nearest = null;
    let minDist = 56;

    // 1. Manor Doorway - Auto-trigger if stepped on doorstep, or prompt [E]
    const isAtDoorstep = (Math.abs(this.player.x - 640) < 32 && this.player.y >= 380 && this.player.y <= 415);
    const distDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, 640, 395);
    if (isAtDoorstep && !this.isTransitioning) {
      this.enterManor();
      return;
    }
    if (distDoor < 60) {
      nearest = { type: 'manor_door', targetY: 380, label: "[E] Enter Manor" };
      minDist = distDoor;
    }

    // 2. Gemstone Relics
    this.gemstones.forEach(sensor => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, sensor.x, sensor.y);
      if (dist < minDist) {
        nearest = { type: 'gemstone', data: sensor.gemData, targetY: sensor.y, label: sensor.promptLabel };
        minDist = dist;
      }
    });

    // 3. GitHub Forge
    const distGit = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.gitTrigger.x, this.gitTrigger.y);
    if (distGit < minDist) {
      nearest = { type: 'github', targetY: this.gitTrigger.y, label: "[E] GitHub Forge" };
      minDist = distGit;
    }

    // 4. LinkedIn Embassy
    const distLink = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.linkTrigger.x, this.linkTrigger.y);
    if (distLink < minDist) {
      nearest = { type: 'linkedin', targetY: this.linkTrigger.y, label: "[E] LinkedIn Embassy" };
      minDist = distLink;
    }

    // 5. Scholar NPC
    const distScholar = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.scholarZone.x, this.scholarZone.y);
    if (distScholar < minDist) {
      nearest = { type: 'scholar', targetY: this.scholarZone.y, label: "[E] Talk to Scholar" };
      minDist = distScholar;
    }

    // 6. Cave Guardian Villain Malakor
    const distVillain = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.villainZone.x, this.villainZone.y);
    if (distVillain < minDist) {
      nearest = { type: 'villain', targetY: this.villainZone.y, label: "[E] Confront Sentinel" };
      minDist = distVillain;
    }

    // 7. Witch Morgana
    const distWitch = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.witchZone.x, this.witchZone.y);
    if (distWitch < minDist) {
      nearest = { type: 'witch', targetY: this.witchZone.y, label: "[E] Download Resume (PDF)" };
      minDist = distWitch;
    }

    // 8. Gate Knight Sir Valen
    const distKnight = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.knightZone.x, this.knightZone.y);
    if (distKnight < minDist) {
      nearest = { type: 'guard_knight', targetY: this.knightZone.y, label: "[E] Speak with Sir Valen" };
      minDist = distKnight;
    }

    // 9. Rogue Scout Shadow
    if (this.rogueZone) {
      const distRogue = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.rogueZone.x, this.rogueZone.y);
      if (distRogue < minDist) {
        nearest = { type: 'rogue_scout', targetY: this.rogueZone.y, label: "[E] Speak to Scout" };
        minDist = distRogue;
      }
    }

    if (nearest) {
      this.currentInteractable = nearest;
      this.showPrompt(nearest.label, nearest.targetY);
    } else {
      this.currentInteractable = null;
      this.promptContainer.setVisible(false);
    }
  }

  triggerActiveInteraction() {
    if (!this.currentInteractable) return;
    AudioFX.playInspect();

    switch (this.currentInteractable.type) {
      case 'manor_door':
        this.enterManor();
        break;
      case 'gemstone':
        GameBridge.emit(EVENTS.OPEN_CERTIFICATE_MODAL, this.currentInteractable.data);
        break;
      case 'github':
        GameBridge.emit(EVENTS.OPEN_SOCIAL_MODAL, {
          platform: "GitHub",
          username: "@DigontaDas",
          url: PERSONAL_INFO.socials.github,
          tagline: "Explore open-source deep learning repositories, RAG pipelines, and backends."
        });
        break;
      case 'linkedin':
        GameBridge.emit(EVENTS.OPEN_SOCIAL_MODAL, {
          platform: "LinkedIn",
          username: "Digonta Das",
          url: PERSONAL_INFO.socials.linkedin,
          tagline: "Connect with Digonta for AI Engineering, Research Collaborations, and Opportunities."
        });
        break;
      case 'scholar':
        GameBridge.emit(EVENTS.OPEN_NPC_MODAL, {
          name: "Elder Scholar of BRAC",
          bio: `${PERSONAL_INFO.name} is an ${PERSONAL_INFO.title} graduating from ${PERSONAL_INFO.education.institution} with a ${PERSONAL_INFO.education.gpa} GPA.`,
          roadmap: PERSONAL_INFO.education.roadmap,
          coursework: PERSONAL_INFO.education.coursework,
          cvUrl: PERSONAL_INFO.socials.cvFile
        });
        break;
      case 'villain':
        GameBridge.emit(EVENTS.OPEN_VILLAIN_MODAL, {
          name: "Malakor the Certification Sentinel",
          title: "Cave Boss Guardian"
        });
        break;
      case 'witch':
        AudioFX.playSkillGlow();
        GameBridge.emit(EVENTS.OPEN_WITCH_MODAL, {
          name: "Witch Morgana [Keeper of Scrolls]",
          cvUrl: PERSONAL_INFO.socials.cvFile
        });
        break;
      case 'guard_knight':
        GameBridge.emit(EVENTS.OPEN_NPC_MODAL, {
          name: "Sir Valen, Royal Gate Guard",
          bio: "Sworn protector of Digonta's Realm",
          roadmap: "Greetings, Fellow Knight! Digonta's Emerald Manor lies straight up north along this grand boulevard. Inside its Grand Hall and Labs, you will discover 10 groundbreaking systems — from 3D Tiled CNNs for Volumetric Vision to the MaSheba Health AI. Keep your sword sharp and your mind sharper!",
          coursework: ["Royal Guard Formations", "Blade Mastery & Parrying", "Knight Honor Code", "Distributed Defense Systems"],
          cvUrl: PERSONAL_INFO.socials.cvFile
        });
        break;
      case 'rogue_scout':
        GameBridge.emit(EVENTS.OPEN_NPC_MODAL, {
          name: "Scout Shadow, East Glade Watcher",
          bio: "Pathfinder and Realm Observer",
          roadmap: "Greetings, Knight! The paths of this realm connect Digonta's greatest engineering feats. Ahead lies the GitHub Forge where algorithms are tempered into code, and to the south blooms the Royal Botanical Gardens. Keep exploring!",
          coursework: ["Reconnaissance Routing", "High-Throughput Spatial Traversal", "System Diagnostics"],
          cvUrl: PERSONAL_INFO.socials.cvFile
        });
        break;
    }
  }
}
