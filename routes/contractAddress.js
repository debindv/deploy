const express = require('express');
const router = express.Router();
const path = require('path');



router.post('/', (req,res) => {
    var caddr = //CONTRACT ADDRESS FROM EJS
    // contractAddress = caddr;
    console.log(`COINBASE NEW ADDRESS ${caddr}`);
    // const contractAbi = require('./contracts/contractAbi');

    // Election = new web3.eth.Contract(
    //     contractAbi, contractAddress
    // );
});


module.exports = router;