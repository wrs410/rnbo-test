import { Component, HostListener } from '@angular/core';
import { RnboSynthService } from './rnbo-synth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private keyToMidi: Record<string, number> = {
    'a': 60, 's': 62, 'd': 64, 'f': 65, 'g': 67,
    'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
    'w': 61, 'e': 63, 't': 66, 'y': 68, 'u': 70,
    'o': 73, 'p': 75
  };

  private audioStarted = false;

  constructor(private synth: RnboSynthService) {}

  /** Called when the user clicks "Start Synth" */
  async startAudio() {
    if (!this.audioStarted) {
      await this.synth.init();
      this.audioStarted = true;
    }
  }

  /** Listen for keyboard presses to play notes */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.audioStarted) return; // ignore keys until audio started

    const note = this.keyToMidi[event.key];
    if (note !== undefined) {
      this.synth.sendNote(note, 1); // note on
    }
  }

}
