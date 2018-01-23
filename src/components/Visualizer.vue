<template>
  <div>
  <!--
  Visualizer is a pseudo-component since VueJS and the shadow DOM do not work with canvas,
  thus this is merely used as a wrapper and the single point in the app that interacts with
  the canvas DOM element #mainCanvas.
  -->
  </div>
</template>

<script>
import { COLOR } from '../utils/color';
import SineWaveVisualiser from '../utils/visualizers/sineWaves';
import BackgroundVisualiser from '../utils/visualizers/background';

// PIXI has to load without import, some webpack issue
const PIXI = require('pixi.js/dist/pixi');

export default {
  name: 'Visualizer',
  data: () => ({
    app: null,
    width: window.innerWidth,
    height: window.innerHeight,
    visualisers: [],
    graphics: [],
    dataArray: [],
    dataArrayLength: 6,
  }),
  methods: {

    updateCanvasToScreen() {
      this.app.renderer.resize(this.width, this.height);
      this.app.stage.x = this.width / 2;
      this.app.stage.y = this.height / 2;
      this.app.stage.pivot.x = this.width / 2;
      this.app.stage.pivot.y = this.height / 2;
    },

    clearGraphicsFromStage() {
      if (this.graphics.length > 0) {
        for (let i = 0; i < this.graphics.length; i += 1) {
          this.app.stage.removeChild(this.graphics[i]);
        }
        this.graphics = [];
      }
    },

    renderFrame(data) {
      this.clearGraphicsFromStage();

      // Store incoming data in historic array
      this.dataArray.unshift(data);
      if (this.dataArray.length > this.dataArrayLength) {
        this.dataArray.pop();
      }

      // Render all visualisers
      this.visualisers.forEach((vis) => {
        vis.loadData(this.dataArray);
        const graphic = vis.getGraphic();

        this.app.stage.addChild(graphic);
        this.graphics.push(graphic);
      });
    },

  },
  created() {
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: COLOR.Defaults.BACKGROUND,
    });

    this.app.renderer.view.id = 'mainCanvas';
    this.updateCanvasToScreen();

    // Initiate PIXI canvas
    document.body.appendChild(this.app.view);

    // Update on resize
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.updateCanvasToScreen();
      this.visualisers.forEach((vis) => {
        vis.setAttribute('width', this.width);
        vis.setAttribute('height', this.height);
      });
    });

    // Add visualisers
    const visualizerContainerAttrs = { width: this.width, height: this.height };
    this.visualisers = [
      new BackgroundVisualiser(visualizerContainerAttrs),
      new SineWaveVisualiser(visualizerContainerAttrs),
    ];

    this.$root.$on('audioData', data => this.renderFrame(data));
  },
};
</script>
