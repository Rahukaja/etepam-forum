"use strict";

module.exports = {
  eAdmin: function eAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.eADMIN == 1) {
      return next();
    }

    req.flash("error msg", "você precisa ser um admin");
    res.redirect("/inicial");
  }
};