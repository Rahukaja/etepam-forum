"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Usuario = new Schema({
  email: {
    type: String,
    required: true
  },
  eAdmin: {
    type: Number,
    "default": 0
  },
  senha: {
    type: String,
    required: true
  }
});
mongoose.model("usuarios", Usuario);