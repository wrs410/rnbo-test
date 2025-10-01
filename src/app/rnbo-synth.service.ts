import { Injectable } from '@angular/core';
import RNBO, { Device } from '@rnbo/js';

@Injectable({
  providedIn: 'root',
})
export class RnboSynthService {
  private audioContext!: AudioContext;
  private device!: Device;

  constructor() {}

  /** Initialize the RNBO device and audio context */
  async init(): Promise<void> {
      if (typeof window === 'undefined') return;
    
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    
      const res = await fetch('assets/patch.export.json');
      const patchJSON = await res.json();
    
      this.device = await RNBO.createDevice({
        patcher: patchJSON,
        context: this.audioContext,
      });
    
      this.device.node.connect(this.audioContext.destination);
  }

  /** Send a note number and gate value to the RNBO patch */
  sendNote(note: number, gate: number): void {
    if (!this.device) return;
    const now = this.audioContext.currentTime * 1000; // convert seconds to ms
    
    // Send note number to [in 1]
    const noteEvent = new RNBO.MessageEvent(now, 'in1', note);
    
    // Send gate to [in 2]
    const gateEvent = new RNBO.MessageEvent(now, 'in2', gate);
    
    // Schedule events on the device
    this.device.scheduleEvent(noteEvent);
    this.device.scheduleEvent(gateEvent);
  }
}
