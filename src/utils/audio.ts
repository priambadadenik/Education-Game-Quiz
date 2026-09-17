/**
 * Web Audio API synthesizer for child-friendly game sounds
 * No external MP3 downloads required!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCorrect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Pleasant major triad C5 - E5 - G5
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  playWrong() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playTick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playFanfare() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Fanfare melody: G4, C5, E5, G5
    const notes = [
      { f: 392.0, t: 0.0, d: 0.15 },
      { f: 523.25, t: 0.15, d: 0.15 },
      { f: 659.25, t: 0.3, d: 0.18 },
      { f: 783.99, t: 0.48, d: 0.45 },
    ];

    notes.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now + item.t);

      gain.gain.setValueAtTime(0.15, now + item.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + item.t);
      osc.stop(now + item.t + item.d + 0.05);
    });
  }
}

export const soundEngine = new SoundEngine();
