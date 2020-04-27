const express = require('express');
const router = express.Router();
const passport = require('passport');
 
 
router.get('/', (req,res) => res.render('adminLogin'));
 
router.post('/',(req, res, next) => {
 
    module.exports.email = req.body.email;
    passport.authenticate('local', {
      successRedirect: '/admin_dashboard',
      failureRedirect: '/adminLogin',
      failureFlash: true
    })(req, res, next);
  });
 
 
 
 
module.exports = router;