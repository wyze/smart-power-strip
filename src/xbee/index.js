import request                 from 'superagent';
import { SerialPort, parsers } from 'serialport';
import { Server }              from 'hapi';

const serialPort = new SerialPort('/dev/ttyUSB0', {
  baudrate: 9600,
  parser: parsers.readline('\n'),
}, false);

const server = new Server();

server.connection({ host: 'localhost', port: 3001 });

server.route({
  method: 'put',
  path: '/power/{state}',
  handler: req => {
    serialPort.write(req.params.state + '\n', ( err, res ) => {
      if ( err ) {
        console.log('error', 'err', err);
      }

      console.log('info', 'res', res);
    });
  },
});

serialPort.open(() => {
  console.log('info', 'Serial port open.');

  // data recieved
  serialPort.on('data', data => {
    const [ , ident, high, low ] = data.toString('ascii').split('|');
    const outlet = parseInt(ident, 10);

    // Outlet1 == 19
    // Outlet2 == 17

    if ( ![ 19, 17 ].some(value => value === outlet) ) {
      return;
    }

    try {
      request.put(`http://localhost:3000/xbee/number/outlet${outlet % 3}/${high},${low}`)
        .end(err => {
          if ( err ) {
            console.log('error', 'error:', err);
          }
        });
    } catch ( ev ) {
      console.log('error', 'request error', ev);
    }
  });

  server.start(() => console.log('info', 'Xbee server running at:', server.info.uri));
});
