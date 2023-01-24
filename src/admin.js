'use strict';

const express = require("express")
const routes = express.Router();
var app = express();
var path = require ('path');
const Post = require ('./models/Post') 
const mongoose = require("mongoose")
require("./models/Categoria")
const Categoria = mongoose.model("categoria")
const multer = require("multer");
const { createBrotliCompress } = require("zlib");
const db = require("./models/db");
const passport = require("passport");
const {eAdmin} = require("./helpers/eAdmin")
//const upload = multer({dest: "uploads/"})

//CONFIG MULTER
const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null,"uploads/")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + Date.now() + path.extname(file.originalname));
    }   
})
const upload = multer ({storage})


//Grupo das rotas

routes.get('/login-adm', function(req, res) {
    res.render('admlog')
})
routes.post("/login", (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: "/mural",
        failureRedirect: "admlog",
        failureFlash: true 
    })(req, res, next)
})

routes.get('/inicial', function(req, res) {
    res.render('inicial')
})
routes.get('/mural', function(req, res) {
    
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
    
    Post.findAll({ order: [['id', 'DESC']]}).then(function(posts){
        console.log(posts);
        res.render('./admin/post', {posts: posts, layout: false});
    })}
);
    routes.get('/postagem', function(req, res) {
        Post.findAll({ order: [['id', 'DESC']]}).then(function(posts){
            console.log(posts);
            res.render('postagem', {posts: posts, layout: false});
      
    })
})
    routes.get('/contato', function(req, res) {
        res.render('contato')
    })

routes.get('/saiba-mais', function(req, res) {
    res.render('mais')
})


routes.get('/categorias', function (req, res) {
    Categoria.find().lean().then((categorias)=> {
        res.render('./admin/categorias',{categorias: categorias, layout: false, })
    }).catch((err)=>{
        req.flash("error_msg", "Falha ao listar as categoria"+ err)
        res.redirect("/admin")
    })

})


{app.use(express.static(path.join(__dirname, '../formulario.handlebars')));
routes.get('/cadastrar', function (req, res) {
    res.render('new-post', {layout: false});
})}






//adicionar post
{
    routes.post('/add',upload.single("Image"), function(req, res) { //era app.post
        //res.json(req.file);
  


        Post.create({
            titulo:req.body.titulo,
            Image: req.body.Image,
            conteudo: req.body.conteudo,
        }).then(function() {
            res.redirect('/mural');
        }).catch(function (erro) {
            res.send("Houve um erro" +erro);
        })
    })}





routes.post("/categoria/nova",(req, res)=> {
    var erros = []

    if(req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo== null){
        erros.push({texto: "nome inválido"})
    }
    if(req.body.conteudo || typeof req.body.conteudo== undefined || req.body.conteudo == null){
        erros.push({texto: "conteudo inválido"})
    }
    if(req.body.img || typeof req.body.img == undefined || req.body.img == null){
        erros.push({texto: "imagem inválida"})
    }
    if(req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "imagem inválida"})
    }
    if(erros.length >0){
        res.render("admin/addcategorias", {erros: erros})
    }
    const novaCategoria = {
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        img: req.body.img,
        slug: req.body.slug,
    }
    new Categoria(novaCategoria).save().then(() => {
        req.flash("success_msg", "Categoria criada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Falha ao criar a categoria")
        console.log("Erro ao salvar categoria"+ err)
    })
})



// Route to display static src images
routes.get("/static", (req, res) => {
    res.render('static');
});


// Route to display dynamic src images
routes.get("/dynamic", (req, res) => {
    imageList = [];
    imageList.push({ src: "icons/flask.png", name: "flask" });
    imageList.push({ src: "icons/javascript.png", name: "javascript" });
    imageList.push({ src: "icons/react.png", name: "react" });
    res.render('dynamic', { imageList: imageList });
});



//Deletar o post 
routes.get('/deletar/:id', function(req, res) {
    Post.destroy({
        where: {'id': req.params.id}
    }).then(function() {
        res.redirect('/mural');
    }).catch(function (erro) {
        res.send("Falha ao DELETAR a postagem" + erro)
    })

})




module.exports = routes;