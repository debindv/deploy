const express = require('express');
const router = express.Router();
const passport = require('passport');


//Admin Login
router.get('/login', (req,res) => res.render('adminLogin'));

router.post('/login',(req, res, next) => {
 
    
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });


//Admin Dashboard

router.get('/dashboard', (req,res) => res.render('admin_dashboard'));





module.exports = router;