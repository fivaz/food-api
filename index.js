const express = require('express');
const app = express();
const routes = require('./api/routes');

routes(app);

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Server running in the port ${port}`));