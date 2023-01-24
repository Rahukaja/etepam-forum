'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var express = require("express");

var routes = express.Router();
var app = express();

var path = require('path');

var Post = require('./models/Post');

var mongoose = require("mongoose");

require("./models/Categoria");

var Categoria = mongoose.model("categoria");

var multer = require("multer");

var _require = require("zlib"),
    createBrotliCompress = _require.createBrotliCompress;

var db = require("./models/db");

var passport = require("passport");

var _require2 = require("./helpers/eAdmin"),
    eAdmin = _require2.eAdmin; //const upload = multer({dest: "uploads/"})
//CONFIG MULTER


var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
}); //Grupo das rotas

routes.get('/login-adm', function (req, res) {
  res.render('admlog');
});
routes.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/mural",
    failureRedirect: "admlog",
    failureFlash: true
  })(req, res, next);
});
routes.get('/inicial', function (req, res) {
  res.render('inicial');
});
routes.get('/mural', eAdmin, function (req, res) {
  /*b.fileExample.findAll().then(function(results) {
       if (results) {
           //Loop in the result array
           results.forEach(function (item){
             try{
                 base64_decode(item.file,item.fileName);
             }catch (e){
               console.log(e+' Erro ao criar o documento');
             }
           });//End of forEach*/
  Post.findAll({
    order: [['id', 'DESC']]
  }).then(function (posts) {
    console.log(posts);
    res.render('./admin/post', {
      posts: posts,
      layout: false
    });
  });
});
routes.get('/postagem', function (req, res) {
  Post.findAll({
    order: [['id', 'DESC']]
  }).then(function (posts) {
    console.log(posts);
    res.render('postagem', {
      posts: posts,
      layout: false
    });
  });
});
routes.get('/contato', function (req, res) {
  res.render('contato');
});
routes.get('/saiba-mais', function (req, res) {
  res.render('mais');
});
routes.get('/categorias', function (req, res) {
  Categoria.find().lean().then(function (categorias) {
    res.render('./admin/categorias', {
      categorias: categorias,
      layout: false
    });
  })["catch"](function (err) {
    req.flash("error_msg", "Falha ao listar as categoria" + err);
    res.redirect("/admin");
  });
});
{
  app.use(express["static"](path.join(__dirname, '../formulario.handlebars')));
  routes.get('/cadastrar', function (req, res) {
    res.render('new-post', {
      layout: false
    });
  });
} //adicionar post

{
  routes.post('/add', upload.single("Image"), function (req, res) {
    //era app.post
    //res.json(req.file);
    Post.create({
      titulo: req.body.titulo,
      Image: req.body.Image,
      conteudo: req.body.conteudo
    }).then(function () {
      res.redirect('/mural');
    })["catch"](function (erro) {
      res.send("Houve um erro" + erro);
    });
  });
}
routes.post("/categoria/nova", function (req, res) {
  var erros = [];

  if (req.body.titulo || _typeof(req.body.titulo) == undefined || req.body.titulo == null) {
    erros.push({
      texto: "nome inválido"
    });
  }

  if (req.body.conteudo || _typeof(req.body.conteudo) == undefined || req.body.conteudo == null) {
    erros.push({
      texto: "conteudo inválido"
    });
  }

  if (req.body.img || _typeof(req.body.img) == undefined || req.body.img == null) {
    erros.push({
      texto: "imagem inválida"
    });
  }

  if (req.body.slug || _typeof(req.body.slug) == undefined || req.body.slug == null) {
    erros.push({
      texto: "imagem inválida"
    });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", {
      erros: erros
    });
  }

  var novaCategoria = {
    titulo: req.body.titulo,
    conteudo: req.body.conteudo,
    img: req.body.img,
    slug: req.body.slug
  };
  new Categoria(novaCategoria).save().then(function () {
    req.flash("success_msg", "Categoria criada com sucesso");
    res.redirect("/admin/categorias");
  })["catch"](function (err) {
    req.flash("error_msg", "Falha ao criar a categoria");
    console.log("Erro ao salvar categoria" + err);
  });
}); // Route to display static src images

routes.get("/static", function (req, res) {
  res.render('static');
}); // Route to display dynamic src images

routes.get("/dynamic", function (req, res) {
  imageList = [];
  imageList.push({
    src: "icons/flask.png",
    name: "flask"
  });
  imageList.push({
    src: "icons/javascript.png",
    name: "javascript"
  });
  imageList.push({
    src: "icons/react.png",
    name: "react"
  });
  res.render('dynamic', {
    imageList: imageList
  });
}); //Deletar o post 

routes.get('/deletar/:id', function (req, res) {
  Post.destroy({
    where: {
      'id': req.params.id
    }
  }).then(function () {
    res.redirect('/mural');
  })["catch"](function (erro) {
    res.send("Falha ao DELETAR a postagem" + erro);
  });
});
module.exports = routes;