import { Injectable } from '@angular/core';

  @Injectable()
  export class AudioService {
    public playSoundEffect(src: string): void{
        let audio = new Audio();
        audio.src = src;
        audio.load();
        audio.play();
    }

    public playBroomSweepingSound(): void{
        let src = "app/audio/sweep.mp3";
        this.playSoundEffect(src);
    }

    public playBroomDesweepingSound(): void{
        let src = "app/audio/desweep.mp3";
        this.playSoundEffect(src);
    }

    public playCollisionSoundEffect(): void {
        let src = "app/audio/curling_rock_collision.mp3";
        this.playSoundEffect(src);
    }
  }
