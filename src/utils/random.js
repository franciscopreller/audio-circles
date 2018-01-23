export function getRandomKeyFromObject(obj) {
  const keys = Object.keys(obj);
  // eslint-disable-next-line
  return obj[keys[keys.length * Math.random() << 0]];
}

export function getRandomValueFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomIntFromInterval(min, max) {
  return Math.floor((Math.random() * (max - (min + 1))) + min);
}
