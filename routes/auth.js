const express = require("express");
const router = express.Router();
const { 
    signUp, 
    signIn,
    fetchAllUsers,
    editUser,
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


router.route("/user/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/:userId/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "user"),
    editUser
    );

module.exports = router;