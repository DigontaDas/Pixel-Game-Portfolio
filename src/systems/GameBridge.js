/**
 * GameBridge - Bi-directional Event Bus connecting Phaser Canvas and DOM HUD / Modals
 */

class GameBridgeEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        try {
          callback(payload);
        } catch (err) {
          console.error(`Error in GameBridge event handler for '${event}':`, err);
        }
      }
    }
  }
}

export const GameBridge = new GameBridgeEventEmitter();

// Common Event Constants
export const EVENTS = {
  // Proximity & Interaction
  PROXIMITY_ENTER: "PROXIMITY_ENTER",
  PROXIMITY_EXIT: "PROXIMITY_EXIT",
  
  // UI & Modals
  OPEN_PROJECT_MODAL: "OPEN_PROJECT_MODAL",
  OPEN_CERTIFICATE_MODAL: "OPEN_CERTIFICATE_MODAL",
  OPEN_SOCIAL_MODAL: "OPEN_SOCIAL_MODAL",
  OPEN_NPC_MODAL: "OPEN_NPC_MODAL",
  OPEN_WITCH_MODAL: "OPEN_WITCH_MODAL",
  OPEN_VILLAIN_MODAL: "OPEN_VILLAIN_MODAL",
  CLOSE_ALL_MODALS: "CLOSE_ALL_MODALS",
  
  // Game Input & Pause State
  SET_INPUT_PAUSED: "SET_INPUT_PAUSED",
  
  // Skills Reactive Lighting
  HIGHLIGHT_SKILLS: "HIGHLIGHT_SKILLS",
  RESET_SKILLS: "RESET_SKILLS",
  
  // Scene Navigation
  SCENE_TRANSITION: "SCENE_TRANSITION",
  LOCATION_CHANGED: "LOCATION_CHANGED",
  
  // Audio
  PLAY_SFX: "PLAY_SFX",
  TOGGLE_AUDIO: "TOGGLE_AUDIO"
};
