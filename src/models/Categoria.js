const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Categoria = new Schema({
    titulo: {
        type: String,
        required: true
    },
    filename : {
        type : String,
        unique : true,
        required: true
    },
    contentType : {
        type: String,
        required : true
    },
    imageBase64 : {
        type : String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    }, //slug determina a url q o post estará
    slug: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: Date.now()
    }
})
//Collection
    mongoose.model("categoria", Categoria)