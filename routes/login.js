const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const accountSid = 'AC720dd0cea060426d8902c66068d5fe47';
const authToken = '4ece50e174c0b670b11800dfae898d36';
var client = require('twilio')(accountSid,authToken);

require('../config/passport')(passport); 
 
 
router.get('/', (req,res) => res.render('login'));

router.get('/:id', (req,res) => {
  var token = req.params.id;
  User.findOne({emailVerificationToken:token, emailTokenExpiry: { $gt: Date.now() }}).then((user) => {
    user.verified = 'true';
    user.save().then(() => {
      client.messages.create({
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+91'+user.pno,
        body: 'Your Account has been verified.\n\nTeam Blockbusters'
      }).then(message => console.log(message.sid));
      req.flash('success_msg','Email ID has been verified');
      res.render('login');
    }).catch((err) => console.log(err));
    
  }).catch(err => console.log(error));
});

 
router.post('/',(req, res, next) => {
 
    module.exports.email = req.body.email;
    passport.authenticate('user-local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
 
 
 
 
module.exports = router;