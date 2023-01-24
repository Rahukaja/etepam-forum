"use strict";

var db = require('./db'); // o './'para dizer q está na msm pasta


db.sequelize.sync().then(function () {
  console.log('Conexao com banco de dados - OK');
});
var Post = db.sequelize.define('postagens', {
  titulo: {
    type: db.Sequelize.STRING
  },
  Image: {
    type: db.Sequelize.BLOB
  },
  conteudo: {
    type: db.Sequelize.TEXT
  }
}); //Post.sync({force: true}) 

module.exports = Post;