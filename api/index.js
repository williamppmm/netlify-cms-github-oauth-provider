require('dotenv').config({ silent: true });
const express = require('express');
const middleWarez = require('../index.js');

const app = express();
app.get('/auth', middleWarez.auth);
app.get('/callback', middleWarez.callback);
app.get('/success', middleWarez.success);
app.get('/', middleWarez.index);

module.exports = app;
