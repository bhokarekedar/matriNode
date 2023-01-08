const express = require('express')
const router = new express.Router();
const users = require('../services/users.service')

router.get("/getAllUsers", users.getAllUsers);
router.post("/updateUser", users.updateUser);
router.post("/ownProfile", users.ownProfile);
router.post("/userProfile", users.userProfile);
router.post("/deleteUser", users.deleteUser);
//export all the routes
module.exports = router;
