"use strict";

//Carregando os Módulos
var express = require('express');

var app = express();

var engines = require('consolidate');

var exphbs = require('express-handlebars');

var hbs = exphbs.create({
  /* config */
});

var path = require('path');

var handlebars = require('express-handlebars');

var bodyParser = require('body-parser');

var routes = require('./admin');

var mongoose = require('mongoose');

var session = require("express-session");

var flash = require("connect-flash");

var usuarios = require("./models/Usuario");

var passport = require('passport');

require("./config/auth")(passport); //require('./admin')(app)
//Configg
//Sessão


app.use(session({
  secret: "ultimo",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //Middleware

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
}); //Template Engine
// Register `hbs.engine` with the Express app.

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars'); // ...still have a reference to `hbs`, on which methods like `loadPartials()`
// can be called.

app.set('views', __dirname + '/../views'); //ajeitar para poder linkar cm qqrl pc

app.engine('html', engines.mustache);
app.set('view engine', 'html', 'js');
app.set('handlebars', __dirname + '/../views');
app.engine('express-handlebars', handlebars.engine({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express["static"]("images")); //body parser para a biblioteca

{
  app.use(bodyParser.urlencoded({
    extended: true
  })); //era false mudei p true

  app.use(bodyParser.json());
} //nova versão do body-parser 

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(routes); //Configuração do Mongoose
//Set up default mongoose connection

var mongoDB = 'mongodb://localhost/portifolio';
mongoose.connect(mongoDB, {
  useNewUrlParser: true
}).then(function () {
  console.log("MongoDB Conectado.");
})["catch"](function (err) {
  console.log("Houve um erro ao se conectar no mongoDB" + err);
}); //Get the default connection

var db = mongoose.connection; //Bind connection to error event (to get notification of connection errors)

db.on('error', console.error.bind(console, 'MongoDB connection error:')); //uploads

app.use('/upload', express["static"](path.resolve(__dirname + '/../uploads'))); //Public

app.use(express["static"](path.join(__dirname + '/../public')));
var PORT = 8081;
app.listen(PORT, function () {
  console.log("Servidor Rodando na url http://localhost:8081");
});