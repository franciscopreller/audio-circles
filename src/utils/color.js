/* eslint-disable */

export const COLOR = {
  TURQUOISE: 0x1abc9c,
  GREEN_SEA: 0x16a085,
  SUNFLOWER: 0xf1c40f,
  ORANGE: 0xf39c12,
  EMERALD: 0x2ecc71,
  NEPHRITIS: 0x27ae60,
  CARROT: 0xe67e22,
  PUMPKIN: 0xd35400,
  PETER_RIVER: 0x3498db,
  BELIZE_HOLE: 0x2980b9,
  ALIZARIN: 0xe74c3c,
  POMGRANATE: 0xc0392b,
  AMETHYST: 0x9b59b6,
  WISTERIA: 0x8e44ad,
  CLOUDS: 0xecf0f1,
  SILVER: 0xbdc3c7,
  WET_ASPHALT: 0x34495e,
  MIDNIGHT_BLUE: 0x2c3e50,
  CONCRETE: 0x95a5a6,
  ASBESTOS: 0x7f8c8d,
  BLACK: 0x000000,
  DARK_GREY: 0x222222,
  GREY: 0x666666,
  TEAL: 0x28b48c,
  LIGHT_ORANGE: 0xeabd54,
  BLUE: 0x2160ce,
  LIGHT_GREY: 0xefefef,
  WHITE: 0xffffff,

  // Defaults
  get Defaults() {
    return {
      BACKGROUND: this.DARK_GREY,
    };
  }
};

// Taken from here, shades a color by a percent:
// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
export function morphColor(color, percent) {
  const f=parseInt(color,16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return parseInt((0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1), 16);
}

export function rgbToHex(r, g, b) {
  if (g !== undefined) {
    return Number(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).substring(1);
  } else {
    return Number(0x1000000 + r[0] * 0x10000 + r[1] * 0x100 + r[2]).toString(16).substring(1);
  }
}

export function padHexString(hex) {
  const paddedCharCount = 6 - hex.length;

  let newHex = '';
  for (let i = 0; i < paddedCharCount; i += 1) {
    newHex += '0';
  }
  newHex += hex;

  return newHex;
}

export function hexToRgb(hex) {
  if (hex.length < 6) {
    throw new Error(`Hex string passed to hexToRgb invalid '${hex}'`);
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function decToHex(dec) {
  return padHexString(dec.toString(16));
}
