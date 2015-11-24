import numbers from '../numbers';

export default {
  outlet1: {
    index: 0,
    next() {
      return numbers[this.index++] || numbers[this.index = 0];
    },
    numbers,
    status: 'off',
  },
  outlet2: {
    index: 0,
    next() {
      return numbers[this.index++] || numbers[this.index = 0];
    },
    numbers,
    status: 'off',
  },
};
