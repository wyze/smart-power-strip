import handlebars  from 'handlebars';
import makeServer from './server/';

const connection = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
};

makeServer({
  connection,
}).then(server => {
  server.log('info', '==> ✅  Server is listening');
  server.log('info', '==> 🌎  Server, running at ' + server.info.uri);

  server.views({
    engines: {
      html: handlebars,
    },
    relativeTo: __dirname,
    path: './views',
  });
}).catch(err => {
  throw err;
});
