const Sequelize = require('sequelize')

//conexão com o banco de dados mysql

const sequelize = new Sequelize ('postapp', 'root','k21c09j06',  { 
    host: 'localhost',
    dialect: 'mysql',
    query:{raw:true}, //resolveu o bug de não permisssão de posts pelo handlebars
    native:true,
})
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

 //comando para avisa no cmd se conseguiu conectar ao mysql

 sequelize.authenticate().then(function(){
    console.log("conectado com sucesso :)")

}).catch(function (erro){
    console.log("Falha ao se conectar:"+erro)
})
