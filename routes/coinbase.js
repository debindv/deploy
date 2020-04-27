const express = require('express');
const router = express.Router();
const path = require('path');


router.post('/' , (req,res) => {
    var address = req.body.coinbase;
    console.log(`COINBASE NEW ADDRESS ${address}`);
    coinbase = address;
    //alert('COINBASE UPDATED');
    res.render('admin_dashboard');
});


module.exports = router;