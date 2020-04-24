const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
var Web3 = require("web3");
const flash = require('connect-flash');
const Email = require('./models/Email');
var helmet = require('helmet');

web3 = new Web3("https://rinkeby.infura.io/v3/24b49cc800a04404ae669233b6931097");
//const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/24b49cc800a04404ae669233b6931097"));
//web3 = new Web3("http://localhost:8545");

const app = express();
app.use(helmet());
app.set('view engine','ejs');

web3.eth.getCoinbase(function (err, account) {
	if(err === null) {
    coinbase = account;
    console.log(`up ${coinbase}`);
	}
});
coinbase = "0x2Ac408A583D5D2B965C65437a0e8224Ada2Aee52";
contractAddress = "0x12e18E16D0E7079A1674741d17D1c163440AF1F2";
const contractAbi = require('./contracts/contractAbi');




Election = new web3.eth.Contract(contractAbi, contractAddress);


// Passport Config
require('./config/passport')(passport);


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true }
  )
  .then(() => {
    console.log('MongoDB Connected');
    Email.deleteMany({}, () => console.log('Verification table cleared'));
  })
  .catch(err => console.log(err));





// Express body parser
app.use(express.urlencoded({ extended: true }));


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// For static front end
app.use(express.static('front-end'));

// Routes

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/result', require('./routes/result'));
app.use('/logout', require('./routes/logout'));
app.use('/verification', require('./routes/verification'));





module.exports = app;


