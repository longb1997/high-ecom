import { app } from '@server/app';
import { envConfig } from '@server/configs';

const PORT = envConfig.app.port || 3005;

const server = app.listen(PORT, () => {
  console.log('WSV eCommerge start with port: ', PORT);
});

//use ctr+C to exit servers
process.on('SIGINT', () => {
  server.close(() => {
    console.log('WSG eCommerge exit');
  });
});
