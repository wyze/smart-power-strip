import good        from 'good';
import goodConsole from 'good-console';
import inert       from 'inert';
import vision      from 'vision';

export default [
  {
    register: good,
    options: {
      reporters: [{
        reporter: goodConsole,
        events: {
          response: '*',
          log: '*',
        },
      }],
    },
  },
  { register: inert },
  { register: vision },
];
