const express = require('express');

const app = express();
const cors = require('cors');
const logger = require('morgan');
const routes = require('./api/routes');

app.use(logger('dev'));
app.use(cors());
routes(app);

const port = process.env.PORT || 3000;

// TODO use a log library like winston
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running in the port ${port}`));

module.exports = app;
