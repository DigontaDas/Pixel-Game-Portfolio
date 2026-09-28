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
      b.body.setSize(bw, bh);
      b.body.setOffset(8 - bw / 2, 8 - bh / 2);
      b.refreshBody();
      return b;
    };

    // 1. Thick Outer Boundary Barriers (Guarantees player cannot glitch out of bounds)
    addWall(550, 40, 1120, 80);    // North outer border
    addWall(550, 600, 1120, 80);   // South outer border
    addWall(20, 310, 40, 620);     // West outer border
    addWall(1080, 310, 80, 620);   // East outer border

    // 2. Room Perimeter Walls
    // North Wall Kitchen (covers back wall, stove, cooking pots, hood, and chimney flue: y=0 to 155, x=45 to 380)
    addWall(215, 75, 340, 155);
    // North Wall Grand Hall (y=40 to 195, x=380 to 1040)
    addWall(710, 115, 660, 160);
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
    // Thick stone dividing wall between West Wing and Grand Hall (x=370 to 430, y=60 to 440)
    // Completely seals the vertical black void corridor where player could walk inside walls
    addWall(400, 250, 60, 380);

    // Horizontal partition dividing Kitchen from lower medical lab (y=290, leaves opening at x=310..370)
    addWall(185, 290, 240, 36);
    // Cellar stairs blocker on west wall
    addWall(75, 270, 40, 60);
    // Thick vertical divider in lower west room (x=275, y=290 to 560)
    addWall(275, 425, 30, 270);

    // 4. Furniture, Counters & Tables (Solid colliders so player cannot walk inside them)
    // Kitchen Prep Island Table
    addWall(210, 210, 80, 30);
    // Bar Counter
    addWall(540, 330, 130, 28);
    addWall(610, 300, 24, 60);

    // West Lab Tables & Stations (Clean non-overlapping colliders)
    addWall(220, 230, 70, 28); // 3D Tiled CNN
    addWall(320, 230, 70, 28); // OT Safety Gate
    addWall(180, 360, 60, 28); // SE-Mobile UNet
    addWall(130, 440, 60, 28); // Brain Tumor Seg
    addWall(230, 470, 60, 28); // Skin Disease AI
    addWall(195, 525, 90, 40); // Recreation Pool Table

    // Grand Hall Dining & Studio Tables
    addWall(780, 280, 74, 28); // MaSheba AI
    addWall(780, 395, 74, 28); // REMEDY Platform
    addWall(780, 505, 74, 28); // Clarity Platform
    addWall(940, 350, 45, 40); // Movie Rec AI RAG
    addWall(940, 470, 45, 40); // Dhaka Tesla Pool
    addWall(985, 440, 32, 230); // Long Banquet Table
  }

  setupProjectStations() {
    this.stations = [];

    // Well-spaced, distinct table positions with zero text collisions
    const tablePositions = {
      // WEST LAB: Medical AI & Computer Vision
      "project-1": { x: 220, y: 230, color: 0x4deeea, title: "3D Tiled CNN (Thesis)", wing: "Medical AI Lab" },
      "project-5": { x: 320, y: 230, color: 0x4deeea, title: "OT Safety Gate", wing: "Medical AI Lab" },
      "project-8": { x: 180, y: 360, color: 0x4deeea, title: "SE-Mobile UNet", wing: "Medical AI Lab" },
      "project-9": { x: 130, y: 440, color: 0x4deeea, title: "Brain Tumor Seg", wing: "Medical AI Lab" },
      "project-6": { x: 230, y: 470, color: 0x4deeea, title: "Skin Disease AI", wing: "Medical AI Lab" },

      // EAST GRAND HALL: AI Systems & Full-Stack Studio
      "project-3": { x: 780, y: 280, color: 0x74ee15, title: "MaSheba AI", wing: "Systems Studio" },
      "project-10": { x: 780, y: 395, color: 0x74ee15, title: "REMEDY Platform", wing: "Systems Studio" },
      "project-4": { x: 780, y: 505, color: 0x74ee15, title: "Clarity Platform", wing: "Systems Studio" },
      "project-7": { x: 940, y: 350, color: 0x74ee15, title: "Movie Rec AI RAG", wing: "Systems Studio" },
      "project-2": { x: 940, y: 470, color: 0x74ee15, title: "Dhaka Tesla Pool", wing: "Systems Studio" }
    };

    PROJECTS_MATRIX.forEach((project) => {
      const pos = tablePositions[project.id];
      if (!pos) return;

      // Table station floating badge with high-res font and compact padding
      this.add.text(pos.x, pos.y - 20, pos.title, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '9px',
        fontStyle: 'bold',
        color: '#ffffff',
        resolution: 3,
        align: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        padding: { x: 5, y: 2 }
      }).setOrigin(0.5).setDepth(15);

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

    // Uniform character scaling: all characters scaled to 1.0
    // 1. Kitchen Master Chef (standing at preparation table with clear space)
    this.cook = this.physics.add.sprite(130, 200, 'npc_cook');
    this.cook.setDepth(200);
    this.cook.setScale(1.0);
    this.cook.body.setSize(18, 14);
    this.cook.body.setOffset(23, 36);
    this.cook.body.setImmovable(true);
    this.cook.anims.play('npc-cook-idle');

    this.add.text(130, 168, "ALGORITHM CHEF", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#4deeea',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

    const cookZone = this.add.zone(130, 200, 52, 52);
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
    this.barkeep.setScale(1.0);
    this.barkeep.body.setSize(18, 14);
    this.barkeep.body.setOffset(23, 36);
    this.barkeep.body.setImmovable(true);
    this.barkeep.anims.play('npc-barkeep-idle');

    this.add.text(580, 260, "MASTER INNKEEPER", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffd166',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

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
    this.guest.setScale(1.0);
    this.guest.body.setSize(18, 14);
    this.guest.body.setOffset(23, 36);
    this.guest.body.setImmovable(true);
    this.guest.anims.play('npc-guest-idle');

    this.add.text(610, 450, "VISITING RESEARCHER", {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#c084fc',
      resolution: 3,
      align: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(15);

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
    }).setOrigin(0.5).setDepth(20);

    this.exitSensor = this.add.zone(exitX, exitY, 50, 30);
    this.physics.world.enable(this.exitSensor);
    this.exitSensor.body.setAllowGravity(false);
  }

  createPlayer() {
    // Shadow
    this.playerShadow = this.add.ellipse(this.spawnCoords.x, this.spawnCoords.y + 16, 20, 9, 0x000000, 0.35);
    this.playerShadow.setDepth(9);

    // Uniform character scaling: player is scale 1.0 (matching all NPCs)
    this.player = this.physics.add.sprite(this.spawnCoords.x, this.spawnCoords.y, 'player_idle_up');
    this.player.setDepth(10);
    this.player.setScale(1.0);

    // Tight 16x10 foot hitbox
    this.player.body.setSize(16, 10);
    this.player.body.setOffset(24, 48);
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
