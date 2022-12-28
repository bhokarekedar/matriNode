const express = require('express')
const router = new express.Router();
const auth = require('../services/auth.service')

router.post("/register", auth.registerUser);
router.post("/forgotPassword", auth.forgotPassword);
router.post("/confirmOtp", auth.confirmOtp);
router.post("/login", auth.loginUser);

//export all the routes
module.exports = router;
