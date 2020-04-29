const express = require('express');
const router = express.Router();
const passport = require('passport');
const admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const hasVoted = require('../models/hasVoted');
const Email = require('../models/Email');
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

//Contract address
router.post('/address', (req,res) => {
  var addr = req.body.address;
  addr = addr.trim();
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
});


//Coinbase
router.post('/coinbase', (req,res) => {
  coinbase = req.body.coinbase;
  privateKey = req.body.privatekey;
  const provider = new HDwalletProvider(
    privateKey,
    'https://ropsten.infura.io/v3/24b49cc800a04404ae669233b6931097'
  );
  web3 = new Web3(provider);
  console.log(`coinbase = ${coinbase}`);
  console.log(`PVT KEY = ${privateKey}`);
  res.redirect('/admin/dashboard');
});



module.exports = router;