import { Tweenable } from 'shifty';
import { COLOR, decToHex, hexToRgb, rgbToHex } from '../color';
import {getRandomIntFromInterval, getRandomValueFromArray} from '../random';

export default class FlashEffect {
  constructor({ attrs, setAttribute }) {
    this.attribute = 'backgroundColor';
    this.tweenable = new Tweenable();
    this.defaultState = attrs;
    this.setAttribute = setAttribute;
    this.strobeColors = [
      COLOR.GREY,
      COLOR.WHITE,
      COLOR.LIGHT_GREY,
      COLOR.LIGHT_ORANGE,
      COLOR.CONCRETE,
      COLOR.CLOUDS,
      COLOR.SILVER,
      COLOR.SUNFLOWER,
    ];
    this.strobeColor = getRandomValueFromArray(this.strobeColors);
  }

  animate() {
    const step = (s) => {
      const hexString = rgbToHex(Math.round(s.r, 0), Math.round(s.g, 0), Math.round(s.b, 0));
      this.setAttribute(this.attribute, parseInt(hexString, 16));
    };
    const backgroundColor = this.defaultState[this.attribute];
    const duration = getRandomIntFromInterval(80, 180);

    return this.tweenable
      .tween({
        from: hexToRgb(decToHex(backgroundColor)),
        to: hexToRgb(decToHex(this.strobeColor)),
        duration,
        step,
      })
      .then(from => this.tweenable.tween({
        from,
        to: hexToRgb(decToHex(backgroundColor)),
        duration: duration / 2,
        step,
      }));
  }

  play() {
    return this.animate().then(() => {
      const chance = Math.random();
      switch (true) {
        case (chance < 0.035):
          return null;
        case (chance < 0.25):
          this.strobeColor = getRandomValueFromArray(this.strobeColors);
          break;
        default:
          break;
      }
      return this.play();
    });
  }
}