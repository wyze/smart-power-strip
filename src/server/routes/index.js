import db      from '../db';
import request from 'superagent';

export default [
  {
    method: 'get',
    path: '/',
    handler: {
      view: 'index',
    },
  },
  {
    method: 'get',
    path: '/promise.js',
    handler: {
      file: './node_modules/es6-promise/dist/es6-promise.min.js',
    },
  },
  {
    method: 'get',
    path: '/fetch.js',
    handler: {
      file: './node_modules/whatwg-fetch/fetch.js',
    },
  },
  {
    method: 'get',
    path: '/d3.js',
    handler: {
      file: './node_modules/d3/d3.min.js',
    },
  },
  {
    method: 'get',
    path: '/c3.js',
    handler: {
      file: './node_modules/c3/c3.min.js',
    },
  },
  {
    method: 'get',
    path: '/main.js',
    handler: {
      file: './src/scripts/main.js',
    },
  },
  {
    method: 'get',
    path: '/c3.css',
    handler: {
      file: './node_modules/c3/c3.min.css',
    },
  },
  {
    method: 'get',
    path: '/open-sans.css',
    handler: {
      file: './node_modules/npm-font-open-sans/open-sans.css',
    },
  },
  {
    method: 'get',
    path: '/styles.css',
    handler: {
      file: './src/styles/styles.css',
    },
  },
  {
    method: 'get',
    path: '/{param*}',
    handler: {
      directory: {
        path: './node_modules/npm-font-open-sans',
      },
    },
  },
  {
    method: 'get',
    path: '/numbers',
    handler: ( req, reply ) =>
      reply({
        outlet1: db.outlet1.status === 'on' ? db.outlet1.sum : 0,
        outlet2: db.outlet2.status === 'on' ? db.outlet2.sum : 0,
      }),
  },
  {
    method: 'get',
    path: '/power',
    handler: ( req, reply ) =>
      reply({
        outlet1: db.outlet1.status,
        outlet2: db.outlet2.status,
      }),
  },
  {
    method: 'put',
    path: '/reset',
    handler: ( req, reply ) => {
      db.outlet1.sum = 0;
      db.outlet2.sum = 0;

      reply('ok');
    },
  },
  {
    method: 'put',
    path: '/power/{outlet}',
    handler: ( req, reply ) => {
      const outlet = db[req.params.outlet];

      outlet.status = outlet.status === 'on' ? 'off' : 'on';

      const status = [
        db.outlet1.status === 'on' ? '1' : '0',
        db.outlet2.status === 'on' ? '1' : '0',
      ].join('');

      // send power status to xbee
      request
        .put(`http://localhost:3001/power/${status}`)
        .end(( err, res ) => {
          if ( err ) {
            console.error('xbee err', err);
          }

          console.log('xbee', res);
        });

      reply('ok');
    },
  },
  {
    method: 'put',
    path: '/xbee/number/{outlet}/{numbers}',
    handler: ( req ) => {
      const outlet = db[req.params.outlet];
      const [ high, low ] = req.params.number.split(',');

      outlet.sum = parseInt(high, 10);

      // Delay the update
      setTimeout(() => outlet.sum = parseInt(low, 10), 1000);
    },
  },
  {
    method: 'put',
    path: '/xbee/power/{status}',
    handler: ( req ) => {
      const status = parseInt(req.params.status, 10);

      db.outlet1.status = status > 1 ? 'on' : 'off';
      db.outlet2.status = status % 2 ? 'off' : 'on';
    },
  },
];
