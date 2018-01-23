import { COLOR } from '../color';
import { transitionColour } from '../animate';
import BaseVisualizer from './base';
import StrobeEffect from '../effects/strobe';
import FlashEffect from '../effects/flash';

const PIXI = require('pixi.js/dist/pixi');

export default class BackgroundVisualiser extends BaseVisualizer {
  constructor({ width, height }) {
    super({ width, height });
    this.attrs = ['backgroundColor'];
    this.effects = [
      StrobeEffect,
      FlashEffect,
    ];

    // Initialise background color to default background color
    this.initialiseAttributes({ backgroundColor: COLOR.Defaults.BACKGROUND });
  }

  onUpdateAttribute({ attributeName, value, oldValue }) {
    if (attributeName === 'backgroundColor') {
      this.startAttributeAnimating(attributeName);
      transitionColour({
        value,
        oldValue,
        onUpdate: (updatedValue) => {
          this.setAttribute(attributeName, updatedValue);
        },
      }).then(() => {
        this.endAttributeAnimating(attributeName);
      });
    }
  }

  loadData(dataArray) {
    this.data = dataArray.map(data => data.frequency);
  }

  render(ctx) {
    ctx.beginFill(this.getAttribute('backgroundColor'));
    ctx.drawRect(0, 0, this.getAttribute('width'), this.getAttribute('height'));
    ctx.endFill();
  }

  getGraphic() {
    const ctx = new PIXI.Graphics();

    this.chanceToTriggerRandomizedEffect(0.0005);
    this.chanceToRandomizeAttributes(0.002);
    this.render(ctx);

    return ctx;
  }
}
