'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./middleware/error500.js');
const notFound = require('./middleware/error404.js');
const router = require('./routes/router.js');
const additionalRouter = require('./routes/additional-routes.js');
const userRoutes = require('./routes/user-routes.js')


// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);
app.use(additionalRouter);
app.use(userRoutes);


// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (PORT) => {
    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });
  },
};
