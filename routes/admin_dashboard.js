const express = require('express');
const router = express.Router();
const path = require('path');




//ENSURE AUTHENTICATED



router.get('/' , (req,res) => {
    res.render('admin_dashboard');
});







module.exports = router;