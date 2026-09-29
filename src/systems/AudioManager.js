/**
 * Procedural 8-bit Audio Manager using Web Audio API
 * Generates authentic retro chiptune SFX without external audio asset downloads.
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    // Sound is always ON by default as requested
    this.muted = false;
    this.lastStepTime = 0;

    // BGM (Background Music) system
    this.bgmAudio = null;
    this.bgmStarted = false;
    this.bgmVolume = 0.30;
    this.bgmTracks = [
      '/assets/audio/bgm_littleroot_town.mp3',
      '/assets/audio/bgm_route101.mp3'
    ];
    this.bgmCurrentIndex = 0;

    // Auto-start BGM on first user interaction (bypasses browser autoplay policy)
    this._startBGMOnInteraction();
  }

  _startBGMOnInteraction() {
    if (typeof window === "undefined") return;

    const startHandler = () => {
      this.startMusic();
      window.removeEventListener('click', startHandler);
      window.removeEventListener('keydown', startHandler);
      window.removeEventListener('pointerdown', startHandler);
      window.removeEventListener('touchstart', startHandler);
    };

    window.addEventListener('click', startHandler, { once: false, passive: true });
    window.addEventListener('keydown', startHandler, { once: false, passive: true });
    window.addEventListener('pointerdown', startHandler, { once: false, passive: true });
    window.addEventListener('touchstart', startHandler, { once: false, passive: true });
  }

  startMusic() {
    this.muted = false;
    this.initContext();
    this.playBGM();
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
      this.bgmAudio.play().catch(() => {});
    }
    const icon = document.getElementById('audio-icon');
    const btn = document.getElementById('audio-toggle-btn');
    if (icon) icon.textContent = "SOUND ON";
    if (btn) btn.classList.remove('muted');
  }

  playBGM(trackUrl) {
    try {
      if (!trackUrl) {
        trackUrl = this.bgmTracks[this.bgmCurrentIndex];
      }

      // If already playing, don't restart
      if (this.bgmAudio && this.bgmStarted && !this.bgmAudio.paused) {
        return;
      }

      // Create new Audio element
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio();
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;

        // When track ends naturally (shouldn't happen with loop), play next
        this.bgmAudio.addEventListener('ended', () => {
          this.bgmCurrentIndex = (this.bgmCurrentIndex + 1) % this.bgmTracks.length;
          this.bgmAudio.src = this.bgmTracks[this.bgmCurrentIndex];
          this.bgmAudio.play().catch(() => {});
        });
      }

      this.bgmAudio.src = trackUrl;
      this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
      
      const playPromise = this.bgmAudio.play();
      if (playPromise) {
        playPromise.then(() => {
          this.bgmStarted = true;
        }).catch(() => {
          // Autoplay blocked; will retry on next interaction
        });
      }
    } catch (err) {
      // Audio not supported
    }
  }

  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmStarted = false;
    }
  }

  /**
   * Switch BGM track (e.g., when entering a house)
   */
  switchBGM(trackUrl) {
    if (this.bgmAudio) {
      this.bgmAudio.src = trackUrl;
      this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
      if (this.bgmStarted) {
        this.bgmAudio.play().catch(() => {});
      }
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem("digonta_rpg_muted", String(this.muted));
    } catch (e) {}

    // Also mute/unmute BGM
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
    }

    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playStep() {
    if (this.muted) return;
    const now = Date.now();
    if (now - this.lastStepTime < 240) return; // Prevent audio congestion
    this.lastStepTime = now;

    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(110 + Math.random() * 25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (err) {}
  }

  playInspect() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.05, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.13);
      });
    } catch (err) {}
  }

  playPortal() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (err) {}
  }

  playSkillGlow() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (err) {}
  }

  playClose() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [659.25, 440]; // E5, A4
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.04, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.11);
      });
    } catch (err) {}
  }

  playSlash() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // White noise swoosh burst
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // Metallic blade ring tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

      oscGain.gain.setValueAtTime(0.04, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (err) {}
  }

  playJump() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (err) {}
  }

  playHit() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (err) {}
  }
}

export const AudioFX = new AudioManager();
