<template>
  <div id="app"
    class="site-wrapper">
    <div class="site-wrapper-inner">
      <div class="cover-container">
        <header class="masthead clearfix"
          v-bind:class="{ 'hidden': isHidden(), 'visible': isVisible() }">
          <div class="inner">
            <h3 class="masthead-brand">{{ title }}</h3>
          </div>
        </header>
        <main role="main"
          class="inner cover"
          v-bind:class="{ 'hidden': isHidden(), 'visible': isVisible() }">
          <router-view/>
        </main>
        <visualizer />
        <footer class="mastfoot">
          <div class="inner">
            <p>Copyright {{ year }} - @franciscopreller</p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Visualizer from './components/Visualizer';

const ACTIVE_DELAY = 5000;
let userActiveTimeout;

export default {
  name: 'App',
  data: () => ({
    title: 'AudioCircles',
    playerActive: false,
    userActive: true,
    year: new Date().getFullYear(),
  }),
  components: {
    Visualizer,
  },
  methods: {

    isVisible() {
      return (!this.playerActive || this.userActive);
    },

    isHidden() {
      return (this.playerActive && !this.userActive);
    },

    flagUserAsActive() {
      this.userActive = true;

      // In ACTIVE_DELAY seconds, user will be marked as inactive unless they act again
      clearTimeout(userActiveTimeout);
      userActiveTimeout = setTimeout(() => {
        this.userActive = false;
      }, ACTIVE_DELAY);
    },

  },
  created() {
    // Set an event for when the player is pllaying/paused
    this.$root.$on('playerPlayingStateChanged', (state) => {
      this.playerActive = (state === 'PLAYER_PLAYING');
    });

    // When the user moves the mouse, we'll assume he is active for another 3 seconds
    window.addEventListener('mousemove', this.flagUserAsActive);
    window.addEventListener('click', this.flagUserAsActive);
  },
};
</script>

<style>
.visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s linear;
}
.hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 1.5s, opacity 1.5s linear;
}
</style>
