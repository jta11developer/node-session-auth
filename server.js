const app = require('./index');
const _CONFIG = require('./config');

app.listen(_CONFIG.server.port, () => {
  console.log(`Session auth listening on port ${_CONFIG.server.port}`);
});
