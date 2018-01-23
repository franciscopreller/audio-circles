import { EventEmitter } from 'events';
import { COLOR } from '../color';
import {
  getRandomIntFromInterval,
  getRandomKeyFromObject,
  getRandomValueFromArray,
} from '../random';

export default class BaseVisualiser extends EventEmitter {
  constructor({ width, height }) {
    super();

    this.attrs = ['bufferLength'];
    this.effects = {};
    this.attributesAnimating = [];
    this.effectPlaying = false;
    this.data = [];
    this.backgroundColors = [
      COLOR.DARK_GREY,
      COLOR.MIDNIGHT_BLUE,
      COLOR.WET_ASPHALT,
      COLOR.BLACK,
    ];
    this.foregroundColors = [
      COLOR.TEAL,
      COLOR.LIGHT_ORANGE,
      COLOR.BLUE,
      COLOR.DARK_GREY,
      COLOR.TURQUOISE,
      COLOR.GREEN_SEA,
      COLOR.SUNFLOWER,
      COLOR.ORANGE,
      COLOR.EMERALD,
      COLOR.NEPHRITIS,
      COLOR.CARROT,
      COLOR.PUMPKIN,
      COLOR.PETER_RIVER,
      COLOR.BELIZE_HOLE,
      COLOR.ALIZARIN,
      COLOR.POMGRANATE,
      COLOR.AMETHYST,
      COLOR.WISTERIA,
      COLOR.CLOUDS,
      COLOR.SILVER,
      COLOR.CONCRETE,
      COLOR.ASBESTOS,
    ];
    this.bufferLengths = [
      256,
      512,
      768,
      1024,
    ];
    this.minLineWidth = 2;
    this.maxLineWidth = 8;

    // Attribute initialisation
    this.attr = {
      width,
      height,
    };

    this.on('updateAttribute', this.onUpdateAttribute);
  }

  onUpdateAttribute({ attributeName, value, oldValue }) {
    return { attributeName, value, oldValue };
  }

  // Normally this would be overwritten by the interface
  loadData(data) {
    this.data = data;
  }

  isAttributeAnimating(attributeName) {
    return this.attributesAnimating.includes(attributeName);
  }

  startAttributeAnimating(attributeName) {
    if (!this.isAttributeAnimating(attributeName)) {
      this.attributesAnimating.push(attributeName);
    }
  }

  endAttributeAnimating(attributeName) {
    if (this.isAttributeAnimating(attributeName)) {
      const index = this.attributesAnimating.indexOf(attributeName);
      this.attributesAnimating.splice(index, 1);
    }
  }

  chanceToTriggerRandomizedEffect(chance = 0.001) {
    if (!this.effectPlaying && this.effects.length > 0 && Math.random() < chance) {
      const EffectClass = getRandomValueFromArray(this.effects);
      if (typeof EffectClass === 'function' && EffectClass.constructor) {
        // Before effect plays, lock down all attributes
        console.log('STARTING EFFECT');
        this.effectPlaying = true;
        this.attrs.forEach(attr => this.startAttributeAnimating(attr));
        const effect = new EffectClass({
          attrs: this.attr,
          setAttribute: this.setAttribute.bind(this),
        });
        effect.play().then(() => {
          this.effectPlaying = false;
          // Unlock attributes
          this.attrs.forEach(attr => this.endAttributeAnimating(attr));
          console.log('FINISHED EFFECT');
        });
      } else {
        throw new Error('Effect was not a function');
      }
    }
  }

  chanceToRandomizeAttributes(chance = 0.002) {
    if (!this.effectPlaying) {
      // Change all the attributes at once if an initial random roll of 10% of the chance
      if (Math.random() < (chance * 0.1)) {
        this.randomizeAttributes();
      } else {
        this.attrs.forEach((attr) => {
          let attribute = this.attr[attr];
          if (Math.random() < chance) {
            attribute = this.getRandomizedAttribute(attr);
          }
          this.updateAttribute(attr, attribute);
        });
      }
    }
  }

  initialiseAttributes(defaultAttributes = {}) {
    this.attrs.forEach((attr) => {
      let attribute = this.getRandomizedAttribute(attr);
      if (Object.keys(defaultAttributes).includes(attr)) {
        attribute = defaultAttributes[attr];
      }
      this.setAttribute(attr, attribute);
    });
  }

  randomizeAttributes() {
    this.attrs.forEach((attr) => {
      this.updateAttribute(attr, this.getRandomizedAttribute(attr));
    });
  }

  updateAttribute(attributeName, value) {
    if (!this.isAttributeAnimating(attributeName) && this.attr[attributeName] !== value) {
      this.emit('updateAttribute', { attributeName, value, oldValue: this.attr[attributeName] });
    }
  }

  setAttribute(attributeName, value) {
    this.attr[attributeName] = value;
  }

  getAttribute(attributeName) {
    if (!Object.keys(this.attr).includes(attributeName)) {
      const attributes = JSON.stringify(this.attr);
      throw new Error(`Attribute '${attributeName}' not set in Visualizer: ${attributes}`);
    }
    return this.attr[attributeName];
  }

  getRandomizedAttribute(attributeName) {
    switch (attributeName) {
      case 'foregroundColor':
        return this.getRandomForegroundColor();
      case 'backgroundColor':
        return this.getRandomBackgroundColor();
      case 'lineWidth':
        return this.getRandomLineWidth();
      case 'bufferLength':
        return this.getRandomBufferLength();
      default:
        console.log('got null attribute name', { attributeName });
        return null;
    }
  }

  getRandomForegroundColor() {
    return getRandomValueFromArray(this.foregroundColors);
  }

  getRandomBackgroundColor() {
    return getRandomValueFromArray(this.backgroundColors);
  }

  getRandomLineWidth() {
    return getRandomIntFromInterval(this.minLineWidth, this.maxLineWidth);
  }

  getRandomBufferLength() {
    return getRandomValueFromArray(this.bufferLengths);
  }
}
