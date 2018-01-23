<template>
  <div class="container">
    <p class="lead">{{ isPlaylistEmpty() ? emptyMessage : getTrack().name }}</p>
    <player-button
      @click.native="goBackward"
      icon="backward"
      :disabled="isCurrentTrackFirst()"
    />
    <player-button
      @click.native="togglePlay"
      v-bind:icon="(playing) ? 'pause' : 'play'"
      :loading="loading"
      :disabled="isPlaylistEmpty()"
    />
    <player-button
      @click.native="goForward"
      icon="forward"
      :disabled="isCurrentTrackLast()"
    />
    <audio ref="audio" crossorigin="anonymous"></audio>
  </div>
</template>

<script>
/* eslint-disable */
import playlist from '../assets/playlist.json';
import PlayerButton from './PlayerButton';

const MAX_RETRIES = 6;
const RETRY_DELAY = 200;
const PLAYER_PLAYING_STATE = 'PLAYER_PLAYING';
const PLAYER_PAUSED_STATE = 'PLAYER_PAUSED';

// https://stackoverflow.com/questions/1125084/how-to-make-the-window-full-screen-with-javascript-stretching-all-over-the-scre
function requestFullScreen(element) {
  const requestMethod = element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    requestMethod.call(element);
  }
}

export default {
  name: 'Player',
  data: () => ({
    playlist,
    emptyMessage: 'To start, add streams to your PLAYLIST',
    retries: 0,
    index: 0,
    playing: false,
    loading: false,
    audioCtx: null,
    audioSrc: null,
    analyser: null,
  }),
  components: {
    PlayerButton,
  },
  created() {
    // Replace AudioContext on browser
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (error) {
      this.message = 'Your browser is not supported by our player';
    }

    document.body.onkeydown = (event) => {
      // Space bar - play<->pause
      if (event.keyCode === 32) {
        this.togglePlay();
      }
      // Alt + Enter - full screen
      if (event.altKey && event.keyCode === 13) {
        requestFullScreen(document.body);
      }
    }
  },
  methods: {

    togglePlay() {
      if (!this.playing) {
        this.playTrack();
      } else {
        this.pauseTrack();
      }
    },

    mountAudio() {
      this.audioSrc = this.audioCtx.createMediaElementSource(this.$refs.audio);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
      this.analyser.smoothingTimeConstant = 0.85;
      this.audioSrc.connect(this.analyser);
      this.audioSrc.connect(this.audioCtx.destination);

      const sendAudioData = () => {
        if (this.playing) {
          this.$root.$emit('audioData', {
            timeDomain: this.getTimeDomain(),
            frequency: this.getFrequencyData(),
          });
        }
        requestAnimationFrame(sendAudioData);
      };
      sendAudioData();
    },

    getTimeDomain() {
      const bufferLength = 4096;
      this.analyser.fftSize = bufferLength;
      const array = new Uint8Array(bufferLength);
      this.analyser.getByteTimeDomainData(array);

      return array;
    },

    getFrequencyData() {
      const array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);

      return array;
    },

    playTrack() {
      this.loading = true;

      this.setTrackSource(this.getTrack().url);
      this.$refs.audio.play().then(() => {
        this.setPlayingState(PLAYER_PLAYING_STATE);
        this.retries = 0;
      }).catch(() => {
        if (this.retries < MAX_RETRIES) {
          this.retries += 1;
          setTimeout(this.playTrack, RETRY_DELAY);
        } else {
          this.setPlayingState(PLAYER_PAUSED_STATE);
        }
      });
    },

    pauseTrack() {
      this.playing = false;
      this.$refs.audio.pause();
      this.setPlayingState(PLAYER_PAUSED_STATE);
    },

    setPlayingState(state) {
      switch (state) {
        case PLAYER_PLAYING_STATE:
          this.loading = false;
          this.playing = true;
          break;
        case PLAYER_PAUSED_STATE:
          this.loading = false;
          this.playing = false;
          break;
        default:
          return;
      }
      this.$root.$emit('playerPlayingStateChanged', state);
    },

    setTrackSource(url) {
      if (!this.$refs.audio.src) {
        this.$refs.audio.src = url;
        this.mountAudio();
      }
      this.$refs.audio.src = url;
    },

    setTrack(trackId) {
      this.index = this.playlist.findIndex(track => track.id === trackId);
      this.setTrackSource(this.getTrack().url);
    },

    getTrack() {
      return this.playlist[this.index];
    },

    getNextTrack() {
      const lastTrackIndex = this.playlist.length - 1;
      const nextTrackIndex = this.index + 1;
      const next = this.isCurrentTrackLast() ? lastTrackIndex : nextTrackIndex;

      return this.playlist[next];
    },

    getPreviousTrack() {
      const previousTrackIndex = this.index - 1;
      const previous = this.isCurrentTrackFirst() ? 0 : previousTrackIndex;

      return this.playlist[previous];
    },

    goForward() {
      this.setTrack(this.getNextTrack().id);
      if (this.playing) {
        this.playing = false;
        this.playTrack();
      }
    },

    goBackward() {
      this.setTrack(this.getPreviousTrack().id);
      if (this.playing) {
        this.playing = false;
        this.playTrack();
      }
    },

    isCurrentTrackFirst() {
      return (this.index === 0);
    },

    isCurrentTrackLast() {
      return (this.index === (this.playlist.length - 1));
    },

    isPlaylistEmpty() {
      return (this.playlist.length === 0);
    },

  },

};
</script>
