const express = require('express');
var crypto = require('crypto');
const router = express.Router();
const path = require('path');
const Email = require('../models/Email');
const login = require('./login');
let hash=[];
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
  //Check whether the Voter has already voted
  Election.methods.hasVoted(mailHash)
    .call({ from: coinbase }).then((cond) => {
      if(!cond) {                                               //IF NOT VOTED
        Election.methods.candidatesCount()                      //DISPLAY THE CANDIDATES
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
                    res.render('dashboard', {cid:cid, cname:cname});                //SEND THE CANDIDATE DETAILS TO DASHBOARD.EJS
                  }
              });
            }
          });
      }
      else {
        res.render('voted', {mailHash:hash[mailHash]});                                 //IF ALREADY VOTED REDIRECTS TO VOTED.EJS PAGE
      }
    });
});  


router.post('/', function(req, res, next) {
  var voteData = req.body.selectpicker;
  mailId = login.email;
  //Converting mailId to its hash value using SHA256
  var mailHash = crypto.createHash('sha256').update(mailId).digest('hex');
  
  //SEND THE VOTING DETAILS TO BLOCKCHAIN NETWORK
  let transactionHash;
  Election.methods.vote(voteData, mailHash)
    .send({from: coinbase, gas:6000000}).then((reciept) => {
      transactionHash = reciept.transactionHash;
      hash[mailHash]=transactionHash;
      console.log(reciept);

      //RENDER THE SUCESS PAGE
      res.render('success', {mailHash:reciept.transactionHash});
    }).then( () => {

      //Adding mailHash and Candidate ID to a new collection
      new Email({
        transactionHash : hash[mailHash],
        candidateid : voteData
       }).save((err,doc) => {
        if (err) throw err;
        else console.log('Sucess')
      })
    }).catch((error) => {
      console.log(error);
    });

});






module.exports = router;