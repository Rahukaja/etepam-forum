const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//model de usuário 
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField:"senha"},(email, senha, done) => {

        Usuario.findOne({enail: email}).then((Usuario)=> {
            if (Usuario){
                return done(null, false, {message: "Esta conta não existe!! PORRRAA"})
            }
            bcrypt.compare(senha, usuario.senha,(erro, batem)=>{

                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta, burrão"})
                }

            })
        })
        passport.serializeUser((usuario, done)=>{
            done(null, usuario.id)
        })
        passport.deserializeUser((id, done)=>{
            Usuario.findById(id,(err,usuario)=>{
                done(err, usuario)
            })
        })
    })
    
)}