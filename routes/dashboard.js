const express = require('express');
var crypto = require('crypto');
const router = express.Router();
const path = require('path');
const Email = require('../models/Email');
const login = require('./login');
const Tx = require('ethereumjs-tx').Transaction;
require('dotenv').config();
//var coder = require("./node_modules/web3/lib/solidity/coder.js");
// To ensure authentication

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
   
    else{
      res.redirect('/login');
    }
   
  }
 
 
  var cid=[];
  var cname = [];
  var counter = 0;
 
//router.get('/',ensureAuthenticated, (req,res) => res.sendFile(path.join(__dirname,'../front-end','dashboard.html'))
 
 
router.get('/', ensureAuthenticated, (req,res) => {
  //Get Mail ID of the User
  //console.log(`email in dashboard = ${login.email}`);
  mailId = login.email;
  var mailHash = crypto.createHash('sha256').update(mailId).digest('hex');
  Election.methods.hasVoted(mailHash)
    .call({ from: coinbase}).then((cond) => {
      if(!cond) {
        Election.methods.candidatesCount()
          .call({ from: coinbase }).then((count) => {
            console.log(coinbase);
            for ( var i = 1; i <= count; i++ ) {
              Election.methods.getCandidate(i)
                .call({ from: coinbase }).then((val) => {
                  cid[counter] =  web3.utils.toBN(val._id).toString();
                  cname[counter] = val._name;
                  counter++;
                  //console.log(`data.id = ${cid}  and data.name = ${cname} `);
                  if(counter==count){
                    //console.log(`final cid = ${cid}  `);
                    counter = 0;
                    res.render('dashboard', {cid:cid, cname:cname});
                  }
              });
            }
          });
      }
      else {
        res.render('voted', {mailHash:mailHash});
      }
    });
});  


router.post('/', function(req, res, next) {
  var voteData = req.body.selectpicker;
  mailId = login.email;
  //Converting mailId to its hash value using SHA256
  var mailHash = crypto.createHash('sha256').update(mailId).digest('hex');
  //Adding mailHash and Candidate ID to a new collection
  new Email({
    mailHash : mailHash,
    candidateid : voteData
  }).save((err,doc) => {
    if (err) throw err;
    else console.log('Sucess')
  })
  //console.log(`HASH :${mailHash}`)
  //Pass Mail ID of the user along with voting Data
  // var functionName = 'vote' ;
  // var types = ['uint','string']; 
  // var args = [voteData, mailId];
  // var fullName = functionName + '(' + types.join() + ')';
  // var signature = crypto.createHash('sha256').update(fullName).digest('hex');
  // //var signature = crypto.SHA3(fullName,{outputLength:256}).toString(crypto.enc.Hex).slice(0, 8);
  // var dataHex = signature + web3.eth.abi.encodeParameters(types, args);
  // var data = web3.utils.randomHex(0)+dataHex;
  // //cid[counter] =  web3.utils.toBN(val._id).toString();
  // var nonce = web3.utils.toHex(web3.eth.getTransactionCount(coinbase));
  // // var gasPrice = web3.utils.toHex(web3.eth.gasPrice); 
  // var gasLimitHex = web3.utils.toHex(6000000);
  // var rawTx = { 'nonce': nonce, 'gasLimit': gasLimitHex, 'from': coinbase, 'to': contractAddress, 'data': data};
  // console.log(rawTx);
  
  // privatekey = new Buffer(process.env.PRIVATE_KEY, 'hex');
  // console.log(privatekey);
  // const tx = new Tx(rawTx);

  // tx.sign(privatekey);
  // var serializedTx = web3.utils.randomHex(0)+tx.serialize().toString('hex');
  // web3.eth.sendRawTransaction(serializedTx, function(err, txHash){ console.log(err, txHash) });

  //   // web3.eth.sendTransaction({from: coinbase, gas:6000000},Election.methods.vote(voteData, mailHash)).catch((error) => {
  //   //   console.log(error);
  //   // }).then(() => {
  //   //   res.render('success', {mailHash:mailHash});
  //   // });
  // //res.send('Succesfully Voted');

  Election.methods.vote(voteData, mailHash)
    .sendTransaction({from: coinbase, gas:6000000}).catch((error) => {
      console.log(error);
    }).then(() => {
      res.render('success', {mailHash:mailHash});
    });
  res.send('Succesfully Voted');
 
});






module.exports = router;