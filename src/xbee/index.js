//import db             from '../server/db';
import request        from 'superagent';
import { SerialPort } from 'serialport';
import { Server }     from 'hapi';

const serialPort = new SerialPort('/dev/ttyUSB0', { 
  baudrate: 9600
}, false);

const server = new Server();

server.connection({ host: 'localhost', port: 3001 });

server.route({
  method: 'put',
  path: '/power/{state}',
  handler: ( request, reply ) => {
    serialPort.write(request.params.state + '\n', ( err, res ) => {
      console.log('err', err);
      console.log('res', res);
    });
  },
});

//export default () =>
//  setTimeout(() =>
    serialPort.open(function () {
      console.log('Serial port open.');

      // data recieved
      serialPort.on('data', function(data) {
        const number = data[0];

        //db.outlet1.sum = number;
        //db.outlet2.sum = number;
        try {
          request.put('http://localhost:3000/number/outlet1/' + number)
            .end(( err, res ) => {
              if ( err ) {
                console.error('error:', err);
              }

              console.log('outlet1', res)
            });
          request.put('http://localhost:3000/number/outlet2/' + number)
            .end(( err, res ) => {
              if ( err ) {
                console.error('error2:', err);
              }

              console.log('outlet2', res);
            });
        } catch ( e ) {
          console.log('request error', e);
        }

        //console.log('data received: ' + data[0]);
      });

      // send data
      serialPort.write('00\n', function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });

      server.start(() => console.log('Xbee server running at:', server.info.uri));
    });
//    500)
