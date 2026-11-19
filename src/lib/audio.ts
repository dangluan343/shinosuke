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
  private currentVoiceAudio: HTMLAudioElement | null = null;

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

  // ========================================================
  // KASUKABE SQUAD & MISAE RAGE METER WEB AUDIO SYNTHESIZERS
  // ========================================================

  public playBoingSpringSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.35);

    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playAlarmWarningSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      const t = now + i * 0.14;
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.linearRampToValueAtTime(1200, t + 0.08);
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(t + 0.11);
    }
  }

  public playCalmChimeSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      const t = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.005, t + 0.3);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  public playThunderWhackImpactSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    // Big Whack
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
    g.gain.setValueAtTime(0.5, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.46);

    // Thunder rumbling noise
    const noise = this.createNoiseBuffer(0.5);
    if (noise) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noise;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(350, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);
      noiseSource.start(now);
      noiseSource.stop(now + 0.5);
    }
  }

  public playShinchanSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.65);

    for (let i = 0; i < 3; i++) {
      const chuckle = ctx.createOscillator();
      const g = ctx.createGain();
      chuckle.type = "sine";
      const t = now + 0.7 + i * 0.12;
      chuckle.frequency.setValueAtTime(520 + i * 40, t);
      chuckle.frequency.exponentialRampToValueAtTime(260, t + 0.08);
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      chuckle.connect(g);
      g.connect(dest);
      chuckle.start(t);
      chuckle.stop(t + 0.09);
    }
  }

  public playMisaeRageSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    const boing = ctx.createOscillator();
    const boingGain = ctx.createGain();
    boing.type = "sine";
    boing.frequency.setValueAtTime(240, now + 0.1);
    boing.frequency.exponentialRampToValueAtTime(700, now + 0.4);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    boingGain.gain.setValueAtTime(0.3, now + 0.1);
    boingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(dest);
    boing.connect(boingGain);
    boingGain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.4);
    boing.start(now + 0.1);
    boing.stop(now + 0.45);
  }

  public playHiroshiSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.7);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.75);

    for (let i = 0; i < 4; i++) {
      const pop = ctx.createOscillator();
      const popGain = ctx.createGain();
      pop.type = "triangle";
      const pt = now + 0.4 + i * 0.08;
      pop.frequency.setValueAtTime(900 + Math.random() * 400, pt);
      popGain.gain.setValueAtTime(0.12, pt);
      popGain.gain.exponentialRampToValueAtTime(0.001, pt + 0.05);
      pop.connect(popGain);
      popGain.connect(dest);
      pop.start(pt);
      pop.stop(pt + 0.06);
    }
  }

  public playKazamaSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      const t = now + i * 0.1;
      o.frequency.setValueAtTime(440, t);
      o.frequency.exponentialRampToValueAtTime(620, t + 0.06);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
      o.connect(g);
      g.connect(dest);
      o.start(t);
      o.stop(t + 0.08);
    }
  }

  public playNeneSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    [0, 0.15, 0.3].forEach((offset, idx) => {
      const punch = ctx.createOscillator();
      const g = ctx.createGain();
      punch.type = "square";
      const t = now + offset;
      punch.frequency.setValueAtTime(160 + idx * 20, t);
      punch.frequency.exponentialRampToValueAtTime(60, t + 0.09);
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      punch.connect(g);
      g.connect(dest);
      punch.start(t);
      punch.stop(t + 0.11);
    });
  }

  public playMasaoSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.linearRampToValueAtTime(420, now + 0.15);
    osc.frequency.linearRampToValueAtTime(330, now + 0.3);
    osc.frequency.linearRampToValueAtTime(390, now + 0.45);
    osc.frequency.linearRampToValueAtTime(280, now + 0.7);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.72);
  }

  public playBochanSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const stone = ctx.createOscillator();
    const stoneGain = ctx.createGain();
    stone.type = "sine";
    stone.frequency.setValueAtTime(110, now);
    stoneGain.gain.setValueAtTime(0.25, now);
    stoneGain.gain.linearRampToValueAtTime(0.01, now + 0.6);
    stone.connect(stoneGain);
    stoneGain.connect(dest);
    stone.start(now);
    stone.stop(now + 0.65);

    const sniff = ctx.createOscillator();
    const sniffG = ctx.createGain();
    sniff.type = "triangle";
    sniff.frequency.setValueAtTime(200, now + 0.2);
    sniff.frequency.exponentialRampToValueAtTime(650, now + 0.45);
    sniffG.gain.setValueAtTime(0.15, now + 0.2);
    sniffG.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    sniff.connect(sniffG);
    sniffG.connect(dest);
    sniff.start(now + 0.2);
    sniff.stop(now + 0.47);
  }

  public playShiroSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    [0, 0.22].forEach((delay) => {
      const bark = ctx.createOscillator();
      const g = ctx.createGain();
      bark.type = "sawtooth";
      const t = now + delay;
      bark.frequency.setValueAtTime(680, t);
      bark.frequency.exponentialRampToValueAtTime(320, t + 0.12);
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      bark.connect(g);
      g.connect(dest);
      bark.start(t);
      bark.stop(t + 0.14);
    });
  }

  public playHimawariSFX() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    const freqs = [784, 988, 1175, 1568, 2093];
    freqs.forEach((f, i) => {
      const ch = ctx.createOscillator();
      const g = ctx.createGain();
      ch.type = "sine";
      const t = now + i * 0.08;
      ch.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.005, t + 0.25);
      ch.connect(g);
      g.connect(dest);
      ch.start(t);
      ch.stop(t + 0.26);
    });
  }

  // ==========================================
  // ANIME CARTOON CHARACTER BABBLE SYNTHESIZER
  // Zero robot TTS weirdness - 100% cute Animalese / retro anime voice chatter!
  // ==========================================

  public playCharacterBabble(char: string) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const dest = this.getDestination() || ctx.destination;
    const now = ctx.currentTime;

    switch (char) {
      case "shinchan": {
        // Shin: Playful, bouncy cartoon syllables + chuckles
        const freqs = [380, 520, 440, 620, 500];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sawtooth";
          const t = now + idx * 0.09;
          osc.frequency.setValueAtTime(f, t);
          osc.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.05);
          osc.frequency.exponentialRampToValueAtTime(f * 0.8, t + 0.08);

          g.gain.setValueAtTime(0.22, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

          osc.connect(g);
          g.connect(dest);
          osc.start(t);
          osc.stop(t + 0.085);
        });
        // Plus cute chuckles
        setTimeout(() => this.playShinchanSFX(), 450);
        break;
      }
      case "misae": {
        // Misae: Angry fast staccato scolding
        const freqs = [220, 260, 310, 280, 340, 180];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          const t = now + idx * 0.08;
          osc.frequency.setValueAtTime(f, t);
          osc.frequency.exponentialRampToValueAtTime(f * 0.85, t + 0.07);

          g.gain.setValueAtTime(0.3, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.07);

          osc.connect(g);
          g.connect(dest);
          osc.start(t);
          osc.stop(t + 0.075);
        });
        setTimeout(() => this.playMisaeRageSFX(), 450);
        break;
      }
      case "kazama": {
        // Kazama: Rapid nerdy squeaks
        const freqs = [520, 580, 640, 590, 700];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sine";
          const t = now + idx * 0.07;
          osc.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
          osc.connect(g);
          g.connect(dest);
          osc.start(t);
          osc.stop(t + 0.065);
        });
        break;
      }
      case "nene": {
        // Nene: Sharp assertive syllables + rabbit punch thuds
        const freqs = [400, 480, 360, 520];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          const t = now + idx * 0.09;
          osc.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
          osc.connect(g);
          g.connect(dest);
          osc.start(t);
          osc.stop(t + 0.085);
        });
        setTimeout(() => this.playNeneSFX(), 360);
        break;
      }
      case "masao": {
        // Masao: Trembling whimpering vibrato
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.linearRampToValueAtTime(280, now + 0.5);

        lfo.type = "sine";
        lfo.frequency.setValueAtTime(10, now);
        lfoGain.gain.setValueAtTime(25, now);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        g.gain.setValueAtTime(0.2, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.connect(g);
        g.connect(dest);
        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.5);
        osc.stop(now + 0.5);
        break;
      }
      case "bochan": {
        // Bo-chan: Slow deep resonant drone
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.6);
        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(g);
        g.connect(dest);
        osc.start(now);
        osc.stop(now + 0.62);
        setTimeout(() => this.playBochanSFX(), 300);
        break;
      }
      case "shiro": {
        this.playShiroSFX();
        break;
      }
      case "hiroshi": {
        // Hiroshi: Low exhausted sigh
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.55);
        g.gain.setValueAtTime(0.22, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.connect(g);
        g.connect(dest);
        osc.start(now);
        osc.stop(now + 0.56);
        setTimeout(() => this.playHiroshiSFX(), 350);
        break;
      }
      case "himawari": {
        // Himawari: Sweet cheerful chiming baby babble
        const notes = [880, 1175, 1318, 1760];
        notes.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          const t = now + idx * 0.08;
          osc.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.005, t + 0.2);
          osc.connect(g);
          g.connect(dest);
          osc.start(t);
          osc.stop(t + 0.21);
        });
        break;
      }
      default: {
        this.playTroubleBoing();
      }
    }
  }

  // ==========================================
  // WEB SPEECH SYNTHESIS HELPER (OPTIONAL ROBOT TTS)
  // ==========================================

  public speakVoice(text: string, rate: number = 1.0, pitch: number = 1.0, onEnd?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }
    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(
        (v) => v.lang.toLowerCase().includes("vi") || v.lang.toLowerCase().includes("vn")
      );
      const jaVoice = voices.find(
        (v) => v.lang.toLowerCase().includes("ja") || v.lang.toLowerCase().includes("jp")
      );

      if (viVoice) {
        utterance.voice = viVoice;
      } else if (jaVoice) {
        utterance.voice = jaVoice;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  // ==========================================
  // REAL CHARACTER AUDIO VOICE CLIPS
  // Pure audio files (MP3), zero robot TTS weirdness!
  // ==========================================

  public playVoiceClip(charId: string, lang: "vi" | "ja" = "vi", onEnd?: () => void) {
    if (typeof window === "undefined") {
      if (onEnd) onEnd();
      return;
    }
    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stopVoiceClip();

      const audio = new Audio(`/audio/characters/${charId}-${lang}.mp3`);
      this.currentVoiceAudio = audio;

      audio.onended = () => {
        this.currentVoiceAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.currentVoiceAudio = null;
        if (onEnd) onEnd();
      };

      audio.play().catch(() => {
        if (onEnd) onEnd();
      });
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopVoiceClip() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentVoiceAudio = null;
    }
  }
}

export const soundFx = new SoundManager();
