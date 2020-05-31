const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Aadhar = require('../models/Aadhar');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');


//router.get('/', (req,res) => res.sendFile(path.join(__dirname,'../front-end','register.html')));

//Setting up mailer
var smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
      user: "teamblockbusterinc@gmail.com",
      pass: "evoting123"
  }
});

router.get('/' ,(req,res) => res.render('register'));

router.post('/', (req, res) => {
  var { name,ano, email, password, password2 } = req.body;
  email = email.toLowerCase();
  name  = name.toLowerCase();
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }  else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        Aadhar.findOne({ ano1: ano, name1:name, email1:email }).then(user => {
          if (user) {
            const newUser = new User({
              name,
              email,
              password
            });
    
            bcrypt.genSalt(10, (err,salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                //Generate random no for email verification
                rand=Math.floor((Math.random() * 12342545) + 47189194743);
                link="localhost:3000/login/"+rand;
                const mailOptions={
                  from : 'teamblockbusterinc@gmail.com',
                  to : email,
                  subject : "Please confirm your Email account",
                  html : 'Hello,<br> Please Click on the link to verify your email.<br> <a href="'+link+'">Email verification link</a> <br> Go to that link to confirm your id <br><br>'+link
                };  
                
                 //Send email
                 smtpTransport.sendMail(mailOptions, (error, response) => {
                  if(error){
                          console.log(error);
                          req.flash('error_msg', 'Registration failed');
                          res.redirect('/registration');
                  }else{
                          console.log("EMAIL sent");
                          newUser.token = rand;
                          newUser.save().then( () => {
                            req.flash('success_msg', 'Please check your email to verify your Email ID and confirm registration');
                            res.redirect('/login');
                          }).catch(err => console.log(err));
                        }
                });
                
                
              });
            });
          }  
          else {
            errors.push({ msg: 'Aadhaar details do not match' });
            res.render('register', {
            errors,
            name,
            email,
            password,
            password2
         });

        }

        }); 

      }

    });

  }

});
        
      
        

      
  

module.exports = router;