import { Tweenable } from 'shifty';
import { COLOR } from '../color';
import { getRandomValueFromArray} from '../random';

export default class StrobeEffect {
  constructor({ attrs, setAttribute }) {
    this.attribute = 'backgroundColor';
    this.tweenable = new Tweenable();
    this.defaultState = attrs;
    this.setAttribute = setAttribute;
    this.strobeColors = [
      COLOR.LIGHT_GREY,
      COLOR.CLOUDS,
    ];
    this.strobeColor = getRandomValueFromArray(this.strobeColors);
  }

  animate() {
    const backgroundColor = this.defaultState[this.attribute];
    const duration = 80;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.setAttribute(this.attribute, this.strobeColor);
        setTimeout(() => {
          this.setAttribute(this.attribute, backgroundColor);
          resolve();
        }, duration / 2);
      }, duration);
    });
  }

  play() {
    return this.animate().then(() => {
      const chance = Math.random();
      switch (true) {
        case (chance < 0.04):
          return null;
        case (chance < 0.16):
          this.strobeColor = getRandomValueFromArray(this.strobeColors);
          break;
        default:
          break;
      }
      return this.play();
    });
  }
}