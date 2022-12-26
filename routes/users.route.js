const express = require('express')
const router = new express.Router();
const users = require('../services/users.service')

router.get("/getAllUsers", users.getAllUsers);

//export all the routes
module.exports = router;
