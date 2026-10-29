/**
 * BoonBox - Procedural Web Audio API Sound Synthesizer
 * 100% zero-asset procedural audio generation: No external MP3/WAV files required.
 */

class BoonAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('boonbox_muted') === 'true';
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.35;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('boonbox_muted', this.isMuted);
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /**
   * Delicate crystal bell ping on hover
   */
  playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Mystical energetic chest rattle / anticipation sound
   */
  playRattle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.2;

    // Modulated rumbling tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.linearRampToValueAtTime(220, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + duration * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);

    // Chime clicks during shake
    for (let i = 0; i < 6; i++) {
      const clickTime = now + (i * 0.18) + (Math.random() * 0.05);
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();

      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(400 + Math.random() * 600, clickTime);

      clickGain.gain.setValueAtTime(0.07, clickTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.08);

      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);

      clickOsc.start(clickTime);
      clickOsc.stop(clickTime + 0.08);
    }
  }

  /**
   * Chest lid burst open sound
   */
  playOpen() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sweeping magical whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.6);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  /**
   * Rarity-based fanfare chords
   */
  playFanfare(rarity = 'common') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.1;

    let notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Common)
    let duration = 0.8;

    if (rarity === 'rare') {
      notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Rare)
      duration = 1.2;
    } else if (rarity === 'epic') {
      notes = [440.0, 554.37, 659.25, 830.61, 1108.73]; // A major 7th chord (Epic)
      duration = 1.6;
    } else if (rarity === 'legendary') {
      notes = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // Celestial radiant cascade (Legendary)
      duration = 2.4;
    }

    notes.forEach((freq, idx) => {
      const noteTime = now + (idx * 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = (rarity === 'legendary' || rarity === 'epic') ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration - (idx * 0.08));

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    });
  }
}

window.boonAudio = new BoonAudio();

