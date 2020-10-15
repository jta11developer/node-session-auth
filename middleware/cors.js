const cors = require('cors');

const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
