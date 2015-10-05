import Promise    from 'bluebird';
import plugins    from './plugins';
import routes     from './routes';
import { Server } from 'hapi';

export default function makeServer( config ) {
  const server = new Server();

  server.connection(config.connection);

  return Promise.promisify(server.register, server)(plugins)
    .then(() => server.route(routes))
    .then(() => Promise.promisify(server.start, server)())
    .then(() => server);
}
