import { tween } from 'shifty';
import { decToHex, hexToRgb, rgbToHex } from './color';
import { getRandomIntFromInterval } from './random';

export function transitionColour({
  value,
  oldValue,
  duration = getRandomIntFromInterval(300, 4000),
  onUpdate,
}) {
  const valueHex = decToHex(value);
  const oldValueHex = decToHex(oldValue);

  return tween({
    from: hexToRgb(oldValueHex),
    to: hexToRgb(valueHex),
    duration,
    step: (s) => {
      const hexString = rgbToHex(Math.round(s.r, 0), Math.round(s.g, 0), Math.round(s.b, 0));
      if (typeof onUpdate === 'function') {
        onUpdate(parseInt(hexString, 16));
      }
    },
  });
}

export function transitionNumber({
  value,
  oldValue,
  duration = getRandomIntFromInterval(300, 4000),
  onUpdate,
}) {
  return tween({
    from: value,
    to: oldValue,
    duration,
    step: onUpdate,
  });
}
