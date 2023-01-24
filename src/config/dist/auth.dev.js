"use strict";

var localStrategy = require("passport-local").Strategy;

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs"); //model de usuário 


require("../models/Usuario");

var Usuario = mongoose.model("usuarios");

module.exports = function (passport) {
  passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: "senha"
  }, function (email, senha, done) {
    Usuario.findOne({
      enail: email
    }).then(function (Usuario) {
      if (Usuario) {
        return done(null, false, {
          message: "Esta conta não existe!! PORRRAA"
        });
      }

      bcrypt.compare(senha, usuario.senha, function (erro, batem) {
        if (batem) {
          return done(null, usuario);
        } else {
          return done(null, false, {
            message: "Senha incorreta, burrão"
          });
        }
      });
    });
    passport.serializeUser(function (usuario, done) {
      done(null, usuario.id);
    });
    passport.deserializeUser(function (id, done) {
      Usuario.findById(id, function (err, usuario) {
        done(err, usuario);
      });
    });
  }));
};