"use strict";

var express = require('express');

var app = express();
app.set('view engine', 'hbs');
app.use(express["static"]('.'));
app.use(express["static"](__dirname + '/public'));