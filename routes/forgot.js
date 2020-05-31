const express = require('express');
const router = express.Router();
var crypto = require('crypto');
const path = require('path');
const User = require('../models/User');
var async = require('async');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

router.get('/', function(req, res) {
    res.render('forgot', {
      user: req.user
    });
});

router.post('/', function(req, res, next) {

    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with this email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          auth: {
            user: 'teamblockbusterinc@gmail.com',
            pass: 'evoting123'
          }
        });
        var mailOptions = {
          from: 'Team Blockbusters <teamblockbusterinc@gmail.com>',
          to: user.email,
          subject: 'De-mocracy Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'+
          'This Link will expire in 1 hour\n\n' +
          'Team Blockbusters\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          if(err) throw err
          req.flash('success_msg', 'An e-mail has been sent to '+ user.email + ' with further instructions.\nCheck Spam folder also. Link will expire in 1 Hour.');
          res.redirect('/login');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  


module.exports = router;