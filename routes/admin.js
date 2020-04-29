const express = require('express');
const router = express.Router();
const passport = require('passport');
const admin = require('../models/admin');
const bcrypt = require('bcryptjs');
require('../config/passport')(passport); 

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

router.post('/login',(req, res) => {

    const {emailID,password} = req.body;
   
    admin.findOne({emailID:emailID}).then(user => {
        if(user){
          console.log(user.password);
           if(user.password == password){
             res.redirect('/admin/dashboard');
           } else {
             res.send('Passwords do not match');
           }
        }
        else
            console.log('user not found');
   });

  //  passport.authenticate('admin-local',{
  //      successRedirect: '/admin/dashboard',
  //      failureRedirect: '/admin/login',
  //      failureMessage: 'oopss'
  //  })(req,res,next);
    

  });


//Admin Dashboard

router.get('/dashboard',  (req,res) => res.render('admin_dashboard'));
router.get('/votedList',ensureAuthenticated, (req,res) => res.render('votedList'));


module.exports = router;