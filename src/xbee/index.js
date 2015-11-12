import request        from 'superagent';
import { SerialPort } from 'serialport';
import { Server }     from 'hapi';

const serialPort = new SerialPort('/dev/ttyUSB0', {
  baudrate: 9600,
}, false);

const server = new Server();

server.connection({ host: 'localhost', port: 3001 });

server.route({
  method: 'put',
  path: '/power/{state}',
  handler: req => {
    serialPort.write(req.params.state + '\n', ( err, res ) => {
      if ( err ) {
        server.log('error', 'err', err);
      }

      server.log('info', 'res', res);
    });
  },
});

serialPort.open(() => {
  server.log('info', 'Serial port open.');

  // data recieved
  serialPort.on('data', ([ data ]) => {
    const [ status, outlet, high, low ] = data.split('|');

    // Outlet1 == 19
    // Outlet2 == 17

    if ( ![ 19, 17 ].some(value => value === outlet) ) {
      return;
    }

    try {
      request.put(`http://localhost:3000/xbee/number/outlet${outlet % 3}/${high},${low}`)
        .end(err => {
          if ( err ) {
            server.log('error', 'error:', err);
          }
        });
      request.put(`http://localhost:3000/xbee/power/${status}`)
        .end(err => {
          if ( err ) {
            server.log('error', 'error:', err);
          }
        });
    } catch ( ev ) {
      server.log('error', 'request error', ev);
    }
  });

  server.start(() => server.log('info', 'Xbee server running at:', server.info.uri));
});
