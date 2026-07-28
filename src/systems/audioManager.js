import { Howl, Howler } from "howler";

// Drop matching files into /public/audio/ to hear them — everything here
// fails silently if a file is missing, so the game works with zero audio too.
const ZONE_TRACKS = {
  meadow: "/audio/meadow.mp3",
  diorama: "/audio/diorama.mp3",
  bar: "/audio/bar.mp3",
  wordle: { src: "/audio/bg-arcade.mp3", volume: 0.2 },
  bridge: "/audio/bridge.mp3",
  vault: "/audio/vault.mp3",
};

const SFX = {
  pickup: "/audio/sfx_pickup.mp3",
  place: "/audio/sfx_place.mp3",
  portal: "/audio/sfx_portal.mp3",
  pinHit: "/audio/sfx_pin_hit.mp3",
  correct: "/audio/sfx_correct.mp3",
  wrong: "/audio/sfx_wrong.mp3",
  clink: "/audio/sfx_clink.mp3",
  bloom: "/audio/sfx_bloom.mp3",
  musicDisc: "/audio/music_disc.mp3",
};

const CROSSFADE_MS = 1500;

class AudioManager {
  constructor() {
    this.zoneHowls = {};
    this.sfxHowls = {};
    this.current = null;
    this.currentKey = null;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
  }

  _zoneHowl(key) {
    const track = ZONE_TRACKS[key];
    if (!track) return null;
    if (!this.zoneHowls[key]) {
      const src = typeof track === "string" ? track : track.src;
      this.zoneHowls[key] = new Howl({
        src: [src],
        loop: true,
        volume: 0,
        html5: true,
        onloaderror: () => {
          // No file provided for this zone yet — that's fine, stay silent.
        },
      });
    }
    return this.zoneHowls[key];
  }

  // Some zone tracks (e.g. arcade) carry a fixed volume that ignores the
  // music slider, so they don't get remixed by unrelated settings changes.
  _zoneTargetVolume(key) {
    const track = ZONE_TRACKS[key];
    if (track && typeof track === "object" && typeof track.volume === "number") {
      return track.volume;
    }
    return this.musicVolume;
  }

  setMusicVolume(v) {
    this.musicVolume = v;
    if (this.current) this.current.volume(this._zoneTargetVolume(this.currentKey));
  }

  setSfxVolume(v) {
    this.sfxVolume = v;
  }

  playZone(key) {
    if (key === this.currentKey) return;
    const prev = this.current;
    const next = this._zoneHowl(key);

    if (prev) {
      const prevRef = prev;
      prevRef.fade(prevRef.volume(), 0, CROSSFADE_MS);
      setTimeout(() => prevRef.stop(), CROSSFADE_MS + 50);
    }

    if (next) {
      try {
        next.volume(0);
        next.play();
        next.fade(0, this._zoneTargetVolume(key), CROSSFADE_MS);
      } catch {
        // ignore — missing/broken audio file
      }
    }

    this.current = next;
    this.currentKey = key;
  }

  play(sfxKey) {
    if (!SFX[sfxKey]) return;
    if (!this.sfxHowls[sfxKey]) {
      this.sfxHowls[sfxKey] = new Howl({
        src: [SFX[sfxKey]],
        volume: this.sfxVolume,
        onloaderror: () => {},
      });
    }
    const howl = this.sfxHowls[sfxKey];
    howl.volume(this.sfxVolume);
    try {
      howl.play();
    } catch {
      // ignore
    }
  }

  // Returns a Howl for the music disc so the inventory UI can drive play/pause.
  getMusicDiscHowl() {
    if (!this.sfxHowls.musicDisc) {
      this.sfxHowls.musicDisc = new Howl({
        src: [SFX.musicDisc],
        volume: this.sfxVolume,
        loop: true,
        onloaderror: () => {},
      });
    }
    return this.sfxHowls.musicDisc;
  }

  muteAll(muted) {
    Howler.mute(muted);
  }
}

export const audioManager = new AudioManager();
