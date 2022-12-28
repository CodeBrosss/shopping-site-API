const express = require("express");
const router = express.Router();
const { 
    signUp, 
    signIn,
    fetchAllUsers,
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess
} = require("../controllers/auth.controller");


router.route("/").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readAny", "user"),
    fetchAllUsers
);


router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

module.exports = router;