const express = require('express');
const router = express.Router();
const passport = require('passport');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
   
    else{
      res.redirect('/admin/login');
    }
   
  }


//Admin Login
router.get('/login', (req,res) => res.render('adminLogin'));

router.post('/login',(req, res, next) => {
 
    
    passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/admin/login',
      failureFlash: true
    })(req, res, next);
  });


//Admin Dashboard

router.get('/dashboard', ensureAuthenticated,  (req,res) => res.render('admin_dashboard'));





module.exports = router;