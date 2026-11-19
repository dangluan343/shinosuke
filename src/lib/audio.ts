"use client";

/**
 * Web Audio API Sound Synthesizer for Shinosuke Fan Hub
 * 100% synthetic, zero external file dependencies, ultra-fast 90s anime retro SFX & 8-bit Chiptune BGM.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private muted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmVolume: number = 0.16;
  private bgmGainNode: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private currentBgmStep: number = 0;
  private nextStepTime: number = 0;
  private bgmListeners: Array<(isPlaying: boolean) => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("shin_sound_muted");
      this.muted = savedMute === "true";
      const savedVol = localStorage.getItem("shin_bgm_volume");
      if (savedVol) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.bgmVolume = parsed;
        }
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && !this.masterGain) {
      // Dynamics compressor + Master gain limiter to eliminate clipping / voice distortion
      this.masterGain = this.ctx.createGain();
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getDestination(): AudioNode | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    return this.masterGain || ctx.destination;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("shin_sound_muted", String(this.muted));
    }
    if (this.ctx) {
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime);
      }
      if (this.bgmGainNode) {
        this.bgmGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        const targetGain = this.muted ? 0 : this.bgmVolume;
        this.bgmGainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      }
    }
    return this.muted;
  }

  private createNoiseBuffer(duration: number = 0.3): AudioBuffer | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // ==========================================
  // CORE RETRO SOUND EFFECTS (SFX)
  // ==========================================

  /**
   * Action Beam! Futuristic 90s hero laser sweep sound
   */
  public playActionBeam() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.45);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Trouble Boing! Comic cartoon bounce when causing mischief
   */
  public playTroubleBoing() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Anger Alarm! Fast comic siren when Misae reaches 100% anger
   */
  public playAngerAlarm() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(580, now + 0.1);
    osc.frequency.setValueAtTime(880, now + 0.2);
    osc.frequency.setValueAtTime(580, now + 0.3);
    osc.frequency.setValueAtTime(880, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  /**
   * Chocobi Sparkle Chime! Cheerful arpeggio when collecting snacks or opening cards
   */
  public playSparkleChime() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  /**
   * Crisp UI Click Pop for buttons
   */
  public playClickPop() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Hit Pepper Ouch! Harsh cartoon splat when hit by bell pepper
   */
  public playHitPepper() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Power Up! Ascending energetic arcade scale
   */
  public playPowerUp() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  /**
   * Retro Game Over sad fanfare
   */
  public playGameOver() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const notes = [440, 415.3, 392, 349.23]; // A4, Ab4, G4, F4
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.22);
    });
  }

  // ==========================================
  // PHASE 3 EXPANDED RETRO SOUND EFFECTS
  // ==========================================

  /**
   * 1. Buri Buri Wiggle! Oscillating butt dance wobble
   */
  public playBuriBuriWiggle() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const mainGain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(14, now); // 14Hz butt-wiggle vibrato
    lfoGain.gain.setValueAtTime(80, now);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    mainGain.gain.setValueAtTime(0.35, now);
    mainGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(mainGain);
    mainGain.connect(dest);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.45);
    osc.stop(now + 0.45);
  }

  /**
   * 2. Action Explosion! Super Action Mask boom & laser impact
   */
  public playActionExplosion() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    // Sub bass drop
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(180, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
    subGain.gain.setValueAtTime(0.45, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    subOsc.connect(subGain);
    subGain.connect(dest);
    subOsc.start(now);
    subOsc.stop(now + 0.35);

    // Filtered noise explosion burst
    const noise = this.createNoiseBuffer(0.35);
    if (noise) {
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      source.start(now);
      source.stop(now + 0.35);
    }
  }

  /**
   * 3. Misae Rage Roar! Sư tử Hà Đông angry growl
   */
  public playMisaeRoar() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.linearRampToValueAtTime(65, now + 0.55);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(750, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.55);
    filter.Q.setValueAtTime(6, now);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  /**
   * 4. Chocobi Crunch! Snappy crispy biscuit bite
   */
  public playChocobiCrunch() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    [0, 0.08].forEach((offset) => {
      const now = ctx.currentTime + offset;
      const noise = this.createNoiseBuffer(0.06);
      if (!noise) return;

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noise;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      noiseSource.start(now);
      noiseSource.stop(now + 0.06);
    });
  }

  /**
   * 5. Shiro Bark! High-pitched cute puppy yip (Gâu gâu)
   */
  public playShiroBark() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    [0, 0.12].forEach((offset) => {
      const now = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.09);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.09);
    });
  }

  /**
   * 6. Flirt Whistle! Wolf-whistle at pretty big sister
   */
  public playFlirtWhistle() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    // Slide up
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(620, now);
    osc1.frequency.exponentialRampToValueAtTime(1380, now + 0.16);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc1.connect(gain1);
    gain1.connect(dest);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // Slide down
    const now2 = now + 0.2;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1420, now2);
    osc2.frequency.exponentialRampToValueAtTime(820, now2 + 0.22);
    gain2.gain.setValueAtTime(0.3, now2);
    gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.22);
    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(now2);
    osc2.stop(now2 + 0.22);
  }

  /**
   * 7. Comic Slap! Head bonk / fist punch slap
   */
  public playComicSlap() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.08);

    const noise = this.createNoiseBuffer(0.05);
    if (noise) {
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const ngain = ctx.createGain();
      ngain.gain.setValueAtTime(0.3, now);
      ngain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      src.connect(ngain);
      ngain.connect(dest);
      src.start(now);
      src.stop(now + 0.05);
    }
  }

  /**
   * 8. Rattle Box! Shaking the Chocobi fortune box
   */
  public playRattleBox() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;

    [0, 0.04, 0.08, 0.12].forEach((offset) => {
      const now = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320 + Math.random() * 140, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.03);
    });
  }

  // ==========================================
  // 8-BIT CHIPTUNE ANIME BGM SYNTHESIZER ENGINE
  // ==========================================

  private notifyBgmListeners() {
    this.bgmListeners.forEach((cb) => {
      try {
        cb(this.bgmPlaying);
      } catch {
        // ignore listener errors
      }
    });
  }

  public onBgmStateChange(cb: (isPlaying: boolean) => void): () => void {
    this.bgmListeners.push(cb);
    return () => {
      this.bgmListeners = this.bgmListeners.filter((l) => l !== cb);
    };
  }

  public isBgmPlaying(): boolean {
    return this.bgmPlaying;
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("shin_bgm_volume", String(this.bgmVolume));
    }
    if (this.bgmGainNode && this.ctx) {
      const targetGain = this.muted ? 0 : this.bgmVolume;
      this.bgmGainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  public startBgm() {
    if (this.bgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (!this.bgmGainNode) {
      this.bgmGainNode = ctx.createGain();
      const dest = this.getDestination() || ctx.destination;
      this.bgmGainNode.connect(dest);
    }

    this.bgmGainNode.gain.cancelScheduledValues(ctx.currentTime);
    const targetGain = this.muted ? 0 : this.bgmVolume;
    this.bgmGainNode.gain.setValueAtTime(targetGain, ctx.currentTime);

    this.bgmPlaying = true;
    this.currentBgmStep = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

    // Scheduler tick every 25ms
    this.bgmIntervalId = window.setInterval(() => {
      this.scheduleBgmSteps();
    }, 25);

    this.notifyBgmListeners();
  }

  public stopBgm() {
    if (!this.bgmPlaying) return;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    }
    this.bgmPlaying = false;
    this.notifyBgmListeners();
  }

  public toggleBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  /**
   * Lookahead Web Audio step sequencer (32 steps = 2 bars of 16th notes @ 135 BPM)
   */
  private scheduleBgmSteps() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGainNode || !this.bgmPlaying) return;

    // Prevent backlog scheduling burst if tab was throttled or suspended
    if (this.nextStepTime < ctx.currentTime) {
      this.nextStepTime = ctx.currentTime;
    }

    // Step duration: 60 / 135 / 4 ≈ 0.111s
    const stepDuration = 0.115;
    const lookahead = 0.12;

    // 32-step upbeat Kasukabe anime chiptune loop
    // Melody notes in Hz
    const leadNotes: number[] = [
      // Measure 1
      523.25, 0, 523.25, 659.25, 783.99, 0, 880.0, 783.99, 659.25, 0, 523.25, 0, 587.33, 659.25, 587.33, 0,
      // Measure 2
      523.25, 0, 523.25, 659.25, 783.99, 0, 1046.5, 880.0, 783.99, 659.25, 587.33, 659.25, 523.25, 0, 523.25, 0,
    ];

    // Bass notes in Hz (triangle walking bass)
    const bassNotes: number[] = [
      // Measure 1
      130.81, 0, 130.81, 0, 174.61, 0, 174.61, 0, 196.0, 0, 196.0, 0, 130.81, 0, 196.0, 0,
      // Measure 2
      220.0, 0, 220.0, 0, 174.61, 0, 174.61, 0, 196.0, 0, 196.0, 0, 130.81, 0, 130.81, 0,
    ];

    while (this.nextStepTime < ctx.currentTime + lookahead) {
      const step = this.currentBgmStep;
      const time = this.nextStepTime;

      // 1. Lead Chiptune Channel (Square wave)
      const leadFreq = leadNotes[step];
      if (leadFreq > 0) {
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = "square";
        leadOsc.frequency.setValueAtTime(leadFreq, time);

        leadGain.gain.setValueAtTime(0.12, time);
        leadGain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 0.85);

        leadOsc.connect(leadGain);
        leadGain.connect(this.bgmGainNode);

        leadOsc.start(time);
        leadOsc.stop(time + stepDuration * 0.85);
      }

      // 2. Bass Channel (Triangle wave)
      const bassFreq = bassNotes[step];
      if (bassFreq > 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = "triangle";
        bassOsc.frequency.setValueAtTime(bassFreq, time);

        bassGain.gain.setValueAtTime(0.2, time);
        bassGain.gain.exponentialRampToValueAtTime(0.01, time + stepDuration * 1.5);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGainNode);

        bassOsc.start(time);
        bassOsc.stop(time + stepDuration * 1.5);
      }

      // 3. Rhythm Channel: Kick on quarters (0, 4, 8, 12, 16, 20, 24, 28)
      if (step % 4 === 0) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = "sine";
        kickOsc.frequency.setValueAtTime(110, time);
        kickOsc.frequency.exponentialRampToValueAtTime(35, time + 0.06);

        kickGain.gain.setValueAtTime(0.18, time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGainNode);

        kickOsc.start(time);
        kickOsc.stop(time + 0.06);
      }

      // 4. Rhythm Channel: Snare tick on off-beats (2, 6, 10, 14, 18, 22, 26, 30)
      if (step % 4 === 2) {
        const snareNoise = this.createNoiseBuffer(0.04);
        if (snareNoise) {
          const snareSrc = ctx.createBufferSource();
          snareSrc.buffer = snareNoise;
          const snareFilter = ctx.createBiquadFilter();
          snareFilter.type = "highpass";
          snareFilter.frequency.setValueAtTime(1800, time);
          const sGain = ctx.createGain();
          sGain.gain.setValueAtTime(0.08, time);
          sGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

          snareSrc.connect(snareFilter);
          snareFilter.connect(sGain);
          sGain.connect(this.bgmGainNode);

          snareSrc.start(time);
          snareSrc.stop(time + 0.04);
        }
      }

      this.nextStepTime += stepDuration;
      this.currentBgmStep = (this.currentBgmStep + 1) % 32;
    }
  }
}

export const soundFx = new SoundManager();
