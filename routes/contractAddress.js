const express = require('express');
const router = express.Router();
const path = require('path');



router.post('/', (req,res) => {
    var caddr = req.body.contractAddress;
    //contractAddress = caddr;
    // console.log(`COINBASE NEW ADDRESS ${caddr}`);
    const contractAbi = require('./contracts/contractAbi');

    // Election = new web3.eth.Contract(
    //     contractAbi, contractAddress
    // );
    res.render('admin_dashboard');
});


module.exports = router;