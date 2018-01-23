import { morphColor } from '../color';
import { transitionColour, transitionNumber } from '../animate';
import BaseVisualizer from './base';

const PIXI = require('pixi.js/dist/pixi');

/**
 * Creates a sine-wave PIXI Graphic with plotted points, call this.getGraphic to invoke
 *
 * @param ctx
 * @param data
 * @param bufferLength
 * @param width
 * @param height
 */
const plotPoints = (ctx, data, bufferLength, width, height) => {
  const sliceWidth = (width * 1.0) / bufferLength;

  let x = 0;
  let v;
  let y;
  for (let i = 0; i < bufferLength; i += 1) {
    v = data[i] / 128.0;
    y = (v * height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx.lineTo(x, y);
};

export default class SineWaveVisualiser extends BaseVisualizer {
  constructor({ width, height }) {
    super({ width, height });
    this.attrs = [
      'bufferLength',
      'lineWidth',
      'foregroundColor',
    ];

    // Initialise attributes randomly
    this.initialiseAttributes();
  }

  onUpdateAttribute({ attributeName, value, oldValue }) {
    // let transition = null;
    // this.startAttributeAnimating(attributeName);
    // if (attributeName === 'foregroundColor') {
    //   transition = transitionColour;
    // } else if (attributeName === 'lineWidth') {
    //   transition = transitionNumber;
    // }
    // if (transition) {
    //   transition({
    //     value,
    //     oldValue,
    //     onUpdate: (updatedValue) => {
    //       this.setAttribute(attributeName, updatedValue);
    //     },
    //   }).then(() => {
    //     this.endAttributeAnimating(attributeName);
    //   });
    // }
    this.setAttribute(attributeName, value);
  }

  loadData(dataArray) {
    this.data = dataArray.map((data, i) => {
      if (i === 0 || (i % 2) === 0) {
        return data.timeDomain;
      }
      return null;
    });
  }

  render(ctx) {
    this.data.map((dataRow, idx) => this.renderDataRow(ctx, dataRow, idx));
    ctx.endFill();
  }

  renderDataRow(ctx, dataRow, index) {
    if (dataRow !== null && dataRow.constructor === Uint8Array) {
      const delta = (index + 1);
      const bufferLength = Math.floor(this.getAttribute('bufferLength') / delta);
      const foregroundColor = this.getAttribute('foregroundColor');
      const color = (delta === 1) ? foregroundColor : morphColor(foregroundColor, delta);
      const lineWidth = (delta === 1) ?
        this.getAttribute('lineWidth') :
        this.getAttribute('lineWidth') / (delta / 2);

      ctx.lineStyle(lineWidth, color, 1);
      plotPoints(ctx, dataRow, bufferLength, this.getAttribute('width'), this.getAttribute('height'));
    }
  }

  getGraphic() {
    const ctx = new PIXI.Graphics();

    this.chanceToRandomizeAttributes(0.004);
    this.render(ctx);

    return ctx;
  }
}
