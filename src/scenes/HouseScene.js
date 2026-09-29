import Phaser from 'phaser';
import { GameBridge, EVENTS } from '../systems/GameBridge.js';
import { AudioFX } from '../systems/AudioManager.js';
import { PROJECTS_MATRIX } from '../systems/PortfolioData.js';

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super('HouseScene');
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.keys = null;
    this.currentProject = null;
    this.currentNpc = null;
    this.lastHighlightedProjectId = null;
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
  }

  init(data) {
    // Spawn safely in Grand Hall foyer, facing north into the room
    this.spawnCoords = data && data.spawn ? data.spawn : { x: 520, y: 460 };
    this.isTransitioning = true;
    this.time.delayedCall(200, () => {
      this.isTransitioning = false;
    });
  }

  create() {
    const houseW = 1100;
    const houseH = 620;
    this.physics.world.setBounds(0, 0, houseW, houseH);

    // Audio & Pause listener
    GameBridge.on(EVENTS.SET_INPUT_PAUSED, (paused) => {
      this.isInputPaused = paused;
      if (this.input && this.input.keyboard) {
        this.input.keyboard.resetKeys();
      }
      if (this.player && this.player.body) {
        this.player.body.setVelocity(0, 0);
        if (!this.isAttacking) {
          this.player.anims.play(`player-idle-${this.lastDirection}`, true);
        }
      }
    });

    GameBridge.emit(EVENTS.LOCATION_CHANGED, {
      title: "Digonta's Manor - Research Labs and Grand Hall",
      badge: "Interior Manor"
    });

    // 1. Handcrafted Interior Map (Tavern.png)
    const map = this.add.image(1280 / 2, 1280 / 2, 'interior_tavern_map');
    map.setDepth(0);

    // 2. Setup Collision Geometry & Walls
    this.setupInteriorColliders(houseW, houseH);

    // 3. Setup the 10 Project Stations at Real Tables
    this.setupProjectStations();

    // 4. Setup Tavern NPCs (Cook, Barkeep, Guest)
    this.setupTavernNpcs();

    // 5. Setup Exit Doors to Village
    this.setupExitStairs();

    // 6. Spawn Knight Player
    this.createPlayer();

    // 7. Camera (2.3x zoom for cozy interior)
    this.cameras.main.setBounds(0, 0, houseW, houseH);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(2.3);
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // 8. Setup Inputs
    this.setupInputs();

    // 9. Interaction Prompt
    this.createInteractionPrompt();
  }

  setupInteriorColliders(w, h) {
    this.walls = this.physics.add.staticGroup();

    const addWall = (x, y, bw, bh) => {
      const b = this.walls.create(x, y, 'blank_collider');
      b.setVisible(false);
      b.setDisplaySize(bw, bh);
      b.refreshBody();
      return b;
    };

    // 1. Thick Outer Boundary Barriers (Guarantees player cannot glitch out of bounds)
    addWall(550, 40, 1120, 80);    // North outer border
    addWall(550, 600, 1120, 80);   // South outer border
    addWall(20, 310, 40, 620);     // West outer border
    addWall(1080, 310, 80, 620);   // East outer border

    // 2. Room Perimeter Walls
    // North Wall Kitchen (covers back wall, stove, cooking pots, hood, and chimney flue: y=0 to 140, x=45 to 400)
    addWall(222, 70, 355, 140);
    // Stone bread oven upper block (x: 400 to 505, y: 0 to 155)
    addWall(452, 77, 105, 155);

    // North Wall Grand Hall / Bar Backroom (y=40 to 175, x=505 to 835)
    addWall(670, 107, 330, 135);

    // North Wall Second Floor (Elevated VIP Dining Room):
    // Wood paneling and windows above elevated floor (y=40 to 110, x=835 to 1050)
    addWall(942, 75, 215, 70);

    // West Wall of Second Floor (dividing it from dark void above bar counter: x=805 to 835, y=60 to 200)
    addWall(820, 130, 30, 140);

    // West Wall (x=0 to 75, y=90 to 570)
    addWall(45, 330, 90, 480);
    // East Wall (x=1020 to 1100, y=175 to 570)
    addWall(1050, 370, 70, 400);
    // South Wall Left of doorway (x=60 to 495, y=550 to 620)
    addWall(275, 575, 430, 60);
    // South Wall Right of doorway (x=545 to 1035, y=550 to 620)
    addWall(790, 575, 490, 60);
    // Doorway backstop (prevents player from walking south past the exit threshold into lower void)
    addWall(520, 565, 80, 40);

    // 3. Interior Stone Partition Walls
    // Stone dividing pillar between West Wing and Grand Hall (y=210 to 285, x=395 to 420)
    // Leaves upper hallway (y: 155 to 210) completely open so player can walk left into 2nd floor from stairs!
    addWall(407, 247, 25, 75);

    // Horizontal stone divider between Kitchen and lower cellar:
    // (x: 90 to 415, y: 285 to 355) - completely frees stairs at x >= 415 so player can go up and down!
    addWall(252, 320, 325, 70);

    // Vertical stone wall dividing cellar from hallway, with wide open doorway (y: 395 to 470):
    // Upper wall segment (y: 320 to 395)
    addWall(340, 357, 30, 75);
    // Lower wall segment (y: 470 to 570)
    addWall(340, 520, 30, 100);

    // 4. Furniture, Counters & Tables (Solid colliders covering table tops and chairs so player CANNOT walk on them)
    // Kitchen Prep Island Table & food (x: 190 to 360, y: 217 to 263)
    addWall(275, 240, 170, 46);
    // Bar Counter & Stools
    addWall(540, 330, 130, 32);
    addWall(610, 300, 26, 64);
    // Bar Back Shelves with glasses & bottles (x: 510 to 620, y: 200 to 240 - clear of stairs)
    addWall(565, 220, 110, 40);

    // West Lab Tables & Stations
    addWall(200, 440, 90, 42); // Cellar counter (SE-Mobile UNet)
    addWall(140, 550, 80, 42); // Lower prep table (Brain Tumor Seg)
    addWall(365, 520, 60, 42); // Study area (Skin Disease AI)

    // Grand Hall Dining & Studio Tables (Completely covers tables and chairs so player cannot climb on top)
    addWall(755, 365, 110, 64); // MaSheba AI (Red cloth table + chairs)
    addWall(755, 475, 110, 64); // REMEDY Platform (Wood table + chairs)
    addWall(755, 580, 110, 64); // Clarity Platform (Blue cloth table + chairs)
    addWall(965, 470, 60, 240);  // Long Banquet Table on far right
    addWall(555, 565, 90, 50);   // Center bottom table (Red cloth with bottles)

    // Elevated VIP Second Floor: Table and potted plants (cleanly positioned off the staircase!)
    addWall(930, 135, 54, 40);   // Elevated VIP round table & chairs (x: 903 to 957, y: 115 to 155)
    addWall(875, 105, 22, 20);   // Potted plant top left
    addWall(1030, 105, 22, 20);  // Potted plant top right
    addWall(910, 260, 16, 24);   // Narrow torch post on stairs (wide open passage on both sides)

    // Grand Hall Chandelier Columns / Torches
    addWall(650, 420, 28, 28);
    addWall(855, 420, 28, 28);
    addWall(650, 550, 28, 28);
    addWall(855, 550, 28, 28);
  }

  setupProjectStations() {
    this.stations = [];

    // Well-spaced, distinct table positions with zero wall collisions
    const tablePositions = {
      // WEST LAB: Medical AI & Computer Vision
      "project-1": { x: 230, y: 240, color: 0x4deeea, title: "3D Tiled CNN (Thesis)", wing: "Medical AI Lab" },
      "project-5": { x: 320, y: 240, color: 0x4deeea, title: "OT Safety Gate", wing: "Medical AI Lab" },
      "project-8": { x: 200, y: 440, color: 0x4deeea, title: "SE-Mobile UNet", wing: "Medical AI Lab" },
      "project-9": { x: 140, y: 550, color: 0x4deeea, title: "Brain Tumor Seg", wing: "Medical AI Lab" },
      "project-6": { x: 365, y: 520, color: 0x4deeea, title: "Skin Disease AI", wing: "Medical AI Lab" },

      // EAST GRAND HALL: AI Systems & Full-Stack Studio
      "project-3": { x: 755, y: 365, color: 0x74ee15, title: "MaSheba AI", wing: "Systems Studio" },
      "project-10": { x: 755, y: 475, color: 0x74ee15, title: "REMEDY Platform", wing: "Systems Studio" },
      "project-4": { x: 755, y: 580, color: 0x74ee15, title: "Clarity Platform", wing: "Systems Studio" },
      "project-7": { x: 960, y: 410, color: 0x74ee15, title: "Movie Rec AI RAG", wing: "Systems Studio" },
      "project-2": { x: 960, y: 530, color: 0x74ee15, title: "Dhaka Tesla Pool", wing: "Systems Studio" }
    };

    PROJECTS_MATRIX.forEach((project) => {
      const pos = tablePositions[project.id];
      if (!pos) return;

      // Table station floating badge with high-res font and depth 2000 (always in front of screen)
      this.add.text(pos.x, pos.y - 20, pos.title, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '9px',
        fontStyle: 'bold',
        color: '#ffffff',
        resolution: 3,
        align: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        padding: { x: 5, y: 2 }
      }).setOrigin(0.5).setDepth(2000);

      // Glowing magical holographic orb on table
      const orb = this.add.graphics();
      orb.fillStyle(pos.color, 0.4);
      orb.fillCircle(pos.x, pos.y - 4, 7);
      orb.fillStyle(pos.color, 0.9);
      orb.fillCircle(pos.x, pos.y - 4, 3.5);
      orb.setDepth(14);

      this.tweens.add({
        targets: orb,
        alpha: 0.4,
        duration: 800 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Spatial trigger zone
      const sensor = this.add.zone(pos.x, pos.y, 48, 48);
      this.physics.world.enable(sensor);
      sensor.body.setAllowGravity(false);
      sensor.projectData = project;

      this.stations.push(sensor);
    });
  }

  setupTavernNpcs() {
    this.tavernNpcs = [];

    // Uniform character scaling: all characters scaled to 1.35
    // 1. Kitchen Master Chef (standing realistically in front of the restored stove)
    this.cook = this.physics.add.sprite(150, 195, 'npc_cook');
    this.cook.setDepth(195);
    this.cook.setScale(1.0);
    this.cook.body.setSize(18, 14);
    this.cook.body.setOffset(23, 36);
    this.cook.body.setImmovable(true);
    this.cook.anims.play('npc-cook-idle');

    this.add.text(150, 160, "ALGORITHM CHEF", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#4deeea',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(2000);

    const cookZone = this.add.zone(150, 195, 52, 52);
    this.physics.world.enable(cookZone);
    cookZone.body.setAllowGravity(false);
    cookZone.dialogue = {
      name: "Tavern Algorithm Chef",
      bio: "Master of Volumetric Medical Vision",
      roadmap: "Welcome to the Medical AI Kitchen! Here we brew 3D Tiled CNNs for coronary artery blockage detection and U-Net segmentations for clinical diagnostics. Each dish is trained on real MRI and CT voxels!",
      coursework: ["Volumetric Medical Vision", "3D Convolutional Kernels", "PyTorch GPU Sharding", "Clinical Validation"],
      cvUrl: "/Digonta_CV.pdf"
    };
    cookZone.label = "[E] Speak to Chef";
    this.tavernNpcs.push(cookZone);

    // 2. Bar Counter Bartender
    this.barkeep = this.physics.add.sprite(580, 290, 'npc_barkeep');
    this.barkeep.setDepth(9);
    this.barkeep.setScale(1.35);
    this.barkeep.body.setSize(18, 14);
    this.barkeep.body.setOffset(23, 36);
    this.barkeep.body.setImmovable(true);
    this.barkeep.anims.play('npc-barkeep-idle');

    this.add.text(580, 254, "MASTER INNKEEPER", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(2000);

    const barZone = this.add.zone(580, 290, 56, 56);
    this.physics.world.enable(barZone);
    barZone.body.setAllowGravity(false);
    barZone.dialogue = {
      name: "Tavern Innkeeper",
      bio: "Overseer of Digonta's Grand Manor",
      roadmap: "Welcome, weary developer! Pull up a chair to any table in this hall. Each table is imbued with one of Digonta's 10 major systems — from the Dhaka Tesla Pool ride-sharing engine to the MaSheba offline maternal health platform!",
      coursework: ["Microservices Architecture", "Real-Time WebSocket Streams", "Distributed Event Queues", "FastAPI Endpoints"],
      cvUrl: "/Digonta_CV.pdf"
    };
    barZone.label = "[E] Speak to Innkeeper";
    this.tavernNpcs.push(barZone);

    // 3. Visiting Researcher Guest in the Grand Hall
    this.guest = this.physics.add.sprite(610, 480, 'npc_guest');
    this.guest.setDepth(9);
    this.guest.setScale(1.35);
    this.guest.body.setSize(18, 14);
    this.guest.body.setOffset(23, 36);
    this.guest.body.setImmovable(true);
    this.guest.anims.play('npc-guest-idle');

    this.add.text(610, 444, "VISITING RESEARCHER", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#c084fc',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(2000);

    const guestZone = this.add.zone(610, 480, 56, 56);
    this.physics.world.enable(guestZone);
    guestZone.body.setAllowGravity(false);
    guestZone.dialogue = {
      name: "Visiting AI Researcher",
      bio: "Peer Reviewer and Collaborator",
      roadmap: "I have reviewed Digonta's thesis and codebase. The precision of the 3D CNN tiled patch processing eliminates edge boundary degradation in volumetric scans. A remarkable young engineer!",
      coursework: ["IEEE Paper Ingestion", "Confusion Matrix Analysis", "Dice Coefficient Optimization", "LaTeX Formatting"],
      cvUrl: "/Digonta_CV.pdf"
    };
    guestZone.label = "[E] Speak to Researcher";
    this.tavernNpcs.push(guestZone);
  }

  setupExitStairs() {
    // Village exit doorway at the south entrance of the foyer
    const exitX = 520;
    const exitY = 520;

    // Red exit welcome mat
    const mat = this.add.graphics();
    mat.fillStyle(0x991b1b, 0.95);
    mat.fillRoundedRect(exitX - 22, exitY - 10, 44, 20, 3);
    mat.lineStyle(1, 0xffd166, 0.8);
    mat.strokeRoundedRect(exitX - 22, exitY - 10, 44, 20, 3);
    mat.setDepth(2);

    this.add.text(exitX, exitY + 18, "VILLAGE EXIT", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5).setDepth(2000);

    this.exitSensor = this.add.zone(exitX, exitY, 50, 30);
    this.physics.world.enable(this.exitSensor);
    this.exitSensor.body.setAllowGravity(false);
  }

  createPlayer() {
    // Shadow
    this.playerShadow = this.add.ellipse(this.spawnCoords.x, this.spawnCoords.y + 18, 26, 11, 0x000000, 0.35);
    this.playerShadow.setDepth(9);

    // Uniform character scaling: player is scale 1.35 (matching all NPCs)
    this.player = this.physics.add.sprite(this.spawnCoords.x, this.spawnCoords.y, 'player_idle_up');
    this.player.setDepth(10);
    this.player.setScale(1.35);

    // Precise foot hitbox
    this.player.body.setSize(18, 12);
    this.player.body.setOffset(23, 46);
    this.player.setCollideWorldBounds(true);

    // Collide with walls AND all NPCs so player CANNOT walk through anyone
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, [this.cook, this.barkeep, this.guest]);

    // Reset attacking
    this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
      if (anim.key.startsWith('player-attack')) {
        this.isAttacking = false;
        this.player.anims.play(`player-idle-${this.lastDirection}`, true);
      }
    });
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

    // Physical hardware key tracker to guarantee no keys ever stick
    this.activeKeyCodes = new Set();
    const onKeyDown = (e) => {
      this.activeKeyCodes.add(e.code);
    };
    const onKeyUp = (e) => {
      this.activeKeyCodes.delete(e.code);
      if (this.activeKeyCodes.size === 0) {
        if (this.input && this.input.keyboard) {
          this.input.keyboard.resetKeys();
        }
        if (this.player && this.player.body && !this.isAttacking) {
          this.player.body.setVelocity(0, 0);
          this.player.anims.play(`player-idle-${this.lastDirection}`, true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Reset stuck keys on window blur or tab switch
    const resetAllKeys = () => {
      this.activeKeyCodes.clear();
      if (this.input && this.input.keyboard) {
        this.input.keyboard.resetKeys();
      }
      if (this.player && this.player.body) {
        this.player.body.setVelocity(0, 0);
        if (!this.isAttacking) {
          this.player.anims.play(`player-idle-${this.lastDirection}`, true);
        }
      }
    };
    window.addEventListener('blur', resetAllKeys);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetAllKeys();
    });
  }

  createInteractionPrompt() {
    this.promptContainer = this.add.container(0, 0);
    this.promptContainer.setDepth(3000);
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

    const isAbove = targetY !== undefined ? targetY < this.player.y : true;
    const promptY = isAbove ? this.player.y + 34 : this.player.y - 36;
    this.promptContainer.setPosition(this.player.x, promptY);
    this.promptContainer.setVisible(true);
  }

  exitManor() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    AudioFX.playPortal();

    GameBridge.emit(EVENTS.RESET_SKILLS);

    this.cameras.main.fade(200, 0, 0, 0);
    this.time.delayedCall(200, () => {
      this.scene.start('VillageScene', { spawn: { x: 640, y: 440 } });
    });
  }

  triggerAttack() {
    if (this.isAttacking || this.isInputPaused || !this.player) return;

    this.isAttacking = true;
    AudioFX.playSlash();

    const animKey = `player-attack-${this.lastDirection}`;
    this.player.anims.play(animKey, true);
  }

  triggerJump() {
    if (this.isJumping || this.isInputPaused || !this.player) return;

    this.isJumping = true;
    this.jumpStartTime = this.time.now;
    AudioFX.playJump();
  }

  update(time, delta) {
    if (!this.player || !this.player.body) return;

    // Jumping visual arc: visual offset ONLY so player's physics body NEVER leaves the 2D ground plane
    if (this.isJumping) {
      const elapsed = time - this.jumpStartTime;
      const progress = Math.min(elapsed / this.jumpDuration, 1);
      const arc = Math.sin(progress * Math.PI);

      const jumpVisualOffset = arc * this.jumpHeight;
      this.player.displayOriginY = (this.player.height / 2) + jumpVisualOffset;
      const shadowScale = 1 - (arc * 0.4);
      this.playerShadow.setScale(shadowScale, shadowScale);

      if (progress >= 1) {
        this.isJumping = false;
        this.player.displayOriginY = this.player.height / 2;
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

    const hasPhysicalKey = (code) => this.activeKeyCodes && this.activeKeyCodes.has(code);
    const isLeft = (this.cursors.left.isDown || this.wasd.left.isDown) && (hasPhysicalKey('ArrowLeft') || hasPhysicalKey('KeyA'));
    const isRight = (this.cursors.right.isDown || this.wasd.right.isDown) && (hasPhysicalKey('ArrowRight') || hasPhysicalKey('KeyD'));
    const isUp = (this.cursors.up.isDown || this.wasd.up.isDown) && (hasPhysicalKey('ArrowUp') || hasPhysicalKey('KeyW'));
    const isDown = (this.cursors.down.isDown || this.wasd.down.isDown) && (hasPhysicalKey('ArrowDown') || hasPhysicalKey('KeyS'));

    if (isLeft) vx -= 1;
    if (isRight) vx += 1;
    if (isUp) vy -= 1;
    if (isDown) vy += 1;

    const isSprinting = this.keys.shift.isDown && (hasPhysicalKey('ShiftLeft') || hasPhysicalKey('ShiftRight'));
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
    if (isMoving && !this.isJumping && time - this.lastStepTime > (isSprinting ? 230 : 340)) {
      this.lastStepTime = time;
      AudioFX.playStep();
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

    // Proximity checks for stations, exit, and NPCs
    this.checkProjectProximities();

    // Interact Action (Space)
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
      if (this.currentProject || this.currentNpc || this.isNearExit) {
        this.triggerActiveProjectModal();
      } else {
        this.triggerJump();
      }
    }

    // Interact Action (E)
    if (Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
      this.triggerActiveProjectModal();
    }
  }

  checkProjectProximities() {
    let nearestProject = null;
    let nearestNpc = null;
    let minDist = 48;
    this.isNearExit = false;

    // Check exit door distance
    const distExit = Phaser.Math.Distance.Between(this.player.x, this.player.y, 520, 520);
    if (distExit < 32 && !this.isTransitioning) {
      this.exitManor();
      return;
    }
    if (distExit < 50) {
      this.isNearExit = true;
      this.showPrompt("[E] Exit to Village", 520);
      return;
    }

    this.stations.forEach(sensor => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, sensor.x, sensor.y);
      if (dist < minDist) {
        nearestProject = sensor.projectData;
        minDist = dist;
      }
    });

    if (this.tavernNpcs) {
      this.tavernNpcs.forEach(zone => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
        if (dist < minDist) {
          nearestProject = null;
          nearestNpc = zone;
          minDist = dist;
        }
      });
    }

    if (nearestProject) {
      this.currentProject = nearestProject;
      this.currentNpc = null;
      this.showPrompt(`[E] ${nearestProject.title}`, nearestProject.y);

      if (this.lastHighlightedProjectId !== nearestProject.id) {
        this.lastHighlightedProjectId = nearestProject.id;
        AudioFX.playSkillGlow();
        GameBridge.emit(EVENTS.HIGHLIGHT_SKILLS, nearestProject.skills);
      }
    } else if (nearestNpc) {
      this.currentProject = null;
      this.currentNpc = nearestNpc;
      this.showPrompt(nearestNpc.label, nearestNpc.y);

      if (this.lastHighlightedProjectId !== null) {
        this.lastHighlightedProjectId = null;
        GameBridge.emit(EVENTS.RESET_SKILLS);
      }
    } else {
      this.currentProject = null;
      this.currentNpc = null;
      this.promptContainer.setVisible(false);

      if (this.lastHighlightedProjectId !== null) {
        this.lastHighlightedProjectId = null;
        GameBridge.emit(EVENTS.RESET_SKILLS);
      }
    }
  }

  triggerActiveProjectModal() {
    if (this.isNearExit) {
      this.exitManor();
    } else if (this.currentProject) {
      AudioFX.playInspect();
      GameBridge.emit(EVENTS.OPEN_PROJECT_MODAL, this.currentProject);
    } else if (this.currentNpc) {
      AudioFX.playInspect();
      GameBridge.emit(EVENTS.OPEN_NPC_MODAL, this.currentNpc.dialogue);
    }
  }
}
