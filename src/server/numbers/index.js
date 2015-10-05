const { abs, floor, random } = Math;
const current = ( num ) => abs((5 / (1024 * 0.04)) * (num - 515));

export default function numbers() {
  let sum = 0;

  for ( let i = 0; i < 100; i++ ) { // eslint-disable-line id-length
    sum += current(floor((random() * 550) + 500));
  }

  return sum / 100;
}
