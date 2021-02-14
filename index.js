const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./api/routes');

app.use(cors());
routes(app);

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Server running in the port ${port}`));