const express = require('express');
const router = express.Router();
const passport = require('passport');
const admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const hasVoted = require('../models/hasVoted');
const Email = require('../models/Email');
const Aadhar = require('../models/Aadhar');
require('../config/passport')(passport); 
var Web3 = require("web3");
const HDwalletProvider = require('@truffle/hdwallet-provider');

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


  var ucount = 0;
  var vcount = 0;
//Admin Dashboard

router.get('/dashboard',  (req,res) => {
  User.countDocuments()
    .then((no) => ucount = no)
      .then(() => hasVoted.countDocuments())
        .then((no) => vcount = no)
            .then(() => res.render('admin_dashboard', {ucount:ucount, vcount:vcount}));
  
  // console.log(`ucount = ${ucount}`);
  // hasVoted.countDocuments().then((no) => console.log(`Voted count = ${no}`));
  
});

//Voted List
router.get('/votedList', (req,res) => {
  hasVoted.find( {}, (err, data) => {
    if (err) throw err;
    else {
        res.render('votedList',{data:data});
    }
});
});

//Aadhar Updation
router.get('/register', (req,res) => {
  res.render('register_aadhar');
});

router.post('/register', (req,res) => {
  let errors = [];
  var { name,ano, email } = req.body;
  //console.log(`NAME: ${name}, ANO: ${ano},EMAIL: ${email}`);
  email = email.toLowerCase();
  if (!name || !email || ano ) {
    errors.push({ msg: 'Please enter all fields' });
  }
  User.findOne({ email: email }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('register_aadhar', {
        errors,
        name,
        email,
        ano
      });
    } else {
      new Aadhar({
        name1 : name,
        ano1 : ano,
        email1 : email
       }).save(() => {
          console.log('Added Transaction hash to Collection');
          res.redirect('/admin/dashboard');
        }).catch((error) => {
          console.log(error);
        });
      }
  })
});

//Contract address
router.post('/address', (req,res) => {
  var addr = req.body.address;
  addr = addr.trim();
  let errors = [];
  if (!addr) {
    errors.push({ msg: 'Please enter all fields' });
    res.render('admin_dashboard', {
      errors
    });
  }
  else {
    contractAddress = addr;
    console.log(`address = ${addr}`);
    const contractAbi = require('./../contracts/contractAbi');

    Election = new web3.eth.Contract(
      contractAbi, contractAddress
    );
    console.log('Contract UPDATED')
    Email.deleteMany({}, () => console.log('Verification table cleared'));
    hasVoted.deleteMany({}, () => console.log('Has Voted Table cleared'));
    res.redirect('/admin/dashboard');
  }
});


//Coinbase
router.post('/coinbase', (req,res) => {
  coinbase = req.body.coinbase;
  privatekey = req.body.privatekey;
  
  const provider = new HDwalletProvider(
    privateKey,
    'https://ropsten.infura.io/v3/24b49cc800a04404ae669233b6931097'
  );
  web3 = new Web3(provider);
  
  res.redirect('/admin/dashboard');
  
});



module.exports = router;